import { Component, inject } from '@angular/core';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { ReseñaService } from '../../../core/services/reseña.service';
import { Reseña } from '../../../core/models';

@Component({
  selector: 'mu-resenas',
  imports: [CrudTableComponent],
  template: `<mu-crud-table [config]="config" />`,
})
export class ResenasComponent {
  private readonly service = inject(ReseñaService);

  readonly config: CrudTableConfig<any, any> = {
    title: 'Reseñas',
    icon: 'reviews',
    service: this.service,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'nombreUsuario', header: 'Usuario' },
      { key: 'reservaId', header: 'Reserva' },
      { key: 'rating', header: 'Calificación', kind: 'stars' },
      { key: 'comentario', header: 'Comentario' },
      { key: 'fechaCreacion', header: 'Fecha', kind: 'datetime' },
    ],
    fields: [
      { key: 'usuarioId', label: 'ID Usuario', type: 'number', required: true },
      { key: 'reservaId', label: 'ID Reserva', type: 'number', required: true },
      { key: 'rating', label: 'Rating (1-5)', type: 'number', required: true, min: 1, max: 5 },
      { key: 'comentario', label: 'Comentario', type: 'textarea', required: true },
    ],
    toForm: (r: Reseña) => ({
      usuarioId: r.usuarioId,
      reservaId: r.reservaId,
      rating: r.rating,
      comentario: r.comentario,
    }),
  };
}
