import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  isMouseDown: boolean = false;

  constructor() { }

  onMouseDown(event: any) {
    if (event.target.id === 'target') {
      this.isMouseDown = true;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: any) {
    if (this.isMouseDown) {
      const mouseX = event.clientX; // Ottieni la posizione X del mouse rispetto al viewport
      const viewportStartX = window.scrollX; // Ottieni la posizione di inizio viewport X

      const mouseWidthFromViewportStart = mouseX - viewportStartX; // Calcola la larghezza del mouse rispetto all'inizio del viewport

      console.log("Larghezza del mouse rispetto all'inizio del viewport: " + mouseWidthFromViewportStart + "px");
    }
  }

  onMouseUp() {
    this.isMouseDown = false;
  }

}
