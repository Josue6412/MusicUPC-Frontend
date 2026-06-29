import { Component, inject } from '@angular/core';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { SuscripcionService } from '../../../core/services/suscripcion.service';
import { Suscripcion } from '../../../core/models';

@Component({
  selector: 'mu-suscripciones',
  imports: [CrudTableComponent],
  template: `<mu-crud-table [config]="config" />`,
})
export class SuscripcionesComponent {
  private readonly service = inject(SuscripcionService);

  readonly config: CrudTableConfig<any, any> = {
    title: 'Suscripciones',
    icon: 'card_membership',
    service: this.service,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'usuario_id', header: 'Usuario' },
      { key: 'tipo_plan', header: 'Plan' },
      { key: 'precio', header: 'Precio', kind: 'currency' },
      { key: 'fecha_inicio', header: 'Inicio', kind: 'date' },
      { key: 'fecha_fin', header: 'Fin', kind: 'date' },
      { key: 'estado', header: 'Estado' },
    ],
    fields: [
      { key: 'usuario_id', label: 'ID Usuario', type: 'number', required: true },
      {
        key: 'tipo_plan',
        label: 'Plan',
        type: 'select',
        required: true,
        options: [
          { value: 'BASICO', label: 'Básico' },
          { value: 'PREMIUM', label: 'Premium' },
          { value: 'PRO', label: 'Pro' },
        ],
      },
      { key: 'precio', label: 'Precio', type: 'number', required: true, min: 0 },
      { key: 'fecha_fin', label: 'Fecha de fin', type: 'date', required: true },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        required: true,
        options: [
          { value: 'ACTIVA', label: 'Activa' },
          { value: 'VENCIDA', label: 'Vencida' },
          { value: 'CANCELADA', label: 'Cancelada' },
        ],
      },
    ],
    toForm: (s: Suscripcion) => ({
      usuario_id: s.usuario_id,
      tipo_plan: s.tipo_plan,
      precio: s.precio,
      fecha_fin: s.fecha_fin,
      estado: s.estado,
    }),
  };
}
