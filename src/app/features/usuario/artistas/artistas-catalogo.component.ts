import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArtistaService } from '../../../core/services/artista.service';
import { ReservaService } from '../../../core/services/reserva.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Artista, ReservaInsert } from '../../../core/models';
import { EntityFormDialogComponent } from '../../../shared/entity-form-dialog/entity-form-dialog.component';
import { FieldConfig } from '../../../shared/field-config';

@Component({
  selector: 'mu-artistas-catalogo',
  imports: [
    CurrencyPipe,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
  templateUrl: './artistas-catalogo.component.html',
  styleUrl: './artistas-catalogo.component.scss',
})
export class ArtistasCatalogoComponent {
  private readonly artistas = inject(ArtistaService);
  private readonly reservas = inject(ReservaService);
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly items = signal<Artista[]>([]);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.artistas.disponibles().subscribe({
      next: (rows) => {
        this.items.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.snack.open('No se pudieron cargar los artistas.', 'Cerrar', {
          duration: 4000,
          panelClass: 'mu-snack-error',
        });
        this.loading.set(false);
      },
    });
  }

  reservar(artista: Artista): void {
    const hoy = new Date().toISOString().split('T')[0];
    const fields: FieldConfig[] = [
      { key: 'fechaEvento', label: 'Fecha del evento', type: 'date', required: true, min: hoy },
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
      { key: 'precioTotal', label: 'Precio total (S/)', type: 'number', required: true, min: artista.precioBase },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ];

    const ref = this.dialog.open(EntityFormDialogComponent, {
      data: {
        title: `Reservar a ${artista.nombreArtistico}`,
        fields,
        model: {
          duracionHoras: 1,
          precioTotal: artista.precioBase,
          notas: `Artista solicitado: ${artista.nombreArtistico}`,
        },
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const body: ReservaInsert = {
        clienteId: this.auth.getUserId() ?? artista.precioBase,
        fechaEvento: result['fechaEvento'],
        horaEvento: result['horaEvento'],
        ubicacionEvento: result['ubicacionEvento'],
        tipoEvento: result['tipoEvento'],
        duracionHoras: result['duracionHoras'],
        precioTotal: result['precioTotal'],
        notas: result['notas'] ?? '',
      };
      this.reservas.create(body).subscribe({
        next: () => {
          this.snack.open(
            '¡Reserva creada! Ve a "Mis reservas" para pagarla.',
            'OK',
            { duration: 4000 },
          );
        },
        error: () =>
          this.snack.open('No se pudo crear la reserva.', 'Cerrar', {
            duration: 4000,
            panelClass: 'mu-snack-error',
          }),
      });
    });
  }
}
