import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, UsuarioInsert } from '../../../core/models';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropDialog } from '../../../shared/image-crop-dialog/image-crop-dialog';

@Component({
  selector: 'mu-perfil',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly usuarios = inject(UsuarioService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploadingPhoto = signal(false);
  readonly arrastrando = signal(false);
  readonly notFound = signal(false);
  private current: Usuario | null = null;
  fotoSeleccionada: File | null = null;

  readonly form = this.fb.group({
  nombre: [
    '',
    [
      Validators.required,
      Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
    ],
  ],
  apellido: [
    '',
    [
      Validators.required,
      Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
    ],
  ],
  email: ['', [Validators.required, Validators.email]],
  telefono: [
    '',
    [
      Validators.required,
      Validators.pattern('^[0-9]{9}$'),
    ],
  ],
  dni: [
    '',
    [
      Validators.required,
      Validators.pattern('^[0-9]{8}$'),
    ],
  ],
  fechaNacimiento: [''],
  fotoPerfil: [''],
  contrasena: [''],
});

  constructor() {
    this.load();
  }

  private load(): void {
    const id = this.auth.getUserId();
    if (id == null) {
      this.loading.set(false);
      this.notFound.set(true);
      return;
    }
    this.usuarios.getById(id).subscribe({
      next: (u) => {
        this.current = u;
        this.form.patchValue({
          nombre: u.nombre,
          apellido: u.apellido,
          email: u.email,
          telefono: u.telefono,
          dni: u.dni,
          fechaNacimiento: u.fechaNacimiento,
          fotoPerfil: u.fotoPerfil ?? '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  private formatearFecha(value: unknown): string {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return String(value);
  }

  private async redimensionarImagen(file: File): Promise<File> {
    return new Promise((resolve) => {

      const img = new Image();

      img.onload = () => {

        const maxSize = 400;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = height * maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = width * maxSize / height;
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {

          if (!blob) {
            resolve(file);
            return;
          }

          resolve(
            new File(
              [blob],
              file.name,
              {
                type: 'image/jpeg',
                lastModified: Date.now()
              }
            )
          );

        }, 'image/jpeg', 0.9);

      };

      img.src = URL.createObjectURL(file);

    });
  }

  dragOver(event: DragEvent): void {
    event.preventDefault();
    this.arrastrando.set(true);
  }

  dragLeave(event: DragEvent): void {
    event.preventDefault();
    this.arrastrando.set(false);
  }

  dropFoto(event: DragEvent): void {

    event.preventDefault();

    this.arrastrando.set(false);

    if (!event.dataTransfer?.files.length) {
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';

    Object.defineProperty(input, 'files', {
      value: event.dataTransfer.files,
    });

    this.seleccionarFoto({
      target: input,
    } as unknown as Event);

  }

  async seleccionarFoto(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const tiposPermitidos = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ];

    if (!tiposPermitidos.includes(file.type)) {
      this.snack.open('Solo se permiten imágenes PNG, JPG, JPEG o WEBP.', 'Cerrar', {
        duration: 4000,
        panelClass: 'mu-snack-error',
      });
      input.value = '';
      return;
    }

    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      this.snack.open(`La imagen no puede superar los ${maxSizeMB} MB.`, 'Cerrar', {
        duration: 4000,
        panelClass: 'mu-snack-error',
      });
      input.value = '';
      return;
    }

    const ref = this.dialog.open(ImageCropDialog, {
      width: '620px',
      maxWidth: '95vw',
      data: { file },
    });

    ref.afterClosed().subscribe(async (croppedFile: File | null) => {
      if (!croppedFile) {
        input.value = '';
        return;
      }

      const imagenOptimizada = await this.redimensionarImagen(croppedFile);

      this.fotoSeleccionada = imagenOptimizada;

      const previewUrl = URL.createObjectURL(imagenOptimizada);

      this.form.patchValue({
        fotoPerfil: previewUrl,
      });
    });
  }

  save(): void {
    if (this.form.invalid || !this.current) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body: UsuarioInsert = {
      nombre: v.nombre!,
      apellido: v.apellido!,
      email: v.email!,
      telefono: v.telefono ?? '',
      dni: v.dni!,
      fechaNacimiento: v.fechaNacimiento ? this.formatearFecha(v.fechaNacimiento) : '',
      fotoPerfil: this.current.fotoPerfil ?? '',
      rol: this.current.rol,
      contrasena: v.contrasena ? v.contrasena : '',
    };
    this.saving.set(true);
    this.usuarios.update(this.current.id, body).subscribe({
      next: () => {
        if (this.fotoSeleccionada && this.current) {
          this.uploadingPhoto.set(true);

          this.usuarios.subirFotoPerfil(this.current.id, this.fotoSeleccionada).subscribe({
            next: (usuarioConFoto) => {
              console.log('Usuario con foto:', usuarioConFoto);
              console.log('Foto recibida:', usuarioConFoto.fotoPerfil);
              this.saving.set(false);
              this.fotoSeleccionada = null;
              this.uploadingPhoto.set(false);
              this.current = usuarioConFoto;

              this.form.patchValue({
                fotoPerfil: usuarioConFoto.fotoPerfil ?? '',
              });

              window.dispatchEvent(new Event('fotoPerfilActualizada'));

              this.snack.open('Perfil actualizado.', 'OK', { duration: 2500 });
              this.form.get('contrasena')?.reset('');
            },
            error: () => {
              this.saving.set(false);
              this.uploadingPhoto.set(false);
              this.snack.open('El perfil se guardó, pero no se pudo subir la foto.', 'Cerrar', {
                duration: 4000,
                panelClass: 'mu-snack-error',
              });
            },
          });

          return;
        }

        this.saving.set(false);
        this.snack.open('Perfil actualizado.', 'OK', { duration: 2500 });
        this.form.get('contrasena')?.reset('');
      },
      error: () => {
        this.saving.set(false);
        this.snack.open('No se pudo guardar el perfil.', 'Cerrar', {
          duration: 4000,
          panelClass: 'mu-snack-error',
        });
      },
    });
  }
}
