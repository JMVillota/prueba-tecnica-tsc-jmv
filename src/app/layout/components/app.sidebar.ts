import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppMenu } from './app.menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenu],
  template: `
    <div class="layout-sidebar">
      <div class="sidebar-header" (click)="goHome()">
        <img src="logo.png" alt="Logo" class="sidebar-logo">
      </div>
      <app-menu></app-menu>
    </div>
  `
})
export class AppSidebar {
  constructor(
    public el: ElementRef,
    private router: Router
  ) {}

  goHome() {
    this.router.navigate(['/pages/productos']);
  }
}