import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductResponse, ProductCreateResponse } from '../models/product.model';

@Injectable({
 providedIn: 'root'
})
export class ProductService {
 private readonly baseUrl = 'http://localhost:3002/bp/products';

 constructor(private http: HttpClient) {}

 /**
  * Obtener todos los productos financieros
  */
 getProducts(): Observable<Product[]> {
   return this.http.get<ProductResponse>(this.baseUrl)
     .pipe(
       map(response => response?.data || []),
       catchError(this.handleError)
     );
 }

 /**
  * Crear un nuevo producto financiero
  */
 createProduct(product: Omit<Product, 'id'>): Observable<Product> {
   return this.http.post<ProductCreateResponse>(this.baseUrl, product)
     .pipe(
       map(response => response.data),
       catchError(this.handleError)
     );
 }

 /**
  * Actualizar un producto financiero existente
  */
 updateProduct(id: string, product: Omit<Product, 'id'>): Observable<Product> {
   return this.http.put<ProductCreateResponse>(`${this.baseUrl}/${id}`, product)
     .pipe(
       map(response => response.data),
       catchError(this.handleError)
     );
 }

 /**
  * Eliminar un producto financiero
  */
 deleteProduct(id: string): Observable<{ message: string }> {
   return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`)
     .pipe(catchError(this.handleError));
 }

 /**
  * Verificar si un ID ya existe
  */
 verifyId(id: string): Observable<boolean> {
   return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`)
     .pipe(catchError(this.handleError));
 }

 /**
  * Manejo centralizado de errores
  */
 private handleError(error: HttpErrorResponse): Observable<never> {
   let errorMessage = 'Ocurrió un error inesperado';
   
   if (error.error instanceof ErrorEvent) {
     errorMessage = `Error: ${error.error.message}`;
   } else {
     switch (error.status) {
       case 400:
         errorMessage = 'Datos inválidos. Verifique la información ingresada.';
         break;
       case 404:
         errorMessage = 'Producto no encontrado.';
         break;
       case 500:
         errorMessage = 'Error interno del servidor.';
         break;
       case 0:
         errorMessage = 'No se puede conectar con el servidor. Verifique que esté ejecutándose en http://localhost:3002';
         break;
       default:
         errorMessage = `Error ${error.status}: ${error.message}`;
     }
   }

   console.error('Error en ProductService:', error);
   return throwError(() => new Error(errorMessage));
 }
}