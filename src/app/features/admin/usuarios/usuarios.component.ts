import { Component, inject } from '@angular/core';
import { CrudTableComponent, CrudTableConfig } from '../../../shared/crud-table/crud-table.component';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models';

@Component({
  selector: 'mu-usuarios',
  imports: [CrudTableComponent],
  template: `<mu-crud-table [config]="config" />`,
})
export class UsuariosComponent {
  private readonly service = inject(UsuarioService);

  readonly config: CrudTableConfig<any, any> = {
    title: 'Usuarios',
    icon: 'group',
    service: this.service,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'fotoPerfil', header: 'Foto', kind: 'image' },
      { key: 'nombre', header: 'Nombre' },
      { key: 'apellido', header: 'Apellido' },
      { key: 'email', header: 'Email' },
      { key: 'telefono', header: 'Teléfono' },
      { key: 'dni', header: 'DNI' },
      { key: 'rol', header: 'Rol' },
      { key: 'fechaNacimiento', header: 'Nacimiento', kind: 'date' },
      { key: 'fechaRegistro', header: 'Registro', kind: 'date' },
    ],
    fields: [
      {
        key: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true,
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$',
        hint: 'Solo letras y espacios',
      },
      {
        key: 'apellido',
        label: 'Apellido',
        type: 'text',
        required: true,
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$',
        hint: 'Solo letras y espacios',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
      },
      {
        key: 'contrasena',
        label: 'Contraseña',
        type: 'password',
        required: true,
      },
      {
        key: 'telefono',
        label: 'Teléfono',
        type: 'text',
        required: true,
        pattern: '^[0-9]{9}$',
        hint: 'Debe tener exactamente 9 números',
      },
      {
        key: 'dni',
        label: 'DNI',
        type: 'text',
        required: true,
        pattern: '^[0-9]{8}$',
        hint: 'Debe tener exactamente 8 números',
      },
      {
        key: 'fotoPerfil',
        label: 'Foto de perfil URL',
        type: 'text',
        required: false,
        hint: 'Pega el enlace de una imagen',
      },
      {
        key: 'fotoArchivo',
        label: 'Subir foto de perfil',
        type: 'file',
        hint: 'PNG, JPG, JPEG o WEBP. Máximo 5 MB.',
      },
      {
        key: 'rol',
        label: 'Rol',
        type: 'select',
        required: true,
        options: [
          { value: 'ADMINISTRADOR', label: 'Administrador' },
          { value: 'USUARIO', label: 'Usuario' },
        ],
      },
      { key: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date', required: true },
    ],
    toForm: (row: Usuario) => ({
      nombre: row.nombre,
      apellido: row.apellido,
      email: row.email,
      contrasena: '',
      telefono: row.telefono,
      dni: row.dni,
      fotoPerfil: row.fotoPerfil,
      fotoArchivo: '',
      rol: row.rol,
      fechaNacimiento: row.fechaNacimiento,
    }),
  };
}
