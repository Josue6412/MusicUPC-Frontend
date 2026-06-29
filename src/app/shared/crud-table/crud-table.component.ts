import { AfterViewInit, Component, Input, OnInit, ViewChild, inject, } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../core/services/usuario.service';
import { CrudService } from '../../core/services/crud.service';
import { FieldConfig } from '../field-config';
import { EntityFormDialogComponent } from '../entity-form-dialog/entity-form-dialog.component';
import { ConfirmDialogComponent, ConfirmData, } from '../confirm-dialog/confirm-dialog.component';

export type ColumnKind =
  | 'text'
  | 'boolean'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'list'
  | 'image'
  | 'stars';

export interface ColumnDef {
  key: string;
  header: string;
  kind?: ColumnKind;
}

export interface CrudTableConfig<T extends { id: number }, I> {
  title: string;
  icon: string;
  service: CrudService<T, I>;
  columns: ColumnDef[];
  fields: FieldConfig[];
  toForm?: (row: T) => Record<string, unknown>;
}

type Row = { id: number } & Record<string, unknown>;

@Component({
  selector: 'mu-crud-table',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.scss',
})
export class CrudTableComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) config!: CrudTableConfig<Row, unknown>;

  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly usuarioService = inject(UsuarioService);

  readonly dataSource = new MatTableDataSource<Row>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get displayedColumns(): string[] {
    return [...this.config.columns.map((c) => c.key), 'acciones'];
  }

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  load(): void {
    this.loading = true;
    this.config.service.getAll().subscribe({
      next: (rows) => {
        this.dataSource.data = rows as Row[];
        this.loading = false;
      },
      error: () => {
        this.error('No se pudieron cargar los datos.');
        this.loading = false;
      },
    });
  }

  create(): void {
    const ref = this.dialog.open(EntityFormDialogComponent, {
      data: { title: `Nuevo · ${this.config.title}`, fields: this.config.fields },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const archivo = result['fotoArchivo'];
      delete result['fotoArchivo'];

      this.config.service.create(result).subscribe({
        next: (created: any) => {
          if (this.config.title === 'Usuarios' && created?.id) {
            this.subirFotoSiExiste(created.id, { fotoArchivo: archivo }, 'Registro creado.');
            return;
          }

          this.ok('Registro creado.');
          this.load();
        },
        error: () => this.error('No se pudo crear el registro.'),
      });
    });
  }

  edit(row: Row): void {
    const model = this.config.toForm ? this.config.toForm(row) : row;
    const ref = this.dialog.open(EntityFormDialogComponent, {
      data: { title: `Editar · ${this.config.title}`, fields: this.config.fields, model },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const archivo = result['fotoArchivo'];
      delete result['fotoArchivo'];

      this.config.service.update(row.id, result).subscribe({
        next: () => {
          if (this.config.title === 'Usuarios') {
            this.subirFotoSiExiste(row.id, { fotoArchivo: archivo }, 'Cambios guardados.');
            return;
          }

          this.ok('Cambios guardados.');
          this.load();
        },
        error: () => this.error('No se pudo actualizar el registro.'),
      });
    });
  }

  private subirFotoSiExiste(usuarioId: number, result: Record<string, unknown>, mensaje: string): void {
    const archivo = result['fotoArchivo'];

    if (!(archivo instanceof File)) {
      this.ok(mensaje);
      this.load();
      return;
    }

    this.usuarioService.subirFotoPerfil(usuarioId, archivo).subscribe({
      next: () => {
        this.ok(mensaje);
        this.load();
      },
      error: () => {
        this.error('El usuario se guardó, pero no se pudo subir la foto.');
        this.load();
      },
    });
  }

  remove(row: Row): void {
    const data: ConfirmData = {
      title: 'Eliminar registro',
      message: `¿Seguro que deseas eliminar el registro #${row.id}? Esta acción no se puede deshacer.`,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { data });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.config.service.delete(row.id).subscribe({
        next: () => {
          this.ok('Registro eliminado.');
          this.load();
        },
        error: () => this.error('No se pudo eliminar el registro.'),
      });
    });
  }

  getStars(value: unknown): string[] {
    const rating = Number(value ?? 0);
    const safeRating = Math.max(0, Math.min(5, rating));

    const icons: string[] = [];

    for (let i = 1; i <= 5; i++) {
      if (safeRating >= i) {
        icons.push('star');
      } else if (safeRating >= i - 0.5) {
        icons.push('star_half');
      } else {
        icons.push('star_border');
      }
    }

    return icons;
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  private ok(msg: string): void {
    this.snack.open(msg, 'OK', { duration: 2500 });
  }

  private error(msg: string): void {
    this.snack.open(msg, 'Cerrar', {
      duration: 4000,
      panelClass: 'mu-snack-error',
    });
  }
}
