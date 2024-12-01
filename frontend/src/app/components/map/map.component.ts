import { Component, Renderer2, AfterViewInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import svgPanZoom from 'svg-pan-zoom';

import { ImportsModule } from "../../imports";
import { GraveUtils } from "../../utils/GraveUtils";
import { GraveSelectionService } from "../../services/GraveSelection.service";

import { Lot } from "../../models/Lot";
import { Grave } from "../../models/Grave";

const DEFAULT_SVG_PAN_OPTIONS = {
    zoomEnabled: true,
    controlIconsEnabled: true,
    center: true,
    minZoom: 0.9,
    maxZoom: 10,
    zoomScaleSensitivity: 0.5,
    contain: true
};

@Component({
    standalone: true,
    imports: [ImportsModule],
    selector: "map-component",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.css"],
})
export class MapComponent implements AfterViewInit, OnChanges {
    @Input() lots: Lot[] = [];

    constructor(
        private http: HttpClient,
        private renderer: Renderer2,
        private graveSelectedService: GraveSelectionService
    ) {
        this.graveSelectedService.selectedItem$.subscribe(grave => {
            if (grave) {
                this.reloadSVG(grave as Grave);
            }
        });
    }

    ngAfterViewInit() {
        this.setupPanZoom();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["lots"]?.currentValue?.length) {
            this.loadSVG();
        }
    }

    private loadSVG() {
        this.http.get('/gravemap.svg', { responseType: 'text' }).subscribe(svgContent => {
            const svgContainer = document.getElementById('svg-container');
            if (svgContainer) {
                svgContainer.innerHTML = svgContent;
                const svgElement = svgContainer.querySelector('svg') as SVGElement;
                svgElement.id = 'gravemap-svg';
                svgElement.setAttribute('width', '100%');
                svgElement.setAttribute('height', '100%');
                this.addInteractions(svgElement);
                this.setupPanZoom();
            }
        });
    }

    private reloadSVG(grave: Grave) {    
        const svgContainer = document.getElementById('svg-container');
        if (svgContainer) {
            svgContainer.innerHTML = '';
            this.loadSVG();
            setTimeout(() => this.centerOnGrave(grave), 500);
        }
    }
        

    private addInteractions(svgElement: SVGElement) {
        const pathElements = Array.from(svgElement.querySelectorAll('[id*="PATH"]'));

        pathElements.forEach(pathElement => {
            this.renderer.setStyle(pathElement, 'pointer-events', 'none');
        });

        const graves = Array.from(svgElement.querySelectorAll('[id*="#"]:not([id*="PATH"])'));
        graves.forEach(element => {
            const grave = this.getGrave(element.id);
            if (grave) {
                this.addInteraction(element, grave);  
            }
        });
    }

    private addInteraction(element: Element, grave: Grave) {
        this.applyInitialStyle(element, grave);
        this.renderer.listen(element, 'mouseover', () => this.applyHoverStyle(element, grave));
        this.renderer.listen(element, 'mouseout', () => this.applyInitialStyle(element, grave));
        this.renderer.listen(element, 'click', () => this.selectGrave(grave));
    }

    private applyInitialStyle(element: Element, grave: Grave) {
        const color = this.graveSelectedService.getSelectedItem()?.id === grave.id ? 'red' : GraveUtils.getColor(grave);
        this.renderer.setStyle(element, 'fill', color);
        this.renderer.setStyle(element, 'fill-opacity', '1');
    }

    private applyHoverStyle(element: Element, grave: Grave) {
        const color = GraveUtils.getColor(grave);
        const darkerColor = this.darkenColor(color);
        this.renderer.setStyle(element, 'fill', darkerColor);
    }

    private darkenColor(color: string): string {
        const rgb = color.match(/[\da-f]{2}/gi)?.map(c => Math.max(0, parseInt(c, 16) - 50).toString(16).padStart(2, '0'));
        return `#${rgb?.join('')}`;
    }

    private selectGrave(grave: Grave) {
       alert(GraveUtils.toString(grave));
        this.graveSelectedService.selectItem(null);
    }
    

    private centerOnGrave(grave: Grave) {
        const svgElement = document.getElementById('gravemap-svg');
        if (!svgElement) return;

        const graveElement = document.getElementById(grave.id.toString());
        if (graveElement) {
            const panZoomInstance = svgPanZoom(svgElement, DEFAULT_SVG_PAN_OPTIONS);
            const { x: graveX, y: graveY } = graveElement.getBoundingClientRect();
            const { x: svgX, y: svgY } = svgElement.getBoundingClientRect();

            panZoomInstance.zoom(2.5);
            panZoomInstance.pan({
                x: svgElement.clientWidth - (graveX - svgX) * 1.92,
                y: svgElement.clientHeight - (graveY - svgY) * 1.62
            });
        }
    }

    setupPanZoom(reset = false) {
        const svgElement = document.getElementById('gravemap-svg');
        if (svgElement) {
            const panZoomInstance = svgPanZoom(svgElement, DEFAULT_SVG_PAN_OPTIONS);
            if (reset) panZoomInstance.reset();
            panZoomInstance.zoom(1.8);
            panZoomInstance.pan({ x: svgElement.clientWidth / 5, y: svgElement.clientHeight / 20 });
        }
    }

    private getGrave(identifier: string): Grave | undefined {
        if (!identifier.includes('#')) return undefined;

        const [lotName, graveIdentifier] = identifier.split('#');
        const lot = this.lots.find(lot => lot.name === lotName);
        return lot?.graves?.find(grave => grave.identifier === graveIdentifier);
    }

    zoomIn() {
        const svgElement = document.getElementById('gravemap-svg');
        if (svgElement) svgPanZoom(svgElement, DEFAULT_SVG_PAN_OPTIONS).zoomIn();
    }

    zoomOut() {
        const svgElement = document.getElementById('gravemap-svg');
        if (svgElement) svgPanZoom(svgElement, DEFAULT_SVG_PAN_OPTIONS).zoomOut();
    }
}