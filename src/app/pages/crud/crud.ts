import { Component, OnInit, ChangeDetectionStrategy, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
 selector: 'app-crud-productos',
 standalone: true,
 imports: [CommonModule, FormsModule],
 changeDetection: ChangeDetectionStrategy.OnPush,
 template: `
   <div class="p-component productos-page">
     <div class="p-card">
       <!-- Header con toolbar estilo PrimeNG -->
       <div class="p-toolbar">
         <div class="p-toolbar-group-start">
           <div class="p-input-icon-left search-container">
             <i class="custom-icon icon-search"></i>
             <input 
               type="text" 
               placeholder="Buscar productos..." 
               class="p-inputtext p-component search-input"
               [ngModel]="searchTerm()"
               (ngModelChange)="onSearch($event)">
           </div>
         </div>
         <div class="p-toolbar-group-end">
           <button 
             type="button" 
             class="p-button p-button-warning p-button-raised"
             (click)="goToCreate()">
             <span>Agregar</span>
           </button>
         </div>
       </div>

       <!-- Skeleton Loading -->
       <div *ngIf="loading()" class="p-datatable p-component">
         <div class="p-datatable-wrapper">
           <table class="p-datatable-table">
             <thead class="p-datatable-thead">
               <tr>
                 <th class="p-datatable-th">
                   <span class="p-column-title">Logo</span>
                 </th>
                 <th class="p-datatable-th p-sortable-column">
                   <span class="p-column-title">Nombre del producto</span>
                 </th>
                 <th class="p-datatable-th p-sortable-column">
                   <span class="p-column-title">Descripción</span>
                   <i class="custom-icon icon-info p-info-icon" title="Información sobre la descripción"></i>
                 </th>
                 <th class="p-datatable-th p-sortable-column">
                   <span class="p-column-title">Fecha de liberación</span>
                   <i class="custom-icon icon-info p-info-icon" title="Fecha de liberación del producto"></i>
                 </th>
                 <th class="p-datatable-th p-sortable-column">
                   <span class="p-column-title">Fecha de reestructuración</span>
                   <i class="custom-icon icon-info p-info-icon" title="Fecha de reestructuración"></i>
                 </th>
                 <th class="p-datatable-th actions-header">
                   <span class="p-column-title">Acciones</span>
                 </th>
               </tr>
             </thead>
             <tbody class="p-datatable-tbody">
               <tr *ngFor="let skeleton of getSkeletonRows(); trackBy: trackByIndex" 
                   class="p-datatable-row p-datatable-row-skeleton">
                 <td class="p-datatable-td">
                   <div class="p-skeleton p-skeleton-circle" style="width: 2.5rem; height: 2.5rem;"></div>
                 </td>
                 <td class="p-datatable-td">
                   <div class="p-skeleton p-skeleton-text" style="width: 80%;"></div>
                 </td>
                 <td class="p-datatable-td">
                   <div class="p-skeleton p-skeleton-text" style="width: 90%;"></div>
                 </td>
                 <td class="p-datatable-td">
                   <div class="p-skeleton p-skeleton-text" style="width: 70%;"></div>
                 </td>
                 <td class="p-datatable-td">
                   <div class="p-skeleton p-skeleton-text" style="width: 70%;"></div>
                 </td>
                 <td class="p-datatable-td">
                   <div class="p-skeleton p-skeleton-circle" style="width: 2rem; height: 2rem;"></div>
                 </td>
               </tr>
             </tbody>
           </table>
         </div>
         
         <!-- Footer skeleton -->
         <div class="p-paginator p-component">
           <div class="p-paginator-left-content">
             <div class="p-skeleton p-skeleton-text" style="width: 100px;"></div>
           </div>
           <div class="p-paginator-right-content">
             <div class="p-skeleton p-skeleton-text" style="width: 60px;"></div>
           </div>
         </div>
       </div>
       
       <!-- Error State -->
       <div *ngIf="!loading() && error()" class="p-message p-message-error">
         <div class="p-message-wrapper">
           <span class="custom-icon icon-error p-message-icon size-lg"></span>
           <div class="p-message-detail">
             <h3>Error al cargar productos</h3>
             <p>{{ error() }}</p>
             <button class="p-button p-button-text" (click)="loadProducts()">
               <i class="custom-icon icon-refresh"></i>
               Reintentar
             </button>
           </div>
         </div>
       </div>
       
       <!-- Contenido principal -->
       <div *ngIf="!loading() && !error()">
         <!-- Empty State -->
         <div *ngIf="filteredProducts().length === 0" class="p-empty-state">
           <div class="empty-content">
             <i class="custom-icon icon-inbox empty-icon size-xl"></i>
             <h3>No se encontraron productos</h3>
             <p>{{ searchTerm() ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer producto' }}</p>
             <button 
               type="button" 
               class="p-button p-button-warning p-button-raised"
               (click)="goToCreate()">
               <span>Agregar Producto</span>
             </button>
           </div>
         </div>

         <!-- DataTable estilo PrimeNG -->
         <div *ngIf="filteredProducts().length > 0" class="p-datatable p-component">
           <div class="p-datatable-wrapper">
             <table class="p-datatable-table">
               <thead class="p-datatable-thead">
                 <tr>
                   <th class="p-datatable-th">
                     <span class="p-column-title">Logo</span>
                   </th>
                   <th class="p-datatable-th p-sortable-column">
                     <span class="p-column-title">Nombre del producto</span>
                   </th>
                   <th class="p-datatable-th p-sortable-column">
                     <span class="p-column-title">Descripción</span>
                     <i class="custom-icon icon-info p-info-icon" title="Información sobre la descripción"></i>
                   </th>
                   <th class="p-datatable-th p-sortable-column">
                     <span class="p-column-title">Fecha de liberación</span>
                     <i class="custom-icon icon-info p-info-icon" title="Fecha de liberación del producto"></i>
                   </th>
                   <th class="p-datatable-th p-sortable-column">
                     <span class="p-column-title">Fecha de reestructuración</span>
                     <i class="custom-icon icon-info p-info-icon" title="Fecha de reestructuración"></i>
                   </th>
                   <th class="p-datatable-th actions-header">
                     <span class="p-column-title">Acciones</span>
                   </th>
                 </tr>
               </thead>
               <tbody class="p-datatable-tbody">
                 <tr *ngFor="let product of paginatedProducts(); trackBy: trackByProduct" 
                     class="p-datatable-row"
                     [class.p-highlight]="activeDropdown() === product.id">
                   <td class="p-datatable-td logo-cell">
                     <div class="p-avatar p-avatar-circle product-avatar">
                       <img [src]="product.logo" 
                           [alt]="product.name" 
                           class="product-logo" 
                           (error)="onImageError($event)"
                           (load)="onImageLoad($event)">
                       <span class="fallback-icon custom-icon icon-inbox" style="display: none;"></span>
                     </div>
                   </td>
                   <td class="p-datatable-td">
                     <span class="product-name">{{ product.name }}</span>
                   </td>
                   <td class="p-datatable-td">
                     <span class="product-description">{{ product.description }}</span>
                   </td>
                   <td class="p-datatable-td">
                     <span class="product-date">{{ product.date_release | date:'dd/MM/yyyy' }}</span>
                   </td>
                   <td class="p-datatable-td">
                     <span class="product-date">{{ product.date_revision | date:'dd/MM/yyyy' }}</span>
                   </td>
                   <td class="p-datatable-td actions-cell">
                     <!-- Menu Button estilo PrimeNG -->
                     <button 
                       type="button" 
                       class="p-button p-button-text p-button-rounded p-button-secondary menu-button"
                       [class.p-button-outlined]="activeDropdown() === product.id"
                       (click)="toggleDropdown($event, product.id)"
                       [attr.aria-expanded]="activeDropdown() === product.id"
                       [attr.data-product-id]="product.id">
                       <i class="custom-icon icon-menu"></i>
                     </button>
                     
                     <!-- Overlay Menu estilo PrimeNG -->
                     <div class="p-overlaypanel p-component p-menu" 
                          [class.p-overlaypanel-visible]="activeDropdown() === product.id"
                          [attr.id]="'menu-' + product.id"
                          role="menu">
                       <div class="p-overlaypanel-content">
                         <ul class="p-menu-list" role="menubar">
                           <li class="p-menuitem" role="none">
                             <a class="p-menuitem-link" 
                                role="menuitem"
                                (click)="editProduct($event, product.id)">
                               <span class="p-menuitem-icon custom-icon icon-edit"></span>
                               <span class="p-menuitem-text">Editar</span>
                             </a>
                           </li>
                           <li class="p-menuitem" role="none">
                             <a class="p-menuitem-link p-menuitem-danger" 
                                role="menuitem"
                                (click)="confirmDelete($event, product)">
                               <span class="p-menuitem-icon custom-icon icon-trash text-danger"></span>
                               <span class="p-menuitem-text">Eliminar</span>
                             </a>
                           </li>
                         </ul>
                       </div>
                     </div>
                   </td>
                 </tr>
                 
                 <!-- Filas vacías cuando NO está cargando -->
                 <tr *ngFor="let empty of getEmptyRows(); trackBy: trackByIndex" 
                     class="p-datatable-row p-datatable-row-empty">
                   <td class="p-datatable-td"><div class="empty-space"></div></td>
                   <td class="p-datatable-td"><div class="empty-space"></div></td>
                   <td class="p-datatable-td"><div class="empty-space"></div></td>
                   <td class="p-datatable-td"><div class="empty-space"></div></td>
                   <td class="p-datatable-td"><div class="empty-space"></div></td>
                   <td class="p-datatable-td"><div class="empty-space"></div></td>
                 </tr>
               </tbody>
             </table>
           </div>
           
           <!-- Paginator estilo PrimeNG -->
           <div class="p-paginator p-component">
             <div class="p-paginator-left-content">
               <span class="p-paginator-current">{{ filteredProducts().length }} resultados</span>
             </div>
             <div class="p-paginator-right-content">
               <div class="p-dropdown p-component p-inputwrapper">
                 <select class="p-dropdown-trigger" 
                         [ngModel]="pageSize()" 
                         (ngModelChange)="onPageSizeChange($event)">
                   <option value="5">5</option>
                   <option value="10">10</option>
                   <option value="20">20</option>
                 </select>
                 <i class="custom-icon icon-chevron-down p-dropdown-trigger-icon"></i>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>

     <!-- Toast notifications -->
     <div class="toast-container" *ngIf="toastMessage()">
       <div class="toast" [ngClass]="'toast-' + toastType()">
         <i class="custom-icon" [ngClass]="toastType() === 'success' ? 'icon-check' : 'icon-error'"></i>
         <span>{{ toastMessage() }}</span>
       </div>
     </div>

     <!-- Dialog estilo PrimeNG -->
     <div class="p-dialog-mask p-component-overlay" 
          *ngIf="showDeleteModal()"
          (click)="closeDeleteModal()">
       <div class="p-dialog p-component p-dialog-draggable p-dialog-resizable" 
            (click)="$event.stopPropagation()">
         <div class="p-dialog-header">
           <span class="p-dialog-title">Confirmar Eliminación</span>
         </div>
         <div class="p-dialog-content">
           <div class="p-confirm-dialog-message">
             <i class="custom-icon icon-warning p-confirm-dialog-icon size-xl text-warning"></i>
             <span>¿Estás seguro de eliminar el producto <strong>{{ productToDelete()?.name }}</strong>?</span>
           </div>
         </div>
         <div class="p-dialog-footer">
          <button type="button" 
                  class="p-button p-button-text p-button-secondary"
                  (click)="closeDeleteModal()">
            <span>Cancelar</span>
          </button>
          <button type="button" 
                  class="p-button p-button-warning p-button-confirm"
                  (click)="deleteProduct()" 
                  [disabled]="deleting()">
            <i class="custom-icon icon-trash"></i>
            <span>{{ deleting() ? 'Eliminando...' : 'Confirmar' }}</span>
          </button>
        </div>
       </div>
     </div>

     <!-- Overlay para cerrar menu -->
     <div class="p-component-overlay p-menu-overlay" 
          *ngIf="activeDropdown()" 
          (click)="closeDropdown()">
     </div>
   </div>
 `
})
export class CrudProductos implements OnInit {
 products = signal<Product[]>([]);
 filteredProducts = signal<Product[]>([]);
 loading = signal(false);
 error = signal('');
 searchTerm = signal('');
 pageSize = signal(5);
 currentPage = signal(1);
 activeDropdown = signal<string | null>(null);
 showDeleteModal = signal(false);
 productToDelete = signal<Product | null>(null);
 deleting = signal(false);
 toastMessage = signal('');
 toastType = signal<'success' | 'error'>('success');

