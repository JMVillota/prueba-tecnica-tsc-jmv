// src/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/components/app.layout';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'pages', loadChildren: () => import('./app/pages.routes') },
            { path: '', redirectTo: 'pages/productos', pathMatch: 'full' }
        ]
    },
];