import { Component, inject } from '@angular/core';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { RegionService } from '../../../core/services/region.service';

@Component({
  selector: 'mu-regiones',
  imports: [CrudTableComponent],
  template: `<mu-crud-table [config]="config" />`,
})
export class RegionesComponent {
  private readonly service = inject(RegionService);

  readonly config: CrudTableConfig<any, any> = {
    title: 'Regiones',
    icon: 'public',
    service: this.service,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'nombre', header: 'Nombre' },
      { key: 'departamento', header: 'Departamento' },
    ],
    fields: [
      {
        key: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true,
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$',
        hint: 'Solo se permiten letras',
      },
      {
        key: 'departamento',
        label: 'Departamento',
        type: 'text',
        required: true,
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$',
        hint: 'Solo se permiten letras',
      },
    ],
  };
}