 // Computed values
 paginatedProducts = computed(() => {
   const startIndex = (this.currentPage() - 1) * this.pageSize();
   const endIndex = startIndex + this.pageSize();
   return this.filteredProducts().slice(startIndex, endIndex);
 });

 constructor(
   private productService: ProductService,
   private router: Router
 ) { }

 ngOnInit() {
   this.loadProducts();
 }

 @HostListener('document:click', ['$event'])
 onDocumentClick(event: Event) {
   const target = event.target as HTMLElement;
   if (!target.closest('.p-overlaypanel') && 
       !target.closest('.menu-button') && 
       !target.closest('.p-menu-overlay')) {
     this.closeDropdown();
   }
 }

 loadProducts() {
   this.loading.set(true);
   this.error.set('');

   this.productService.getProducts().subscribe({
     next: (products) => {
       this.products.set(products);
       this.filteredProducts.set([...products]);
       this.loading.set(false);
     },
     error: (err) => {
       this.error.set(err.message);
       this.loading.set(false);
       this.showToast('Error al cargar productos', 'error');
     }
   });
 }

 onSearch(term: string) {
   this.searchTerm.set(term);
   if (!term.trim()) {
     this.filteredProducts.set([...this.products()]);
   } else {
     const lowerTerm = term.toLowerCase();
     this.filteredProducts.set(
       this.products().filter(product =>
         product.name.toLowerCase().includes(lowerTerm) ||
         product.description.toLowerCase().includes(lowerTerm) ||
         product.id.toLowerCase().includes(lowerTerm)
       )
     );
   }
   this.currentPage.set(1);
 }

