import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Reseña, ReseñaInsert } from '../models';

@Injectable({ providedIn: 'root' })
export class ReseñaService extends CrudService<Reseña, ReseñaInsert> {
  protected readonly resource = 'reseñas';

  porUsuario(usuarioId: number): Observable<Reseña[]> {
    return this.http.get<Reseña[]>(`${this.base}/usuario/${usuarioId}`);
  }

  promedioPorReserva(reservaId: number): Observable<number> {
    return this.http.get<number>(`${this.base}/reserva/${reservaId}/promedio`);
  }
}
