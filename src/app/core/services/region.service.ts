import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Region, RegionInsert, RegionArtistasDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class RegionService extends CrudService<Region, RegionInsert> {
  protected readonly resource = 'regiones';

  buscar(q: string): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.base}/buscar`, { params: { q } });
  }

  estadisticasArtistas(): Observable<RegionArtistasDTO[]> {
    return this.http.get<RegionArtistasDTO[]>(`${this.base}/estadisticas/artistas`);
  }
}