 onPageSizeChange(size: string) {
   this.pageSize.set(parseInt(size));
   this.currentPage.set(1);
 }

 toggleDropdown(event: Event, productId: string) {
   event.preventDefault();
   event.stopPropagation();
   
   if (this.activeDropdown() === productId) {
     this.closeDropdown();
   } else {
     this.activeDropdown.set(productId);
     setTimeout(() => {
       this.positionMenu(productId);
     }, 10);
   }
 }

 private positionMenu(productId: string) {
   const button = document.querySelector(`[data-product-id="${productId}"]`) as HTMLElement;
   const menu = document.getElementById(`menu-${productId}`) as HTMLElement;
   
   if (button && menu) {
     const rect = button.getBoundingClientRect();
     const viewportHeight = window.innerHeight;
     const menuHeight = 120;
     
     menu.style.position = 'fixed';
     menu.style.zIndex = '1001';
     
     // Posición horizontal
     if (rect.left > window.innerWidth / 2) {
       menu.style.right = `${window.innerWidth - rect.right}px`;
       menu.style.left = 'auto';
     } else {
       menu.style.left = `${rect.left}px`;
       menu.style.right = 'auto';
     }
     
     // Posición vertical
     if (rect.bottom + menuHeight > viewportHeight) {
       menu.style.bottom = `${viewportHeight - rect.top}px`;
       menu.style.top = 'auto';
     } else {
       menu.style.top = `${rect.bottom + 5}px`;
       menu.style.bottom = 'auto';
     }
   }
 }

