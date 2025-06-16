import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, AppSidebar, AppTopbar],
  template: `
    <div class="layout-wrapper">
      <app-sidebar></app-sidebar>
      
      <div class="layout-main">
        <app-topbar></app-topbar>
        
        <div class="layout-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class AppLayout {}