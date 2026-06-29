import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';

/**
 * Base genérica para los servicios CRUD: GET/POST/PUT/DELETE sobre `/<resource>`.
 * `T` = entidad de lectura, `I` = DTO de inserción/edición.
 */
export abstract class CrudService<T, I> {
  protected readonly http = inject(HttpClient);
  /** Ruta del recurso, ej. 'usuarios'. */
  protected abstract readonly resource: string;

  protected get base(): string {
    return `${API_URL}/${this.resource}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.base);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.base}/${id}`);
  }

  create(body: I): Observable<T> {
    return this.http.post<T>(this.base, body);
  }

  update(id: number, body: I): Observable<T> {
    return this.http.put<T>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