 closeDropdown() {
   this.activeDropdown.set(null);
 }

 goToCreate() {
   this.router.navigate(['/pages/crear-producto']);
 }

 editProduct(event: Event, productId: string) {
   event.preventDefault();
   event.stopPropagation();
   this.closeDropdown();
   this.router.navigate(['/pages/editar-producto', productId]);
 }

 confirmDelete(event: Event, product: Product) {
   event.preventDefault();
   event.stopPropagation();
   this.productToDelete.set(product);
   this.showDeleteModal.set(true);
   this.closeDropdown();
 }

 closeDeleteModal() {
   this.showDeleteModal.set(false);
   this.productToDelete.set(null);
   this.deleting.set(false);
 }

 deleteProduct() {
   const product = this.productToDelete();
   if (!product) return;

   this.deleting.set(true);
   this.productService.deleteProduct(product.id).subscribe({
     next: () => {
       const updatedProducts = this.products().filter(p => p.id !== product.id);
       this.products.set(updatedProducts);
       this.onSearch(this.searchTerm());
       this.closeDeleteModal();
       this.showToast('Producto eliminado exitosamente', 'success');
     },
     error: (err) => {
       console.error('Error deleting product:', err);
       this.deleting.set(false);
       this.showToast('Error al eliminar producto', 'error');
     }
   });
 }

 private showToast(message: string, type: 'success' | 'error') {
   this.toastMessage.set(message);
   this.toastType.set(type);
   setTimeout(() => {
     this.toastMessage.set('');
   }, 3000);
 }

 getSkeletonRows(): number[] {
   return Array(this.pageSize()).fill(0);
 }

 getEmptyRows(): number[] {
   if (this.loading()) {
     return [];
   }
   const currentRows = this.paginatedProducts().length;
   const emptyRowsCount = Math.max(0, this.pageSize() - currentRows);
   return Array(emptyRowsCount).fill(0);
 }

 onImageError(event: any) {
   event.target.style.display = 'none';
   const fallback = event.target.parentElement.querySelector('.fallback-icon');
   if (fallback) fallback.style.display = 'flex';
 }

 onImageLoad(event: any) {
   event.target.style.display = 'block';
   const fallback = event.target.parentElement.querySelector('.fallback-icon');
   if (fallback) fallback.style.display = 'none';
 }

 trackByProduct(index: number, product: Product): string {
   return product.id;
 }

 trackByIndex(index: number): number {
   return index;
 }
}