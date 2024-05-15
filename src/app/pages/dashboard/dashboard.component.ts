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
    this.debouncedResizeHandler = debounce(this.getRouterWidth.bind(this), 300);
  }

  ngOnInit() {
    this.getRouterWidth();
  }

  @HostListener('window:resize')
  onResize() {
    this.debouncedResizeHandler();
  }

  getRouterWidth() {
    const routerOutlet = document.getElementById('router-outlet')!;
    this.routerOutletWidth = routerOutlet.getBoundingClientRect().width;
  }
}
