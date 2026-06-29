import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ArtistaService } from '../../../core/services/artista.service';
import { ReservaService } from '../../../core/services/reserva.service';
import { PagoService } from '../../../core/services/pago.service';
import { UsuarioService } from '../../../core/services/usuario.service';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  tone: 'gold' | 'red' | 'blue' | 'green';
}

@Component({
  selector: 'mu-dashboard',
  imports: [CurrencyPipe, MatIconModule, MatProgressBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly artistas = inject(ArtistaService);
  private readonly reservas = inject(ReservaService);
  private readonly pagos = inject(PagoService);
  private readonly usuarios = inject(UsuarioService);

  readonly loading = signal(true);
  readonly cards = signal<StatCard[]>([]);
  readonly montoTotal = signal(0);

  constructor() {
    this.load();
  }

  private load(): void {
    forkJoin({
      disponibles: this.artistas.disponibles(),
      todasArtistas: this.artistas.getAll(),
      reservas: this.reservas.getAll(),
      pagos: this.pagos.getAll(),
      usuarios: this.usuarios.getAll(),
    }).subscribe({
      next: ({ disponibles, todasArtistas, reservas, pagos, usuarios }) => {
        const total = pagos.reduce((acc, p) => acc + (p.monto ?? 0), 0);
        this.montoTotal.set(total);
        this.cards.set([
          {
            label: 'Artistas disponibles',
            value: `${disponibles.length} / ${todasArtistas.length}`,
            icon: 'music_note',
            tone: 'gold',
          },
          {
            label: 'Reservas',
            value: `${reservas.length}`,
            icon: 'event',
            tone: 'red',
          },
          {
            label: 'Pagos registrados',
            value: `${pagos.length}`,
            icon: 'payments',
            tone: 'green',
          },
          {
            label: 'Usuarios',
            value: `${usuarios.length}`,
            icon: 'group',
            tone: 'blue',
          },
        ]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
