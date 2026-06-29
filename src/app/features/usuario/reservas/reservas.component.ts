import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';
import { ReservaService } from '../../../core/services/reserva.service';
import { PagoService } from '../../../core/services/pago.service';
import { ReservaUsuario, PagoInsert } from '../../../core/models';
import { EntityFormDialogComponent } from '../../../shared/entity-form-dialog/entity-form-dialog.component';
import { FieldConfig } from '../../../shared/field-config';

@Component({
  selector: 'mu-mis-reservas',
  imports: [CurrencyPipe, DatePipe, MatIconModule, MatProgressBarModule, MatButtonModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss',
})
export class MisReservasComponent {
  private readonly auth = inject(AuthService);
  private readonly reservas = inject(ReservaService);
  private readonly pagos = inject(PagoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly items = signal<ReservaUsuario[]>([]);

  constructor() {
    this.load();
  }

  load(): void {
    const id = this.auth.getUserId();
    if (id == null) {
      this.loading.set(false);
      this.error.set(true);
      return;
    }
    this.loading.set(true);
    this.error.set(false);
    this.reservas.porUsuario(id).subscribe({
      next: (rows) => {
        this.items.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  statusClass(status: string): string {
    const s = (status ?? '').toUpperCase();
    if (s.includes('CONFIRM') || s.includes('ACEPT') || s.includes('COMPLET') || s.includes('PAGAD')) return 'ok';
    if (s.includes('CANCEL') || s.includes('RECHAZ')) return 'bad';
    return 'pending';
  }

  pagar(r: ReservaUsuario): void {
    const getCampos = (metodo: string): FieldConfig[] => {
      const base: FieldConfig[] = [
        { key: 'monto', label: 'Monto (S/)', type: 'number', required: true, min: r.totalPrice },
        { key: 'metodo', label: 'Método de pago', type: 'select', required: true,
          options: [
            { value: 'TARJETA', label: 'Tarjeta' },
            { value: 'YAPE', label: 'Yape' },
            { value: 'PLIN', label: 'Plin' },
          ],
        },
        { key: 'referenciaTransaccion', label: 'Referencia (opcional)', type: 'text' }
      ];

      const camposTarjeta: FieldConfig[] = [
  {
    key: 'numTarjeta',
    label: 'Número de tarjeta',
    type: 'text',
    required: true,
    hint: 'Debe tener 16 dígitos',
    pattern: '^[0-9]{16}$'
  },
  {
    key: 'titular',
    label: 'Nombre del titular',
    type: 'text',
    required: true,
    hint: 'Solo letras y espacios',
    pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'
  },
  {
    key: 'caducidad',
    label: 'Fecha de caducidad',
    type: 'text',
    required: true,
    hint: 'Formato MM/AA. Ejemplo: 12/26',
    pattern: '^(0[1-9]|1[0-2])\\/([0-9]{2})$'
  },
  {
    key: 'cvc',
    label: 'CVC / CVV',
    type: 'text',
    required: true,
    hint: 'Debe tener 3 dígitos',
    pattern: '^[0-9]{3}$'
  }
];
      
      const camposCelular: FieldConfig[] = [
  {
    key: 'telefono',
    label: 'Número de celular',
    type: 'text',
    required: true,
    hint: 'Debe tener 9 dígitos y empezar con 9',
    pattern: '^9[0-9]{8}$'
  }
];

    return [...base, ...camposTarjeta, ...camposCelular];
  };

    const ref = this.dialog.open(EntityFormDialogComponent, {
      data: {
        title: `Pagar reserva #${r.reservaId}`,
        fields: getCampos('YAPE'),
        model: { monto: r.totalPrice, metodo: 'YAPE' },
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const body: PagoInsert = {
        reservaId: r.reservaId,
        monto: result['monto'],
        metodo: result['metodo'],
        estado: 'COMPLETADO',
        referenciaTransaccion: result['referenciaTransaccion'] ?? '',
      };
      this.pagos.create(body).subscribe({
        next: () => {
          this.snack.open('¡Pago registrado con éxito!', 'OK', { duration: 3000 });
          this.load();
        },
        error: () =>
          this.snack.open('No se pudo registrar el pago.', 'Cerrar', {
            duration: 4000,
            panelClass: 'mu-snack-error',
          }),
      });
    });
  }
}
