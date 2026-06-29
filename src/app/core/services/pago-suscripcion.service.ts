import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { PagoSuscripcion, PagoSuscripcionInsert } from '../models';

@Injectable({ providedIn: 'root' })
export class PagoSuscripcionService extends CrudService<PagoSuscripcion, PagoSuscripcionInsert> {
  protected readonly resource = 'pagos-suscripcion';

  porUsuario(usuarioId: number): Observable<PagoSuscripcion[]> {
    return this.http.get<PagoSuscripcion[]>(`${this.base}/usuario/${usuarioId}`);
  }
}