import { Component, inject } from '@angular/core';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { ReservaService } from '../../../core/services/reserva.service';
import { Reserva } from '../../../core/models';

@Component({
  selector: 'mu-reservas',
  imports: [CrudTableComponent],
  template: `<mu-crud-table [config]="config" />`,
})
export class ReservasComponent {
  private readonly service = inject(ReservaService);

  readonly config: CrudTableConfig<any, any> = {
    title: 'Reservas',
    icon: 'event',
    service: this.service,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'clienteId', header: 'Cliente' },
      { key: 'fechaEvento', header: 'Fecha', kind: 'date' },
      { key: 'horaEvento', header: 'Hora' },
      { key: 'ubicacionEvento', header: 'Ubicación' },
      { key: 'tipoEvento', header: 'Tipo' },
      { key: 'duracionHoras', header: 'Horas' },
      { key: 'precioTotal', header: 'Total', kind: 'currency' },
      { key: 'estado', header: 'Estado' },
    ],
    fields: [
      { key: 'clienteId', label: 'ID Cliente', type: 'number', required: true },
      { key: 'fechaEvento', label: 'Fecha del evento', type: 'date', required: true },
      { key: 'horaEvento', label: 'Hora del evento', type: 'time', required: true },
      { key: 'ubicacionEvento', label: 'Ubicación', type: 'text', required: true },
      {
        key: 'tipoEvento',
        label: 'Tipo de evento',
        type: 'select',
        required: true,
        options: [
          { value: 'BODA', label: 'Boda' },
          { value: 'CORPORATIVO', label: 'Corporativo' },
          { value: 'FESTIVAL', label: 'Festival' },
          { value: 'PRIVADO', label: 'Privado' },
        ],
      },
      { key: 'duracionHoras', label: 'Duración (horas)', type: 'number', required: true, min: 1 },
      { key: 'precioTotal', label: 'Precio total', type: 'number', required: true, min: 0 },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ],
    toForm: (r: Reserva) => ({
      clienteId: r.clienteId,
      fechaEvento: r.fechaEvento,
      horaEvento: r.horaEvento,
      ubicacionEvento: r.ubicacionEvento,
      tipoEvento: r.tipoEvento,
      duracionHoras: r.duracionHoras,
      precioTotal: r.precioTotal,
      notas: r.notas,
    }),
  };
}
