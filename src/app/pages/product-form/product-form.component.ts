import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product, ValidationErrors } from '../models/product.model';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SkeletonLoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
   <div class="product-form-page">
     <!-- Header con logo BANCO -->
     <div class="form-header">
       <button class="btn-back" (click)="goBack()">Volver</button>
     </div>

     <div class="form-container">
       <!-- Skeleton Loading para formulario -->
       <div *ngIf="loadingForm()" class="form-skeleton-container">
         <app-skeleton-loader type="form"></app-skeleton-loader>
       </div>

       <!-- Formulario exacto al diseño D2 -->
       <form *ngIf="!loadingForm()" [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
         
         <!-- Título centrado -->
         <h2 class="form-title">Formulario de Registro</h2>
         
         <!-- Primera fila: ID y Nombre -->
         <div class="form-row">
           <div class="form-group">
             <label class="form-label">ID</label>
             <input 
               type="text" 
               class="form-control"
               [class.error]="isFieldInvalid('id')"
               formControlName="id"
               [readonly]="isEditMode()"
               placeholder="">
             <div class="field-errors" *ngIf="isFieldInvalid('id')">
               <span *ngFor="let error of getFieldErrors('id')" class="error-message">
                 {{ error }}
               </span>
             </div>
           </div>

           <div class="form-group">
             <label class="form-label">Nombre</label>
             <input 
               type="text" 
               class="form-control"
               [class.error]="isFieldInvalid('name')"
               formControlName="name"
               placeholder="Tarjeta Crédito">
             <div class="field-errors" *ngIf="isFieldInvalid('name')">
               <span *ngFor="let error of getFieldErrors('name')" class="error-message">
                 {{ error }}
               </span>
             </div>
           </div>
         </div>

         <!-- Segunda fila: Descripción y Logo -->
         <div class="form-row">
           <div class="form-group">
             <label class="form-label">Descripción</label>
             <input 
                type="text"
                class="form-control"
                [class.error]="isFieldInvalid('description')"
                formControlName="description"
                placeholder="">
             <div class="field-errors" *ngIf="isFieldInvalid('description')">
               <span *ngFor="let error of getFieldErrors('description')" class="error-message">
                 {{ error }}
               </span>
             </div>
           </div>

           <div class="form-group">
             <label class="form-label">Logo</label>
             <input 
               type="url" 
               class="form-control"
               [class.error]="isFieldInvalid('logo')"
               formControlName="logo"
               placeholder="">
             <div class="field-errors" *ngIf="isFieldInvalid('logo')">
               <span *ngFor="let error of getFieldErrors('logo')" class="error-message">
                 {{ error }}
               </span>
             </div>
           </div>
         </div>

         <!-- Tercera fila: Fechas -->
         <div class="form-row">
           <div class="form-group">
             <label class="form-label">Fecha Liberación</label>
             <input 
               type="date" 
               class="form-control"
               [class.error]="isFieldInvalid('date_release')"
               formControlName="date_release"
               (change)="onReleaseDateChange()">
             <div class="field-errors" *ngIf="isFieldInvalid('date_release')">
               <span *ngFor="let error of getFieldErrors('date_release')" class="error-message">
                 {{ error }}
               </span>
             </div>
           </div>

           <div class="form-group">
             <label class="form-label">Fecha Revisión</label>
             <input 
               type="date" 
               class="form-control"
               [class.error]="isFieldInvalid('date_revision')"
               formControlName="date_revision"
               readonly>
             <div class="field-errors" *ngIf="isFieldInvalid('date_revision')">
               <span *ngFor="let error of getFieldErrors('date_revision')" class="error-message">
                 {{ error }}
               </span>
             </div>
           </div>
         </div>

         <!-- Botones exactos al diseño -->
         <div class="form-actions">
           <button 
             type="button" 
             class="btn btn-secondary"
             (click)="resetForm()">
             Reiniciar
           </button>
           <button 
             type="submit" 
             class="btn btn-primary"
             [disabled]="productForm.invalid || loading()">
             {{ loading() ? 'Guardando...' : 'Enviar' }}
           </button>
         </div>
       </form>
     </div>
   </div>
 `
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  loadingForm = signal(false);
  productId?: string;
  validationErrors: ValidationErrors = {};

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId = id;
      this.loadProduct(id);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      date_release: ['', [Validators.required, this.dateValidator.bind(this)]],
      date_revision: ['', [Validators.required]]
    });
  }

  dateValidator(control: AbstractControl) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { invalidDate: true };
  }

  async loadProduct(id: string) {
    this.loadingForm.set(true);
    try {
      const products = await this.productService.getProducts().toPromise();
      const product = products?.find(p => p.id === id);

      if (product) {
        this.productForm.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: this.formatDateForInput(product.date_release),
          date_revision: this.formatDateForInput(product.date_revision)
        });

        if (this.isEditMode()) {
          this.productForm.get('id')?.disable();
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      this.loadingForm.set(false);
    }
  }

  onReleaseDateChange() {
    const releaseDate = this.productForm.get('date_release')?.value;
    if (releaseDate) {
      const revisionDate = new Date(releaseDate);
      revisionDate.setFullYear(revisionDate.getFullYear() + 1);

      this.productForm.patchValue({
        date_revision: this.formatDateForInput(revisionDate.toISOString())
      });
    }
  }

  async onSubmit() {
    if (this.productForm.valid) {
      this.loading.set(true);
      this.validationErrors = {};

      try {
        const formValue = this.productForm.getRawValue();

        // Verificar ID solo en modo crear
        if (!this.isEditMode()) {
          const idExists = await this.productService.verifyId(formValue.id).toPromise();
          if (idExists) {
            this.validationErrors['id'] = ['ID ya existe'];
            this.loading.set(false);
            return;
          }
        }

        if (this.isEditMode() && this.productId) {
          await this.productService.updateProduct(this.productId, formValue).toPromise();
        } else {
          await this.productService.createProduct(formValue).toPromise();
        }

        this.router.navigate(['/pages/productos']);
      } catch (error: any) {
        console.error('Error saving product:', error);
        this.handleFormErrors(error);
      } finally {
        this.loading.set(false);
      }
    }
  }

  resetForm() {
    this.productForm.reset();
    this.validationErrors = {};

    if (!this.isEditMode()) {
      this.productForm.get('id')?.enable();
    }
  }

  goBack() {
    this.router.navigate(['/pages/productos']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched)) ||
      !!(this.validationErrors[fieldName]?.length);
  }

  getFieldErrors(fieldName: string): string[] {
    const errors: string[] = [];
    const field = this.productForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) errors.push('Este campo es requerido');
      if (field.errors['minlength']) errors.push(`Mínimo ${field.errors['minlength'].requiredLength} caracteres`);
      if (field.errors['maxlength']) errors.push(`Máximo ${field.errors['maxlength'].requiredLength} caracteres`);
      if (field.errors['pattern']) errors.push('URL inválida');
      if (field.errors['invalidDate']) errors.push('La fecha debe ser igual o mayor a la fecha actual');
    }

    if (this.validationErrors[fieldName]) {
      errors.push(...this.validationErrors[fieldName]);
    }

    return errors;
  }

  onImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNCA4IDI4IDEyIDI4IDE2QzI4IDIwIDI0IDI0IDIwIDI0QzE2IDI0IDEyIDIwIDEyIDE2QzEyIDEyIDE2IDggMjAgOFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
  }

  private handleFormErrors(error: any) {
    if (error.status === 400 && error.error.errors) {
      this.validationErrors = error.error.errors;
    }
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}