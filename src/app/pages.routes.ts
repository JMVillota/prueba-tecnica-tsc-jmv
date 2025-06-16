import { Routes } from '@angular/router';

export default [
    { 
        path: 'productos', 
        loadComponent: () => import('./pages/crud/crud').then(m => m.CrudProductos)
    },
    { 
        path: 'crear-producto', 
        loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent)
    },
    { 
        path: 'editar-producto/:id', 
        loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent)
    },
    { path: '', redirectTo: 'productos', pathMatch: 'full' },
] as Routes;