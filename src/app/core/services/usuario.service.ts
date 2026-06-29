import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Usuario, UsuarioInsert } from '../models';

@Injectable({ providedIn: 'root' })
export class UsuarioService extends CrudService<Usuario, UsuarioInsert> {
  protected readonly resource = 'usuarios';

  buscar(q: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.base}/buscar`, { params: { q } });
  }

  porRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.base}/rol`, { params: { rol } });
  }

  subirFotoPerfil(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Usuario>(
      `${this.base}/${id}/foto`,
      formData
    );
  }
}
