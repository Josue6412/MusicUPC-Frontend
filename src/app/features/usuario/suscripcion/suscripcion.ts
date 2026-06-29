import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';
import { SuscripcionService } from '../../../core/services/suscripcion.service';
import { PagoSuscripcionService } from '../../../core/services/pago-suscripcion.service';
import { Suscripcion as SuscripcionModel, PagoSuscripcionInsert } from '../../../core/models';
import { EntityFormDialogComponent } from '../../../shared/entity-form-dialog/entity-form-dialog.component';
import { FieldConfig } from '../../../shared/field-config';

@Component({
  selector: 'mu-suscripcion-usuario',
  imports: [ DecimalPipe, DatePipe, MatIconModule, MatButtonModule, MatProgressBarModule, ],
  templateUrl: './suscripcion.html',
  styleUrl: './suscripcion.scss',
})
export class SuscripcionUsuarioComponent {
  private readonly auth = inject(AuthService);
  private readonly suscripciones = inject(SuscripcionService);
  private readonly pagosSuscripcion = inject(PagoSuscripcionService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly actual = signal<SuscripcionModel | null>(null);
  readonly historialPagos = signal<any[]>([]);

  readonly planes = [
    { tipo: 'BASICO', nombre: 'Plan Básico', precio: 19.9, descripcion: 'Acceso mensual básico a beneficios MusicUPC.' },
    { tipo: 'PREMIUM', nombre: 'Plan Premium', precio: 29.9, descripcion: 'Más beneficios, prioridad y promociones exclusivas.' },
    { tipo: 'PRO', nombre: 'Plan Pro', precio: 49.9, descripcion: 'La experiencia completa para usuarios frecuentes.' },
  ];

  constructor() {
    this.load();
  }

  load(): void {
    const usuarioId = this.auth.getUserId();

    if (usuarioId == null) {
      this.loading.set(false);
      this.error.set(true);
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    this.suscripciones.porUsuario(usuarioId).subscribe({
      next: (rows) => {
        this.actual.set(rows.length ? rows[0] : null);
        this.cargarHistorialPagos(usuarioId);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  cargarHistorialPagos(usuarioId: number): void {
    this.pagosSuscripcion.porUsuario(usuarioId).subscribe({
      next: (rows) => {
        this.historialPagos.set(rows);
      },
      error: () => {
        this.historialPagos.set([]);
      },
    });
  }

  estadoClass(estado: string | undefined): string {
    const e = (estado ?? '').toUpperCase();

    if (e.includes('PAGADA') || e.includes('ACTIVA')) return 'ok';
    if (e.includes('PENDIENTE')) return 'pending';
    if (e.includes('VENCIDA') || e.includes('CANCELADA')) return 'bad';

    return 'pending';
  }

  diasRestantes(): number {
    const s = this.actual();

    if (!s?.fecha_fin) {
      return 0;
    }

    const hoy = new Date();
    const fin = new Date(s.fecha_fin);

    hoy.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);

    const diff = fin.getTime() - hoy.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  porcentajeRestante(): number {
    if (this.suscripcionVencida() || this.estaPorVencer()) {
      return 5;
    }

    const s = this.actual();

    if (!s?.fecha_inicio || !s?.fecha_fin) {
      return 0;
    }

    const inicio = new Date(s.fecha_inicio);
    const fin = new Date(s.fecha_fin);
    const hoy = new Date();

    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const total = fin.getTime() - inicio.getTime();
    const restante = fin.getTime() - hoy.getTime();

    if (total <= 0) {
      return 0;
    }

    return Math.max(0, Math.min(100, Math.round((restante / total) * 100)));
  }

  esPlanActual(tipo: string): boolean {
    return this.actual()?.tipo_plan === tipo && this.estadoClass(this.actual()?.estado) === 'ok';
  }

  formatearPlan(plan?: string): string {

    if (!plan) {
      return '';
    }

    return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
  }

  formatearMetodo(metodo?: string): string {
    if (!metodo) return '';

    const m = metodo.toUpperCase();

    if (m === 'YAPE') return 'Yape';
    if (m === 'PLIN') return 'Plin';
    if (m === 'TARJETA') return 'Tarjeta';

    return metodo;
  }

  iconoMetodo(metodo?: string): string {
    if (!metodo) return 'payments';

    const m = metodo.toUpperCase();

    if (m === 'YAPE') return 'smartphone';
    if (m === 'PLIN') return 'phone_iphone';
    if (m === 'TARJETA') return 'credit_card';

    return 'payments';
  }

  estaPorVencer(): boolean {
    return !this.suscripcionVencida() && this.diasRestantes() <= 1;
  }

  suscripcionVencida(): boolean {
    const s = this.actual();

    if (!s?.fecha_fin) {
      return false;
    }

    const hoy = new Date();
    const fin = new Date(s.fecha_fin);

    hoy.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);

    return fin < hoy;
  }

  textoEstadoSuscripcion(): string {
    if (this.suscripcionVencida()) {
      return 'VENCIDA';
    }

    return this.actual()?.estado ?? '';
  }

  mensajeSuscripcion(): string {
    if (this.suscripcionVencida()) {
      return 'Tu suscripción venció. Renueva tu plan para recuperar tus beneficios.';
    }

    if (this.estaPorVencer()) {
      return 'Tu suscripción vence hoy. Puedes renovarla ahora.';
    }

    return 'Tu suscripción está activa.';
  }

  pagar(plan: { tipo: string; precio: number }): void {
    const usuarioId = this.auth.getUserId();

    if (usuarioId == null) {
      this.snack.open('No se encontró el usuario logueado.', 'Cerrar', {
        duration: 4000,
        panelClass: 'mu-snack-error',
      });
      return;
    }

    const fields: FieldConfig[] = [
      {
        key: 'monto',
        label: 'Monto (S/)',
        type: 'number',
        required: true,
        min: plan.precio,
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
      { key: 'numTarjeta', label: 'Número de tarjeta', type: 'text', required: true, pattern: '^[0-9]{16}$' },
      { key: 'titular', label: 'Nombre del titular', type: 'text', required: true, pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$' },
      { key: 'caducidad', label: 'Fecha (MM/AA)', type: 'text', required: true, hint: 'Ejemplo: 12/26', pattern: '^(0[1-9]|1[0-2])\\/([0-9]{2})$' },
      { key: 'cvc', label: 'CVC / CVV', type: 'text', required: true, pattern: '^[0-9]{3}$' },
      { key: 'telefono', label: 'Número de celular', type: 'text', required: true, pattern: '^9[0-9]{8}$' },
    ];

    const ref = this.dialog.open(EntityFormDialogComponent, {
      data: {
        title: `Pagar ${plan.tipo}`,
        fields,
        model: {
          monto: plan.precio,
          metodo: 'YAPE',
        },
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      const continuarPago = (suscripcionId: number) => {
        const body: PagoSuscripcionInsert = {
          suscripcionId,
          monto: Number(result['monto']),
          tipoPlan: plan.tipo,
          metodo: String(result['metodo']),
          referenciaTransaccion: String(result['referenciaTransaccion'] ?? ''),
        };

        this.pagosSuscripcion.create(body).subscribe({
          next: () => {
            this.snack.open('Suscripción pagada correctamente.', 'OK', {
              duration: 3000,
            });
            this.load();
          },
          error: () => {
            this.snack.open('No se pudo pagar la suscripción.', 'Cerrar', {
              duration: 4000,
              panelClass: 'mu-snack-error',
            });
          },
        });
      };

      const suscripcionActual = this.actual();

      if (suscripcionActual) {
        continuarPago(suscripcionActual.id);
        return;
      }

      this.suscripciones.create({
        usuario_id: usuarioId,
        tipo_plan: plan.tipo,
        precio: plan.precio,
        fecha_fin: null as any,
        estado: 'PENDIENTE',
      }).subscribe({
        next: (nuevaSuscripcion) => {
          continuarPago(nuevaSuscripcion.id);
        },
        error: () => {
          this.snack.open('No se pudo crear la suscripción.', 'Cerrar', {
            duration: 4000,
            panelClass: 'mu-snack-error',
          });
        },
      });
    });
  }
}