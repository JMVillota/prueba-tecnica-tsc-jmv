import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="layout-menu">
      <div class="menu-item" 
           routerLink="/pages/productos" 
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: false}">
        <div class="menu-content">
          <span class="menu-label">Productos</span>
        </div>
        <div class="menu-glow"></div>
      </div>
    </nav>
  `
})
export class AppMenu implements OnInit {
  ngOnInit() {}
}