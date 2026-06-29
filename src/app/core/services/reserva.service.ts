import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Reserva, ReservaInsert, ReservaUsuario } from '../models';

@Injectable({ providedIn: 'root' })
export class ReservaService extends CrudService<Reserva, ReservaInsert> {
  protected readonly resource = 'reservas';

  porUsuario(usuarioId: number): Observable<ReservaUsuario[]> {
    return this.http.get<ReservaUsuario[]>(`${this.base}/usuario/${usuarioId}`);
  }
}
