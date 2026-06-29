import { Component, inject } from '@angular/core';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { GeneroService } from '../../../core/services/genero.service';

@Component({
  selector: 'mu-generos',
  imports: [CrudTableComponent],
  template: `<mu-crud-table [config]="config" />`,
})
export class GenerosComponent {
  private readonly service = inject(GeneroService);

  readonly config: CrudTableConfig<any, any> = {
    title: 'Géneros',
    icon: 'queue_music',
    service: this.service,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'nombre', header: 'Nombre' },
    ],
    fields: [{ key: 'nombre', label: 'Nombre', type: 'text', required: true }],
  };
}
