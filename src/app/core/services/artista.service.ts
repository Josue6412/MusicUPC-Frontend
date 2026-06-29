import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Artista, ArtistaInsert } from '../models';

@Injectable({ providedIn: 'root' })
export class ArtistaService extends CrudService<Artista, ArtistaInsert> {
  protected readonly resource = 'artistas';

  buscar(q: string): Observable<Artista[]> {
    return this.http.get<Artista[]>(`${this.base}/buscar`, { params: { q } });
  }

  disponibles(): Observable<Artista[]> {
    return this.http.get<Artista[]>(`${this.base}/disponibles`);
  }
}
