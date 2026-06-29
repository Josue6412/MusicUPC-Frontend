import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Suscripcion, SuscripcionInsert } from '../models';

@Injectable({ providedIn: 'root' })
export class SuscripcionService extends CrudService<Suscripcion, SuscripcionInsert> {
  protected readonly resource = 'suscripciones';

  porUsuario(usuarioId: number): Observable<Suscripcion[]> {
    return this.http.get<Suscripcion[]>(`${this.base}/usuario/${usuarioId}`);
  }
}