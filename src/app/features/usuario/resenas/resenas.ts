import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';
import { ReseñaService } from '../../../core/services/reseña.service';
import { Reseña, ReseñaInsert } from '../../../core/models';
import { EntityFormDialogComponent } from '../../../shared/entity-form-dialog/entity-form-dialog.component';
import { FieldConfig } from '../../../shared/field-config';
import { ReservaService } from '../../../core/services/reserva.service';

@Component({
  selector: 'mu-resenas-usuario',
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './resenas.html',
  styleUrl: './resenas.scss',
})
export class ResenasComponent {
  private readonly auth = inject(AuthService);
  private readonly resenas = inject(ReseñaService);
  private readonly reservas = inject(ReservaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly items = signal<Reseña[]>([]);

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

    this.resenas.porUsuario(usuarioId).subscribe({
      next: (rows) => {
        this.items.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.snack.open('No se pudieron cargar tus reseñas.', 'Cerrar', {
          duration: 4000,
          panelClass: 'mu-snack-error',
        });
      },
    });
  }

  crear(): void {
  const usuarioId = this.auth.getUserId();

  if (usuarioId == null) {
    this.snack.open('No se encontró el usuario logueado.', 'Cerrar', {
      duration: 4000,
      panelClass: 'mu-snack-error',
    });
    return;
  }

  this.reservas.porUsuario(usuarioId).subscribe({
    next: (reservasUsuario) => {
      if (reservasUsuario.length === 0) {
        this.snack.open('No tienes reservas para reseñar.', 'Cerrar', {
          duration: 4000,
        });
        return;
      }

      const fields: FieldConfig[] = [
        {
          key: 'reservaId',
          label: 'Reserva',
          type: 'select',
          required: true,
          options: reservasUsuario.map((r) => ({
          value: r.reservaId,
          label: `Reserva #${r.reservaId} - S/ ${r.totalPrice}`,
        })),
        },
        {
          key: 'rating',
          label: 'Calificación',
          type: 'select',
          required: true,
          options: [
            { value: 1, label: '1 estrella' },
            { value: 2, label: '2 estrellas' },
            { value: 3, label: '3 estrellas' },
            { value: 4, label: '4 estrellas' },
            { value: 5, label: '5 estrellas' },
          ],
        },
        {
          key: 'comentario',
          label: 'Comentario',
          type: 'textarea',
          required: true,
          hint: 'Escribe tu experiencia con la reserva',
        },
      ];

      const ref = this.dialog.open(EntityFormDialogComponent, {
        data: {
          title: 'Nueva reseña',
          fields,
          model: {
            rating: 5,
          },
        },
      });

      ref.afterClosed().subscribe((result) => {
        if (!result) return;

        const body: ReseñaInsert = {
          usuarioId,
          reservaId: Number(result['reservaId']),
          rating: Number(result['rating']),
          comentario: String(result['comentario'] ?? ''),
        };

        this.resenas.create(body).subscribe({
          next: () => {
            this.snack.open('Reseña registrada correctamente.', 'OK', {
              duration: 3000,
            });
            this.load();
          },
          error: () => {
            this.snack.open('No se pudo registrar la reseña.', 'Cerrar', {
              duration: 4000,
              panelClass: 'mu-snack-error',
            });
          },
        });
      });
    },
    error: () => {
      this.snack.open('No se pudieron cargar tus reservas.', 'Cerrar', {
        duration: 4000,
        panelClass: 'mu-snack-error',
      });
    },
  });
}

getStars(rating: number | null | undefined): string[] {

  const value = Number(rating ?? 0);

  const icons: string[] = [];

  for (let i = 1; i <= 5; i++) {

    if (value >= i) {
      icons.push('star');
    }
    else if (value >= i - 0.5) {
      icons.push('star_half');
    }
    else {
      icons.push('star_border');
    }

  }

  return icons;
}
}