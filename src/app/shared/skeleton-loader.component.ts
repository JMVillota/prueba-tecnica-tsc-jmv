import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector: 'app-skeleton-loader',
 standalone: true,
 imports: [CommonModule],
 changeDetection: ChangeDetectionStrategy.OnPush,
 template: `
   <div class="skeleton-container">
     <ng-container *ngIf="type === 'table'">
       <div class="skeleton-table">
         <div class="skeleton-table-header">
           <div class="skeleton skeleton-text"></div>
           <div class="skeleton skeleton-text"></div>
           <div class="skeleton skeleton-text"></div>
           <div class="skeleton skeleton-text"></div>
           <div class="skeleton skeleton-text"></div>
           <div class="skeleton skeleton-text"></div>
         </div>
         <div class="skeleton-table-body">
           <div class="skeleton-table-row" 
                *ngFor="let row of getArray(rows); trackBy: trackByIndex">
             <div class="skeleton skeleton-avatar"></div>
             <div class="skeleton skeleton-text"></div>
             <div class="skeleton skeleton-text large"></div>
             <div class="skeleton skeleton-text"></div>
             <div class="skeleton skeleton-text"></div>
             <div class="skeleton skeleton-text small"></div>
           </div>
         </div>
       </div>
     </ng-container>

     <ng-container *ngIf="type === 'form'">
       <div class="form-skeleton">
         <div class="skeleton skeleton-text large" style="margin-bottom: 2rem; width: 40%; margin-left: auto; margin-right: auto;"></div>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
           <div>
             <div class="skeleton skeleton-text small" style="width: 30%; margin-bottom: 0.5rem;"></div>
             <div class="skeleton skeleton-text" style="height: 40px;"></div>
           </div>
           <div>
             <div class="skeleton skeleton-text small" style="width: 40%; margin-bottom: 0.5rem;"></div>
             <div class="skeleton skeleton-text" style="height: 40px;"></div>
           </div>
         </div>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
           <div>
             <div class="skeleton skeleton-text small" style="width: 50%; margin-bottom: 0.5rem;"></div>
             <div class="skeleton skeleton-text" style="height: 80px;"></div>
           </div>
           <div>
             <div class="skeleton skeleton-text small" style="width: 30%; margin-bottom: 0.5rem;"></div>
             <div class="skeleton skeleton-text" style="height: 40px;"></div>
           </div>
         </div>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
           <div>
             <div class="skeleton skeleton-text small" style="width: 60%; margin-bottom: 0.5rem;"></div>
             <div class="skeleton skeleton-text" style="height: 40px;"></div>
           </div>
           <div>
             <div class="skeleton skeleton-text small" style="width: 55%; margin-bottom: 0.5rem;"></div>
             <div class="skeleton skeleton-text" style="height: 40px;"></div>
           </div>
         </div>
         <div class="skeleton-actions">
           <div class="skeleton skeleton-button"></div>
           <div class="skeleton skeleton-button"></div>
         </div>
       </div>
     </ng-container>

     <ng-container *ngIf="type === 'text'">
       <div class="skeleton skeleton-text" 
            *ngFor="let line of getArray(count); trackBy: trackByIndex"></div>
     </ng-container>

     <ng-container *ngIf="type === 'button'">
       <div class="skeleton skeleton-button" 
            *ngFor="let btn of getArray(count); trackBy: trackByIndex"></div>
     </ng-container>
   </div>
 `
})
export class SkeletonLoaderComponent {
 @Input() type: 'table' | 'form' | 'text' | 'button' = 'text';
 @Input() count: number = 3;
 @Input() columns: number = 6;
 @Input() rows: number = 5;

 getArray(length: number): number[] {
   return Array(length).fill(0).map((_, i) => i);
 }

 trackByIndex(index: number): number {
   return index;
 }
}