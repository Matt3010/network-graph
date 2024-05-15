import { Component, HostListener } from '@angular/core';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isMouseDown: boolean = false;
  sidebarWidth: number;
  min: number=  50;
  max: number= 400;
  defaultWidth: number = 250;
  currentUser$ = this.authService.currentUser$

  constructor(
    private authService: AuthService
  ) {
    const storedWidth = localStorage.getItem('NTW_sidebar_width');
    if (storedWidth) {
      this.sidebarWidth = Math.min(this.max, Math.max(this.min, +storedWidth));
    } else {
      localStorage.setItem('NTW_sidebar_width', JSON.stringify(250));
      this.sidebarWidth = this.defaultWidth;
    }
  }

  onMouseDown(event: MouseEvent) {
    if ((event.target as HTMLElement).id === 'target') {
      this.isMouseDown = true;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isMouseDown) {
      const mouseX = event.clientX;
      const viewportStartX = window.scrollX;

      const mouseWidthFromViewportStart = mouseX - viewportStartX;
      const newWidth = Math.min(this.max, Math.max(this.min, mouseWidthFromViewportStart));

      localStorage.setItem('NTW_sidebar_width', JSON.stringify(newWidth));
      this.sidebarWidth = newWidth;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isMouseDown = false;
  }

}
