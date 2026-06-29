import { Component, inject } from '@angular/core';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Notificacion } from '../../../core/models';

@Component({
  selector: 'mu-notificaciones',
  imports: [CrudTableComponent],
  template: `<mu-crud-table [config]="config" />`,
})
export class NotificacionesComponent {
  private readonly service = inject(NotificacionService);

  readonly config: CrudTableConfig<any, any> = {
    title: 'Notificaciones',
    icon: 'notifications',
    service: this.service,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'usuario_id', header: 'Usuario' },
      { key: 'titulo', header: 'Título' },
      { key: 'mensaje', header: 'Mensaje' },
      { key: 'tipo', header: 'Tipo' },
      { key: 'leido', header: 'Leído', kind: 'boolean' },
      { key: 'fechaCreacion', header: 'Creación', kind: 'date' }
    ],
    fields: [
      { key: 'usuario_id', label: 'ID Usuario', type: 'number', required: true },
      { key: 'titulo', label: 'Título', type: 'text', required: true },
      { key: 'mensaje', label: 'Mensaje', type: 'textarea', required: true },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        required: true,
        options: [
          { value: 'INFO', label: 'Información' },
          { value: 'RESERVA', label: 'Reserva' },
          { value: 'PAGO', label: 'Pago' },
          { value: 'ALERTA', label: 'Alerta' },
        ],
      },
    ],
    toForm: (n: Notificacion) => ({
      usuario_id: n.usuario_id,
      titulo: n.titulo,
      mensaje: n.mensaje,
      tipo: n.tipo,
      leido: n.leido,
    }),
  };
}
