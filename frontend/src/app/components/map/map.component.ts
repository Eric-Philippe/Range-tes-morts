import {
  Component,
  Renderer2,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import svgPanZoom from 'svg-pan-zoom';

import { ImportsModule } from '../../imports';
import { GraveUtils } from '../../utils/GraveUtils';
import { GraveSelectionService } from '../../services/GraveSelection.service';

import { Lot } from '../../models/Lot';
import { Grave } from '../../models/Grave';

const DEFAULT_SVG_PAN_OPTIONS = {
  zoomEnabled: true,
  controlIconsEnabled: true,
  center: true,
  minZoom: 0.9,
  maxZoom: 10,
  zoomScaleSensitivity: 0.5,
  contain: true,
};

const SELECTED_GRAVE_COLOR = '#80EF80';

@Component({
  standalone: true,
  imports: [ImportsModule],
  selector: 'map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnChanges {
  @Input() lots: Lot[] = [];

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private graveSelectedService: GraveSelectionService,
  ) {
    this.graveSelectedService.selectedItem$.subscribe((grave) => {
      this.renderInitialStyle();

      if (grave) {
        this.highlightSelectedGrave(grave);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lots']?.currentValue?.length) {
      this.loadSVG();
    }
  }

  setupPanZoom(reset = false) {
    const svgElement = document.getElementById('gravemap-svg');
    if (svgElement) {
      const panZoomInstance = svgPanZoom(svgElement, DEFAULT_SVG_PAN_OPTIONS);
      if (reset) {
        panZoomInstance.reset();
        this.graveSelectedService.selectItem(null, false, false);
      }

      panZoomInstance.zoom(1.8);
      panZoomInstance.pan({
        x: svgElement.clientWidth / 5,
        y: svgElement.clientHeight / 20,
      });
    }
  }

  private loadSVG() {
    this.http.get('/gravemap.svg', { responseType: 'text' }).subscribe((svgContent) => {
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

  private addInteractions(svgElement: SVGElement) {
    const pathElements = Array.from(svgElement.querySelectorAll('[id*="PATH"]'));

    pathElements.forEach((pathElement) => {
      this.renderer.setStyle(pathElement, 'pointer-events', 'none');
    });

    const graves = Array.from(svgElement.querySelectorAll('[id*="#"]:not([id*="PATH"])'));
    graves.forEach((element) => {
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
    const isTheSelectedGrave = this.graveSelectedService.getSelectedItem()?.id === grave.id;
    let color = isTheSelectedGrave
      ? SELECTED_GRAVE_COLOR
      : GraveUtils.getContrastedColor(grave.state);

    // if (grave.state === 0 && !isTheSelectedGrave) color = '#e0e0e0';

    this.renderer.setStyle(element, 'fill', color);
    this.renderer.setStyle(element, 'fill-opacity', '1');
  }

  private renderInitialStyle() {
    const graves = Array.from(document.querySelectorAll('[id*="#"]:not([id*="PATH"])'));
    graves.forEach((element) => {
      const graveElement = this.getGrave(element.id);
      if (graveElement) {
        this.applyInitialStyle(element, graveElement);
      }
    });
  }

  private applyHoverStyle(element: Element, grave: Grave) {
    const color = GraveUtils.getColor(grave.state);
    const darkerColor = this.darkenColor(color);
    this.renderer.setStyle(element, 'fill', darkerColor);
  }

  private darkenColor(color: string): string {
    const rgb = color.match(/[\da-f]{2}/gi)?.map((c) =>
      Math.max(0, parseInt(c, 16) - 50)
        .toString(16)
        .padStart(2, '0'),
    );
    return `#${rgb?.join('')}`;
  }

  private selectGrave(grave: Grave) {
    // If the selected grave is already selected, deselect it
    if (this.graveSelectedService.getSelectedItem()?.id === grave.id) {
      this.graveSelectedService.selectItem(null, false, false);
      return;
    }

    this.graveSelectedService.selectItem(grave, false, false);
  }

  private highlightSelectedGrave(grave: Grave) {
    // Coloriser la tombe sélectionnée
    const selectedGraveElement = document.getElementById(`${grave.id}`);

    if (selectedGraveElement) {
      this.renderer.setStyle(selectedGraveElement, 'fill', SELECTED_GRAVE_COLOR);
      this.renderer.setStyle(selectedGraveElement, 'fill-opacity', '1');

      // Zoomer sur la tombe sélectionnée
      const svgElement = document.getElementById('gravemap-svg');
      if (svgElement && this.graveSelectedService.isZoomIn()) {
        this.graveSelectedService.toggleZoom();
        const panZoomInstance = svgPanZoom(svgElement);
        panZoomInstance.zoom(3);

        panZoomInstance.pan({ x: 0, y: 0 });
        var realZoom = panZoomInstance.getSizes().realZoom;

        let x = parseFloat(selectedGraveElement.getAttribute('x') as string);
        let y = parseFloat(selectedGraveElement.getAttribute('y') as string);

        panZoomInstance.pan({
          x: -(x * realZoom) + panZoomInstance.getSizes().width / 2,
          y: -(y * realZoom) + panZoomInstance.getSizes().height / 2,
        });
      }
    }
  }

  private getGrave(identifier: string): Grave | undefined {
    if (!identifier.includes('#')) return undefined;

    const [lotName, graveIdentifier] = identifier.split('#');
    const lot = this.lots.find((lot) => lot.name === lotName);
    return lot?.graves?.find((grave) => grave.identifier === graveIdentifier);
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
