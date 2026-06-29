import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Genero, GeneroInsert, GeneroArtistasDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class GeneroService extends CrudService<Genero, GeneroInsert> {
  protected readonly resource = 'generos';

  buscar(q: string): Observable<Genero[]> {
    return this.http.get<Genero[]>(`${this.base}/buscar`, { params: { q } });
  }

  estadisticasArtistas(): Observable<GeneroArtistasDTO[]> {
    return this.http.get<GeneroArtistasDTO[]>(`${this.base}/estadisticas/artistas`);
  }
}
