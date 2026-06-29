import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/auth/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Notificacion } from '../../../core/models';

@Component({
  selector: 'mu-notificaciones-usuario',
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.scss',
})
export class NotificacionesComponent {
  private readonly auth = inject(AuthService);
  private readonly notificaciones = inject(NotificacionService);
  private readonly snack = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly items = signal<Notificacion[]>([]);

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

    this.notificaciones.porUsuario(usuarioId).subscribe({
      next: (rows) => {
        this.items.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.snack.open('No se pudieron cargar tus notificaciones.', 'Cerrar', {
          duration: 4000,
          panelClass: 'mu-snack-error',
        });
      },
    });
  }

  marcarComoLeida(id: number): void {
    this.notificaciones.marcarComoLeida(id).subscribe({
      next: () => {
        this.snack.open('Notificación marcada como leída.', 'OK', {
          duration: 3000,
        });
        this.load();
        window.dispatchEvent(new Event('notificacionesActualizadas'));
      },
      error: () => {
        this.snack.open('No se pudo marcar como leída.', 'Cerrar', {
          duration: 4000,
          panelClass: 'mu-snack-error',
        });
      },
    });
  }
}