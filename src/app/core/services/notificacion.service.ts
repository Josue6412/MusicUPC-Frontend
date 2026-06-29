import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Notificacion, NotificacionInsert } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificacionService extends CrudService<Notificacion, NotificacionInsert> {
  protected readonly resource = 'notificaciones';

  porUsuario(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.base}/usuario/${usuarioId}`);
  }

  marcarComoLeida(id: number) {
    return this.http.patch<Notificacion>(`${this.base}/${id}/leer`, {});
  }
}