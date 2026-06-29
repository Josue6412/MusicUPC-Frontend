import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DashboardService } from '../../../core/services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ArcElement, Tooltip, Legend, PieController, ChartConfiguration, BarController, BarElement, CategoryScale, LinearScale, } from 'chart.js';
import { DashboardReserva } from '../../../core/models';
import { DatePipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

Chart.register(
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale
);

interface StatCard {
  label: string;
  value: string;
  icon: string;
  tone: 'gold' | 'red' | 'blue' | 'green';
}

@Component({
  selector: 'mu-dashboard',
  imports: [
    DecimalPipe,
    MatIconModule,
    MatProgressBarModule,
    BaseChartDirective,
    DatePipe,
    MatButtonToggleModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly dashboard = inject(DashboardService);

  readonly loading = signal(true);
  readonly cards = signal<StatCard[]>([]);

  readonly ingresosReservas = signal(0);
  readonly ingresosSuscripciones = signal(0);
  readonly ingresosTotales = signal(0);
  readonly ultimasReservas = signal<DashboardReserva[]>([]);
  readonly pieChartType: 'pie' = 'pie';

  readonly pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Reservas pagadas', 'Reservas pendientes'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#57c98a', '#e05a4d'],
        borderColor: ['#11111a', '#11111a'],
        borderWidth: 2,
      },
    ],
  };

  readonly pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ddd',
          boxWidth: 14,
          boxHeight: 14,
        }
      }
    }
  };

  readonly barChartType: 'bar' = 'bar';

  readonly barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Reservas', 'Suscripciones'],
    datasets: [
      {
        label: 'Ingresos',
        data: [0, 0],
        backgroundColor: ['#e8a045', '#57c98a'],
        borderColor: ['#c9863a', '#2e9e63'],
        borderWidth: 1,
      },
    ],
  };

  readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ddd',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ddd',
        },
        grid: {
          color: 'rgba(255,255,255,.08)',
        },
      },
      y: {
        ticks: {
          color: '#ddd',
        },
        grid: {
          color: 'rgba(255,255,255,.08)',
        },
      },
    },
  };

  readonly periodo = signal<'hoy' | 'mes' | 'anio' | 'todo'>('todo');

  cambiarPeriodo(valor: 'hoy' | 'mes' | 'anio' | 'todo'): void {
    this.periodo.set(valor);
    this.load();
  }

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);

    this.dashboard.getResumen(this.periodo()).subscribe({
      next: (resumen) => {
        this.ingresosReservas.set(resumen.ingresosReservas);
        this.ingresosSuscripciones.set(resumen.ingresosSuscripciones);
        this.ingresosTotales.set(resumen.ingresosTotales);
        this.ultimasReservas.set(resumen.ultimasReservas ?? []);

        this.cards.set([
          {
            label: 'Usuarios registrados',
            value: resumen.totalUsuarios.toString(),
            icon: 'group',
            tone: 'blue',
          },
          {
            label: 'Artistas registrados',
            value: resumen.totalArtistas.toString(),
            icon: 'music_note',
            tone: 'gold',
          },
          {
            label: 'Reservas pagadas',
            value: `${resumen.reservasPagadas} / ${resumen.reservasTotales}`,
            icon: 'event_available',
            tone: 'green',
          },
          {
            label: 'Reservas pendientes',
            value: resumen.reservasPendientes.toString(),
            icon: 'pending_actions',
            tone: 'red',
          },
          {
            label: 'Pagos de reservas',
            value: resumen.pagosReservas.toString(),
            icon: 'payments',
            tone: 'green',
          },
          {
            label: 'Pagos de suscripciones',
            value: resumen.pagosSuscripciones.toString(),
            icon: 'card_membership',
            tone: 'gold',
          },
          {
            label: 'Suscripciones pagadas',
            value: resumen.suscripcionesPagadas.toString(),
            icon: 'verified',
            tone: 'green',
          },
          {
            label: 'Suscripciones pendientes',
            value: resumen.suscripcionesPendientes.toString(),
            icon: 'warning',
            tone: 'red',
          },
        ]);
        this.pieChartData.datasets[0].data = [
          resumen.reservasPagadas,
          resumen.reservasPendientes
        ];
        this.barChartData.datasets[0].data = [
          resumen.ingresosReservas,
          resumen.ingresosSuscripciones,
        ];

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}