import { Component, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { SelectOption } from '../../../shared/field-config';
import { ArtistaService } from '../../../core/services/artista.service';
import { GeneroService } from '../../../core/services/genero.service';
import { RegionService } from '../../../core/services/region.service';
import { Artista, Genero, Region } from '../../../core/models';

@Component({
  selector: 'mu-artistas',
  imports: [CrudTableComponent],
  template: `
    @if (config(); as cfg) {
      <mu-crud-table [config]="cfg" />
    }
  `,
})
export class ArtistasComponent {
  private readonly service = inject(ArtistaService);
  private readonly generoSrv = inject(GeneroService);
  private readonly regionSrv = inject(RegionService);

  readonly config = signal<CrudTableConfig<any, any> | null>(null);

  private generos: Genero[] = [];
  private regiones: Region[] = [];

  constructor() {
    forkJoin({
      generos: this.generoSrv.getAll(),
      regiones: this.regionSrv.getAll(),
    }).subscribe({
      next: ({ generos, regiones }) => {
        this.generos = generos;
        this.regiones = regiones;
        this.config.set(this.build(generos, regiones));
      },
      // Si fallan las referencias, igual mostramos la tabla con selects vacíos.
      error: () => this.config.set(this.build([], [])),
    });
  }

  private build(generos: Genero[], regiones: Region[]): CrudTableConfig<any, any> {
    const generoOpts: SelectOption[] = generos.map((g) => ({ value: g.id, label: g.nombre }));
    const regionOpts: SelectOption[] = regiones.map((r) => ({ value: r.id, label: r.nombre }));

    return {
      title: 'Artistas',
      icon: 'music_note',
      service: this.service,
      columns: [
        { key: 'id', header: 'ID' },
        { key: 'nombreArtistico', header: 'Nombre artístico' },
        { key: 'region', header: 'Región' },
        { key: 'generos', header: 'Géneros', kind: 'list' },
        { key: 'disponible', header: 'Disponible', kind: 'boolean' },
        { key: 'precioBase', header: 'Precio base', kind: 'currency' },
        { key: 'aniosExperiencia', header: 'Años exp.' },
      ],
      fields: [
        { key: 'nombreArtistico', label: 'Nombre artístico', type: 'text', required: true },
        { key: 'bio', label: 'Biografía', type: 'textarea' },
        { key: 'generosIds', label: 'Géneros', type: 'multiselect', options: generoOpts },
        { key: 'regionId', label: 'Región', type: 'select', required: true, options: regionOpts },
        { key: 'disponible', label: 'Disponible para reservas', type: 'checkbox' },
        { key: 'precioBase', label: 'Precio base', type: 'number', required: true, min: 0 },
        { key: 'fechaInicioCarrera', label: 'Inicio de carrera', type: 'date', required: true },
      ],
      toForm: (a: Artista) => ({
        nombreArtistico: a.nombreArtistico,
        bio: a.bio,
        generosIds: this.generos
          .filter((g) => a.generos?.includes(g.nombre))
          .map((g) => g.id),
        regionId: this.regiones.find((r) => r.nombre === a.region)?.id ?? '',
        disponible: a.disponible,
        precioBase: a.precioBase,
        fechaInicioCarrera: '',
      }),
    };
  }
}
