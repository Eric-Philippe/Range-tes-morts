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
}

@Component({
    standalone: true,
    imports: [ImportsModule],
    selector: "map-component",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.css"],
})
export class MapComponent implements AfterViewInit, OnChanges {
    constructor(
        private http: HttpClient,
        private renderer: Renderer2,
        private graveSelectedService: GraveSelectionService
    ) {
        this.graveSelectedService.selectedItem$.subscribe(grave => {
            if (grave) {
                alert(GraveUtils.toString(grave as Grave));
            }
        })
     }

    @Input() lots: Lot[] = [];

    ngAfterViewInit() {
        this.defaultPanSetup();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["lots"] && changes["lots"].currentValue && changes["lots"].currentValue.length > 0) {
            this.loadSVG();
        }
    }

    getGrave(identifier: string): Grave | undefined {        
        if (!identifier.includes('#')) return;

        const [lotName, graveIdentifier] = identifier.split('#');

        let lot = this.lots.find(lot => lot.name == lotName);
        if (!lot || !lot.graves) return;

        return lot.graves.find(grave => grave.identifier == graveIdentifier);
    }

    getSvgsGraves(svgElement: SVGElement) {
        return Array.from(svgElement.querySelectorAll('[id*="#"]'))
        .filter(element => !element.id.includes('PATH'));
    }

    getSvgsLots(svgElement: SVGElement) {
        return Array.from(svgElement.querySelectorAll('[id*="PATH"]'));
    }

    loadSVG() {
        this.http.get('/gravemap.svg', { responseType: 'text' }).subscribe(svgContent => {
            const parser = new DOMParser();
            const svgElement = parser.parseFromString(svgContent, 'image/svg+xml').documentElement;
            const svgContainer = document.getElementById('svg-container');
            if (svgContainer) {
                svgElement.setAttribute('id', "gravemap-svg");
                svgElement.setAttribute('width', '100%');
                svgElement.setAttribute('height', '100%');
                svgContainer.appendChild(svgElement);
                this.addHoverEffect(svgElement as unknown as SVGElement);
                this.defaultPanSetup();
            }
        });
    }

    addHoverEffect(svgElement: SVGElement) {
        const elements = this.getSvgsGraves(svgElement);
        const pathElements = this.getSvgsLots(svgElement);

        elements.forEach(element => {
            this.renderer.listen(element, 'mouseover', () => {
                this.applyHoverEffect(element);
            });
            this.renderer.listen(element, 'mouseout', () => {
                this.removeHoverEffect(element);
            });
            this.renderer.listen(element, 'click', () => {
                this.applyOnClickEffect(element);
            });

            let grave = this.getGrave(element.id);
            if (grave) {
                this.renderer.setStyle(element, 'fill', GraveUtils.getColor(grave));
                this.renderer.setStyle(element, 'fill-opacity', '1');
            }
        });

        pathElements.forEach(pathElement => {
            this.renderer.setStyle(pathElement, 'pointer-events', 'none');
        });
    }

    applyHoverEffect(element: Element) {
        let elementId = element.id;
        let grave = this.getGrave(elementId);
        if (!grave) return;

        let color = GraveUtils.getColor(grave);
        // Make it darker
        let darkerColor = color.replace('#', '');
        let r = parseInt(darkerColor.substring(0, 2), 16);
        let g = parseInt(darkerColor.substring(2, 4), 16);
        let b = parseInt(darkerColor.substring(4, 6), 16);
        r = Math.max(0, r - 50);
        g = Math.max(0, g - 50);
        b = Math.max(0, b - 50);

        darkerColor = '#' + r.toString(16) + g.toString(16) + b.toString(16);

        this.renderer.setStyle(element, 'fill', darkerColor);
        this.renderer.setStyle(element, 'fill-opacity', '1');
    }

    applyOnClickEffect(element: Element) {
        let elementId = element.id;
        let grave = this.getGrave(elementId);
        if (grave) this.graveSelectedService.selectItem(grave);
    }

    removeHoverEffect(element: Element) {
        let elementId = element.id;
        let grave = this.getGrave(elementId);
        if (!grave) return;

        this.renderer.setStyle(element, 'fill', GraveUtils.getColor(grave));
    }

    defaultPanSetup(reset: boolean = false) {
        const svgElement = document.getElementById('gravemap-svg');
        if (svgElement) {
            const panZoomInstance = svgPanZoom(svgElement, DEFAULT_SVG_PAN_OPTIONS);
            if (reset) panZoomInstance.reset();
            panZoomInstance.zoom(1.8)
            panZoomInstance.pan({ x: svgElement.clientWidth / 5 , y: svgElement.clientHeight /  20});
        }
    }

    zoomIn() {
        const svgElement = document.getElementById('gravemap-svg');
        if (svgElement) {
            const panZoomInstance = svgPanZoom(svgElement, DEFAULT_SVG_PAN_OPTIONS);
            panZoomInstance.zoomIn();
        }
    }

    zoomOut() {
        const svgElement = document.getElementById('gravemap-svg');
        if (svgElement) {
            const panZoomInstance = svgPanZoom(svgElement, DEFAULT_SVG_PAN_OPTIONS);
            panZoomInstance.zoomOut();
        }
    }
}