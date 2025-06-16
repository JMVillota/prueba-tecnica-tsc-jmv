import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="layout-topbar">
      <div class="topbar-left">
        <button class="sidebar-toggle" (click)="toggleSidebar()">
          <i class="custom-icon icon-menu"></i>
        </button>
        <span class="topbar-title">Sistema de Productos Financieros</span>
      </div>
      
      <div class="topbar-right">
        <div class="user-info" 
             (mouseenter)="onUserHover(true)"
             (mouseleave)="onUserHover(false)">
          <span class="user-name">Usuario</span>
          <div class="user-avatar animated-avatar" 
               [class.hover-state]="isUserHovered">
            <i class="custom-icon icon-user"></i>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppTopbar {
  isUserHovered = false;

  toggleSidebar() {
    const sidebar = document.querySelector('.layout-sidebar');
    const content = document.querySelector('.layout-content');
    
    if (sidebar && content) {
      sidebar.classList.toggle('collapsed');
      content.classList.toggle('expanded');
    }
  }

  onUserHover(isHovered: boolean) {
    this.isUserHovered = isHovered;
  }
}