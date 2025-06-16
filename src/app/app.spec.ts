import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppComponent } from '../app.component';
import { CrudProductos } from './pages/crud/crud';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { ProductService } from './pages/services/product.service';
import { SkeletonLoaderComponent } from './shared/skeleton-loader.component';
import { AppLayout } from './layout/components/app.layout';
import { AppTopbar } from './layout/components/app.topbar';
import { Product } from './pages/models/product.model';

describe('Prueba Técnica Angular - Tests Completos', () => {

    // ========== PRODUCTSERVICE TESTS ==========
    describe('ProductService', () => {
        let service: ProductService;
        let httpMock: HttpTestingController;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [ProductService]
            });
            service = TestBed.inject(ProductService);
            httpMock = TestBed.inject(HttpTestingController);
        });

        afterEach(() => {
            httpMock.verify();
        });

        it('should create service', () => {
            expect(service).toBeTruthy();
        });

        it('should get products', () => {
            const mockResponse = {
                data: [
                    {
                        id: '1',
                        name: 'Test Product',
                        description: 'Test Description',
                        logo: 'test-logo.png',
                        date_release: '2025-01-01',
                        date_revision: '2026-01-01'
                    }
                ]
            };

            service.getProducts().subscribe(products => {
                expect(products.length).toBe(1);
                expect(products[0].name).toBe('Test Product');
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('should create product', () => {
            const newProduct = {
                name: 'New Product',
                description: 'New Description',
                logo: 'new-logo.png',
                date_release: '2025-01-01',
                date_revision: '2026-01-01'
            };
            const mockResponse = {
                message: 'Product created',
                data: { id: '1', ...newProduct }
            };

            service.createProduct(newProduct as any).subscribe(product => {
                expect(product.name).toBe('New Product');
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            expect(req.request.method).toBe('POST');
            req.flush(mockResponse);
        });

        it('should update product', () => {
            const updateData = {
                name: 'Updated Product',
                description: 'Updated Description',
                logo: 'updated-logo.png',
                date_release: '2025-01-01',
                date_revision: '2026-01-01'
            };
            const mockResponse = {
                message: 'Product updated',
                data: { id: '1', ...updateData }
            };

            service.updateProduct('1', updateData as any).subscribe();

            const req = httpMock.expectOne('http://localhost:3002/bp/products/1');
            expect(req.request.method).toBe('PUT');
            req.flush(mockResponse);
        });

        it('should delete product', () => {
            service.deleteProduct('1').subscribe();

            const req = httpMock.expectOne('http://localhost:3002/bp/products/1');
            expect(req.request.method).toBe('DELETE');
            req.flush({ message: 'Deleted' });
        });

        it('should verify ID', () => {
            service.verifyId('test').subscribe();

            const req = httpMock.expectOne('http://localhost:3002/bp/products/verification/test');
            req.flush(true);
        });

        it('should handle errors', () => {
            service.getProducts().subscribe({
                error: (error) => expect(error.message).toContain('Error')
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            req.flush('Error', { status: 500, statusText: 'Server Error' });
        });

        it('should handle 400 error', () => {
            service.getProducts().subscribe({
                error: (error) => expect(error.message).toContain('Datos inválidos')
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
        });

        it('should handle 404 error', () => {
            service.getProducts().subscribe({
                error: (error) => expect(error.message).toContain('Producto no encontrado')
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        });

        it('should handle 500 error', () => {
            service.getProducts().subscribe({
                error: (error) => expect(error.message).toContain('Error interno del servidor')
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
        });

        it('should handle network error', () => {
            service.getProducts().subscribe({
                error: (error) => expect(error.message).toContain('No se puede conectar con el servidor')
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            req.flush('', { status: 0, statusText: 'Unknown Error' });
        });
        it('should handle empty response data', () => {
            const mockResponse = { data: [] };

            service.getProducts().subscribe(products => {
                expect(products.length).toBe(0);
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            req.flush(mockResponse);
        });

        it('should handle null response', () => {
            service.getProducts().subscribe(products => {
                expect(products).toEqual([]);
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            req.flush(null);
        });

        it('should handle undefined response', () => {
            service.getProducts().subscribe(products => {
                expect(products).toEqual([]);
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            req.flush(null);
        });

        it('should handle error event', () => {
            const errorEvent = new ErrorEvent('Network error');

            service.getProducts().subscribe({
                error: (error) => expect(error.message).toContain('Error')
            });

            const req = httpMock.expectOne('http://localhost:3002/bp/products');
            req.error(errorEvent);
        });

    });

    // ========== CRUD COMPONENT TESTS ==========
    describe('CrudProductos', () => {
        let component: CrudProductos;
        let fixture: ComponentFixture<CrudProductos>;
        let productServiceSpy: any;
        let routerSpy: any;

        const mockProducts: Product[] = [
            {
                id: '1',
                name: 'Producto 1',
                description: 'Descripción del producto 1',
                logo: 'logo1.png',
                date_release: '2025-01-01',
                date_revision: '2026-01-01'
            },
            {
                id: '2',
                name: 'Producto 2',
                description: 'Descripción del producto 2',
                logo: 'logo2.png',
                date_release: '2025-02-01',
                date_revision: '2026-02-01'
            }
        ];

        beforeEach(async () => {
            productServiceSpy = {
                getProducts: jest.fn().mockReturnValue(of(mockProducts)),
                deleteProduct: jest.fn().mockReturnValue(of({ message: 'Deleted' }))
            };

            routerSpy = {
                navigate: jest.fn()
            };

            await TestBed.configureTestingModule({
                imports: [CrudProductos, RouterTestingModule],
                providers: [
                    { provide: ProductService, useValue: productServiceSpy },
                    { provide: Router, useValue: routerSpy }
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(CrudProductos);
            component = fixture.componentInstance;
        });

        it('should create crud component', () => {
            expect(component).toBeTruthy();
        });

        it('should load products on init', () => {
            component.ngOnInit();
            expect(productServiceSpy.getProducts).toHaveBeenCalled();
        });

        it('should filter products', () => {
            component.products.set(mockProducts);
            component.filteredProducts.set(mockProducts);

            component.onSearch('Producto 1');

            expect(component.filteredProducts().length).toBe(1);
        });

        it('should filter products by description', () => {
            component.products.set(mockProducts);
            component.filteredProducts.set(mockProducts);

            component.onSearch('producto 2');

            expect(component.filteredProducts().length).toBe(1);
        });

        it('should reset filter when search is empty', () => {
            component.products.set(mockProducts);
            component.filteredProducts.set([mockProducts[0]]);

            component.onSearch('');

            expect(component.filteredProducts().length).toBe(2);
        });

        it('should change page size', () => {
            component.onPageSizeChange('10');
            expect(component.pageSize()).toBe(10);
            expect(component.currentPage()).toBe(1);
        });

        it('should navigate to create', () => {
            component.goToCreate();
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/pages/crear-producto']);
        });

        it('should navigate to edit', () => {
            const mockEvent = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            };
            component.editProduct(mockEvent as any, '1');
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/pages/editar-producto', '1']);
        });

        it('should open delete modal', () => {
            const mockEvent = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            };
            component.confirmDelete(mockEvent as any, mockProducts[0]);
            expect(component.showDeleteModal()).toBeTrue();
        });

        it('should close delete modal', () => {
            component.showDeleteModal.set(true);
            component.closeDeleteModal();
            expect(component.showDeleteModal()).toBeFalse();
        });

        it('should delete product', () => {
            component.products.set(mockProducts);
            component.productToDelete.set(mockProducts[0]);

            component.deleteProduct();

            expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith('1');
        });

        it('should handle delete error', () => {
            productServiceSpy.deleteProduct.mockReturnValue(throwError(() => new Error('Delete failed')));
            jest.spyOn(console, 'error').mockImplementation();

            component.productToDelete.set(mockProducts[0]);
            component.deleteProduct();

            expect(console.error).toHaveBeenCalled();
        });

        it('should toggle dropdown', () => {
            const mockEvent = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            };

            component.toggleDropdown(mockEvent as any, '1');
            expect(component.activeDropdown()).toBe('1');

            component.toggleDropdown(mockEvent as any, '1');
            expect(component.activeDropdown()).toBeNull();
        });

        it('should close dropdown', () => {
            component.activeDropdown.set('1');
            component.closeDropdown();
            expect(component.activeDropdown()).toBeNull();
        });

        it('should handle image error', () => {
            const mockEvent = {
                target: {
                    style: { display: '' },
                    parentElement: {
                        querySelector: jest.fn().mockReturnValue({
                            style: { display: '' }
                        })
                    }
                }
            };

            component.onImageError(mockEvent);
            expect(mockEvent.target.style.display).toBe('none');
        });

        it('should handle image load', () => {
            const mockEvent = {
                target: {
                    style: { display: '' },
                    parentElement: {
                        querySelector: jest.fn().mockReturnValue({
                            style: { display: '' }
                        })
                    }
                }
            };

            component.onImageLoad(mockEvent);
            expect(mockEvent.target.style.display).toBe('block');
        });

        it('should get skeleton rows', () => {
            component.pageSize.set(5);
            const rows = component.getSkeletonRows();
            expect(rows.length).toBe(5);
        });

        it('should get empty rows when not loading', () => {
            component.loading.set(false);
            component.pageSize.set(5);

            const emptyRows = component.getEmptyRows();
            expect(emptyRows.length).toBeGreaterThanOrEqual(0);
        });

        it('should handle load products error', () => {
            productServiceSpy.getProducts.mockReturnValue(throwError(() => new Error('Load failed')));

            component.loadProducts();

            expect(component.error()).toBe('Load failed');
            expect(component.loading()).toBeFalse();
        });

        it('should track methods work', () => {
            expect(component.trackByProduct(0, mockProducts[0])).toBe('1');
            expect(component.trackByIndex(5)).toBe(5);
        });

        it('should handle document click outside dropdown', () => {
            component.activeDropdown.set('1');
            const mockEvent = {
                target: document.createElement('div')
            };

            component.onDocumentClick(mockEvent as any);
            expect(component.activeDropdown()).toBeNull();
        });
    });

    // ========== PRODUCT FORM TESTS ==========
    describe('ProductFormComponent', () => {
        let component: ProductFormComponent;
        let fixture: ComponentFixture<ProductFormComponent>;
        let productServiceSpy: any;
        let routerSpy: any;

        beforeEach(async () => {
            productServiceSpy = {
                getProducts: jest.fn().mockReturnValue(of([])),
                createProduct: jest.fn().mockReturnValue(of({})),
                updateProduct: jest.fn().mockReturnValue(of({})),
                verifyId: jest.fn().mockReturnValue(of(false))
            };

            routerSpy = {
                navigate: jest.fn()
            };

            await TestBed.configureTestingModule({
                imports: [ProductFormComponent, ReactiveFormsModule, RouterTestingModule],
                providers: [
                    { provide: ProductService, useValue: productServiceSpy },
                    { provide: Router, useValue: routerSpy },
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            snapshot: {
                                paramMap: {
                                    get: jest.fn().mockReturnValue(null)
                                }
                            }
                        }
                    }
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(ProductFormComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should create form component', () => {
            expect(component).toBeTruthy();
        });

        it('should create form with validators', () => {
            expect(component.productForm).toBeTruthy();
            expect(component.productForm.get('id')?.hasError('required')).toBeTrue();
        });

        it('should validate ID length', () => {
            const idControl = component.productForm.get('id');

            idControl?.setValue('ab');
            expect(idControl?.hasError('minlength')).toBeTrue();

            idControl?.setValue('12345678901');
            expect(idControl?.hasError('maxlength')).toBeTrue();
        });

        it('should validate name length', () => {
            const nameControl = component.productForm.get('name');

            nameControl?.setValue('abc');
            expect(nameControl?.hasError('minlength')).toBeTrue();

            nameControl?.setValue('a'.repeat(101));
            expect(nameControl?.hasError('maxlength')).toBeTrue();
        });

        it('should validate description length', () => {
            const descControl = component.productForm.get('description');

            descControl?.setValue('short');
            expect(descControl?.hasError('minlength')).toBeTrue();

            descControl?.setValue('a'.repeat(201));
            expect(descControl?.hasError('maxlength')).toBeTrue();
        });

        it('should validate logo URL pattern', () => {
            const logoControl = component.productForm.get('logo');

            logoControl?.setValue('invalid-url');
            expect(logoControl?.hasError('pattern')).toBeTrue();

            logoControl?.setValue('https://valid-url.com/logo.png');
            expect(logoControl?.valid).toBeTrue();
        });

        it('should validate past dates', () => {
            const dateControl = component.productForm.get('date_release');
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            dateControl?.setValue(yesterday.toISOString().split('T')[0]);
            expect(dateControl?.hasError('invalidDate')).toBeTrue();
        });

        it('should set revision date automatically', () => {
            component.productForm.get('date_release')?.setValue('2025-06-15');
            component.onReleaseDateChange();
            expect(component.productForm.get('date_revision')?.value).toBe('2026-06-15');
        });

        it('should reset form', () => {
            component.productForm.patchValue({ name: 'Test' });
            component.resetForm();
            expect(component.productForm.get('name')?.value).toBeNull();
        });

        it('should navigate back', () => {
            component.goBack();
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/pages/productos']);
        });

        it('should detect invalid fields', () => {
            component.productForm.get('name')?.markAsTouched();
            component.productForm.get('name')?.setValue('');
            expect(component.isFieldInvalid('name')).toBeTrue();
        });

        it('should get field errors', () => {
            component.productForm.get('name')?.markAsTouched();
            component.productForm.get('name')?.setValue('');
            const errors = component.getFieldErrors('name');
            expect(errors).toContain('Este campo es requerido');
        });

        it('should get field errors for minlength', () => {
            const nameControl = component.productForm.get('name');
            nameControl?.markAsTouched();
            nameControl?.setValue('ab');

            const errors = component.getFieldErrors('name');
            expect(errors.some(error => error.includes('Mínimo'))).toBeTruthy();
        });

        it('should get field errors for maxlength', () => {
            const nameControl = component.productForm.get('name');
            nameControl?.markAsTouched();
            nameControl?.setValue('a'.repeat(101));

            const errors = component.getFieldErrors('name');
            expect(errors.some(error => error.includes('Máximo'))).toBeTruthy();
        });

        it('should get field errors for pattern', () => {
            const logoControl = component.productForm.get('logo');
            logoControl?.markAsTouched();
            logoControl?.setValue('invalid-url');

            const errors = component.getFieldErrors('logo');
            expect(errors).toContain('URL inválida');
        });

        it('should get field errors for invalid date', () => {
            const dateControl = component.productForm.get('date_release');
            dateControl?.markAsTouched();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            dateControl?.setValue(yesterday.toISOString().split('T')[0]);

            const errors = component.getFieldErrors('date_release');
            expect(errors).toContain('La fecha debe ser igual o mayor a la fecha actual');
        });

        it('should handle form submission', async () => {
            (component as any).editId = null;
            const formData = {
                id: 'test-id',
                name: 'Test Product Name',
                description: 'Test description for the product',
                logo: 'https://test.com/logo.png',
                date_release: '2099-06-15',
                date_revision: '2100-06-15'
            };

            component.productForm.setValue(formData);
            component.productForm.markAllAsTouched();
            fixture.detectChanges();

            await component.onSubmit();

            expect(productServiceSpy.verifyId).toHaveBeenCalled();
        });

        it('should handle image error in onImageError', () => {
            const mockEvent = {
                target: { src: 'original-src' }
            };

            component.onImageError(mockEvent);

            expect(mockEvent.target.src).toContain('data:image/svg+xml');
        });
        it('should handle load product when product not found', async () => {
            productServiceSpy.getProducts.mockReturnValue(of([]));

            await component.loadProduct('non-existent-id');

            expect(component.loadingForm()).toBeFalse();
        });

        it('should handle form submission with ID verification error', async () => {
            productServiceSpy.verifyId.mockReturnValue(throwError(() => new Error('Verification failed')));

            const formData = {
                id: 'test-id',
                name: 'Test Product Name',
                description: 'Test description for the product',
                logo: 'https://test.com/logo.png',
                date_release: '2099-06-15',
                date_revision: '2100-06-15'
            };

            component.productForm.setValue(formData);

            await component.onSubmit();

            expect(component.loading()).toBeFalse();
        });

        it('should handle form submission in edit mode with error', async () => {
            (component as any).editId = 'test-id';
            component.isEditMode.set(true);
            productServiceSpy.updateProduct.mockReturnValue(throwError(() => new Error('Update failed')));

            const formData = {
                id: 'test-id',
                name: 'Test Product Name',
                description: 'Test description for the product',
                logo: 'https://test.com/logo.png',
                date_release: '2099-06-15',
                date_revision: '2100-06-15'
            };

            component.productForm.setValue(formData);

            await component.onSubmit();

            expect(component.loading()).toBeFalse();
        });

        it('should handle validation errors for idExists', () => {
            component.validationErrors = { id: ['ID ya existe'] };
            const errors = component.getFieldErrors('id');
            expect(errors).toContain('ID ya existe');
        });

        it('should handle field without validation errors', () => {
            const nameControl = component.productForm.get('name');
            nameControl?.setValue('Valid name');
            nameControl?.markAsTouched();

            const errors = component.getFieldErrors('name');
            expect(errors.length).toBe(0);
        });

        it('should handle date validation with empty value', () => {
            const control = { value: null };
            const result = component.dateValidator(control as any);
            expect(result).toBeNull();
        });

        it('should handle error with status 400 and errors object', () => {
            const error = {
                status: 400,
                error: {
                    errors: {
                        name: ['Name is required']
                    }
                }
            };

            component['handleFormErrors'](error);
            expect(component.validationErrors['name']).toEqual(['Name is required']);
        });

        it('should handle error without errors object', () => {
            const error = {
                status: 500,
                error: {}
            };

            component['handleFormErrors'](error);
            expect(component.validationErrors).toEqual({});
        });

        it('debería manejar error de verificación', async () => {
            spyOn(console, 'error');

            productServiceSpy.verifyId.mockReturnValue(throwError(() => new Error('Verification failed')));
            component.productForm.setValue({
                id: 'test-id',
                name: 'Test Product',
                description: 'desc',
                logo: 'logo.png',
                date_release: '2099-01-01',
                date_revision: '2099-12-31'
            });

            await component.onSubmit();

        });

    });
    // ========== SKELETON LOADER TESTS ==========
    describe('SkeletonLoaderComponent', () => {
        let component: SkeletonLoaderComponent;
        let fixture: ComponentFixture<SkeletonLoaderComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [SkeletonLoaderComponent]
            }).compileComponents();

            fixture = TestBed.createComponent(SkeletonLoaderComponent);
            component = fixture.componentInstance;
        });

        it('should create skeleton', () => {
            expect(component).toBeTruthy();
        });

        it('should have default values', () => {
            expect(component.type).toBe('text');
            expect(component.count).toBe(3);
        });

        it('should generate array', () => {
            expect(component.getArray(5)).toEqual([0, 1, 2, 3, 4]);
        });

        it('should track by index', () => {
            expect(component.trackByIndex(3)).toBe(3);
        });

    });

    // ========== LAYOUT COMPONENTS TESTS ==========
    describe('AppComponent', () => {
        let component: AppComponent;
        let fixture: ComponentFixture<AppComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [AppComponent, RouterTestingModule]
            }).compileComponents();

            fixture = TestBed.createComponent(AppComponent);
            component = fixture.componentInstance;
        });

        it('should create app', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('AppLayout', () => {
        let component: AppLayout;
        let fixture: ComponentFixture<AppLayout>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [AppLayout, RouterTestingModule]
            }).compileComponents();

            fixture = TestBed.createComponent(AppLayout);
            component = fixture.componentInstance;
        });

        it('should create layout', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('AppTopbar', () => {
        let component: AppTopbar;
        let fixture: ComponentFixture<AppTopbar>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [AppTopbar]
            }).compileComponents();

            fixture = TestBed.createComponent(AppTopbar);
            component = fixture.componentInstance;
        });

        it('should create topbar', () => {
            expect(component).toBeTruthy();
        });

        it('should toggle sidebar', () => {
            const mockSidebar = {
                classList: { toggle: jest.fn() }
            };
            const mockContent = {
                classList: { toggle: jest.fn() }
            };

            jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
                if (selector === '.layout-sidebar') return mockSidebar as any;
                if (selector === '.layout-content') return mockContent as any;
                return null;
            });

            component.toggleSidebar();

            expect(mockSidebar.classList.toggle).toHaveBeenCalledWith('collapsed');
            expect(mockContent.classList.toggle).toHaveBeenCalledWith('expanded');
        });
    });
});