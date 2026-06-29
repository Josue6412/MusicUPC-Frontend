import { Component, inject } from '@angular/core';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { TerminoService } from '../../../core/services/termino.service';
import { Termino } from '../../../core/models';

@Component({
  selector: 'mu-terminos',
  imports: [CrudTableComponent],
  template: `<mu-crud-table [config]="config" />`,
})
export class TerminosComponent {
  private readonly service = inject(TerminoService);

  readonly config: CrudTableConfig<any, any> = {
    title: 'Términos',
    icon: 'gavel',
    service: this.service,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'reservaId', header: 'Reserva' },
      { key: 'terminos', header: 'Términos' },
      { key: 'status', header: 'Estado' },
      { key: 'fecha_confirmacion', header: 'Confirmación', kind: 'datetime' },
      { key: 'fecha_creacion', header: 'Creación', kind: 'datetime' },
    ],
    fields: [
      { key: 'reservaId', label: 'ID Reserva', type: 'number', required: true },
      { key: 'terminos', label: 'Términos', type: 'textarea', required: true },
      {
        key: 'status',
        label: 'Estado',
        type: 'select',
        required: true,
        options: [
          { value: 'PENDIENTE', label: 'Pendiente' },
          { value: 'ACEPTADO', label: 'Aceptado' },
          { value: 'RECHAZADO', label: 'Rechazado' },
        ],
      },
      { key: 'fecha_confirmacion', label: 'Fecha de confirmación', type: 'date' },
      { key: 'fecha_creacion', label: 'Fecha de creación', type: 'date' },
    ],
    toForm: (t: Termino) => ({
      reservaId: t.reservaId,
      terminos: t.terminos,
      status: t.status,
      fecha_confirmacion: t.fecha_confirmacion,
      fecha_creacion: t.fecha_creacion,
    }),
  };
}
