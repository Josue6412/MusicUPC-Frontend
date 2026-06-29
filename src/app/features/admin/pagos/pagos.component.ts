import { Component, inject } from '@angular/core';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { PagoService } from '../../../core/services/pago.service';
import { Pago } from '../../../core/models';

@Component({
  selector: 'mu-pagos',
  imports: [CrudTableComponent],
  template: `<mu-crud-table [config]="config" />`,
})
export class PagosComponent {
  private readonly service = inject(PagoService);

  readonly config: CrudTableConfig<any, any> = {
    title: 'Pagos',
    icon: 'payments',
    service: this.service,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'reservaId', header: 'Reserva' },
      { key: 'monto', header: 'Monto', kind: 'currency' },
      { key: 'metodo', header: 'Método' },
      { key: 'estado', header: 'Estado' },
      { key: 'referenciaTransaccion', header: 'Referencia' },
      { key: 'fechaPago', header: 'Fecha pago', kind: 'datetime' },
    ],
    fields: [
      {
        key: 'reservaId',
        label: 'ID de reserva',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        key: 'monto',
        label: 'Monto (S/)',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        key: 'metodo',
        label: 'Método de pago',
        type: 'select',
        required: true,
        options: [
          { value: 'TARJETA', label: 'Tarjeta' },
          { value: 'YAPE', label: 'Yape' },
          { value: 'PLIN', label: 'Plin' },
        ],
      },
      {
        key: 'referenciaTransaccion',
        label: 'Referencia (opcional)',
        type: 'text',
      },
      {
        key: 'numTarjeta',
        label: 'Número de tarjeta',
        type: 'text',
        required: true,
        hint: 'Debe tener 16 dígitos',
        pattern: '^[0-9]{16}$',
      },
      {
        key: 'titular',
        label: 'Nombre del titular',
        type: 'text',
        required: true,
        hint: 'Solo letras y espacios',
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$',
      },
      {
        key: 'caducidad',
        label: 'Fecha de caducidad',
        type: 'text',
        required: true,
        hint: 'Formato MM/AA. Ejemplo: 12/26',
        pattern: '^(0[1-9]|1[0-2])\\/([0-9]{2})$',
      },
      {
        key: 'cvc',
        label: 'CVC / CVV',
        type: 'text',
        required: true,
        hint: 'Debe tener 3 dígitos',
        pattern: '^[0-9]{3}$',
      },
      {
        key: 'telefono',
        label: 'Número de celular',
        type: 'text',
        required: true,
        hint: 'Debe tener 9 dígitos y empezar con 9',
        pattern: '^9[0-9]{8}$',
      },
    ],
    toForm: (p: Pago) => ({
      reservaId: p.reservaId,
      monto: p.monto,
      metodo: p.metodo,
      estado: p.estado,
      referenciaTransaccion: p.referenciaTransaccion,
    }),
  };
}
