import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { debounce } from 'lodash'; // Importa debounce da lodash

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  routerOutletWidth!: number;
  debouncedResizeHandler: () => void;

  constructor() {
    // Inizializza il gestore di ridimensionamento debounce con un timeout di 300 ms
    this.debouncedResizeHandler = debounce(this.getRouterWidth.bind(this), 300);
  }

  ngOnInit() {
    // Chiama la funzione per ottenere la larghezza del router-outlet una volta che la vista è stata completamente inizializzata
    this.getRouterWidth();
  }

  @HostListener('window:resize')
  onResize() {
    // Chiama il gestore di ridimensionamento debounce
    this.debouncedResizeHandler();
  }

  getRouterWidth() {
    const routerOutlet = document.getElementById('router-outlet')!;
    this.routerOutletWidth = routerOutlet.getBoundingClientRect().width;
  }
}
