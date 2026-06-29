import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { EntityFormData, FieldConfig } from '../field-config';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropDialog } from '../image-crop-dialog/image-crop-dialog';

@Component({
  selector: 'mu-entity-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './entity-form-dialog.component.html',
  styleUrl: './entity-form-dialog.component.scss',
})
export class EntityFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<EntityFormDialogComponent>);
  private readonly dialog = inject(MatDialog);
  readonly data = inject<EntityFormData>(MAT_DIALOG_DATA);

  metodoSeleccionado: string = (this.data.model?.['metodo'] as string) || 'YAPE';
  previewFiles: Record<string, string> = {};
  selectedFiles: Record<string, File> = {};

  readonly form = this.buildForm();

  ngOnInit(): void {
    this.aplicarVisibilidadYValidadores();

    this.form.get('metodo')?.valueChanges.subscribe((val) => {
      this.metodoSeleccionado = val as string;
      this.aplicarVisibilidadYValidadores();
    });
  }

  private buildForm() {
    const group: Record<string, unknown[]> = {};

    for (const f of this.data.fields) {
      const fallback =
        f.type === 'checkbox' ? false : f.type === 'multiselect' ? [] : '';

      const initial = this.data.model?.[f.key] ?? fallback;

      group[f.key] = [initial, this.crearValidadores(f)];
    }

    const form = this.fb.group(group);

    const fechaCtrl = form.get('fechaEvento');
    const horaCtrl = form.get('horaEvento');

    if (fechaCtrl && horaCtrl) {
      form.valueChanges.subscribe(() => {
        const fecha = fechaCtrl.value;
        const hora = horaCtrl.value;

        if (fecha && hora) {
          const selected = new Date(`${fecha}T${hora}`);
          const min = new Date();
          min.setHours(min.getHours() + 1);

          if (selected < min) {
            horaCtrl.setErrors({ ...horaCtrl.errors, minTime: true });
          } else if (horaCtrl.hasError('minTime')) {
            const errors = { ...horaCtrl.errors };
            delete errors['minTime'];
            horaCtrl.setErrors(Object.keys(errors).length ? errors : null);
          }
        }
      });
    }

    return form;
  }

  private crearValidadores(f: FieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (f.required) {
      validators.push(Validators.required);
    }

    if (f.pattern) {
      validators.push(Validators.pattern(f.pattern));
    }

    if (f.type === 'email') {
      validators.push(Validators.email);
    }

    if (f.min !== undefined && f.min !== null) {
      if (f.type === 'date') {
        validators.push((control: AbstractControl) => {
          if (!control.value) return null;
          return control.value < f.min! ? { min: true } : null;
        });
      } else {
        validators.push(Validators.min(Number(f.min)));
      }
    }

    if (f.key === 'caducidad') {
      validators.push(this.fechaCaducidadValidator);
    }

    return validators;
  }

  private aplicarVisibilidadYValidadores(): void {
    for (const f of this.data.fields) {
      const control = this.form.get(f.key);

      if (!control) continue;

      if (!this.esCampoVisible(f)) {
        control.setValue('', { emitEvent: false });
        control.clearValidators();
        control.updateValueAndValidity({ emitEvent: false });
        continue;
      }

      control.setValidators(this.crearValidadores(f));
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  esCampoVisible(f: FieldConfig): boolean {
  const existeCampoMetodo = this.data.fields.some(campo => campo.key === 'metodo');

  if (!existeCampoMetodo) {
    return true;
  }

  const camposGenerales = ['monto', 'metodo', 'referenciaTransaccion', 'reservaId'];

  if (camposGenerales.includes(f.key)) {
    return true;
  }

  if (this.metodoSeleccionado === 'TARJETA') {
    return ['numTarjeta', 'titular', 'caducidad', 'cvc'].includes(f.key);
  }

  if (this.metodoSeleccionado === 'YAPE' || this.metodoSeleccionado === 'PLIN') {
    return ['telefono'].includes(f.key);
  }

  return true;
}

  isInvalid(f: FieldConfig): boolean {
    const c = this.form.get(f.key);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  getErrorMessage(f: FieldConfig): string {
    const c = this.form.get(f.key);

    if (c?.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (c?.hasError('min')) {
      return 'El monto no puede ser menor al total de la reserva';
    }

    if (c?.hasError('email')) {
      return 'Correo inválido';
    }

    if (c?.hasError('expiredDate')) {
      return 'La tarjeta está vencida';
    }

    if (c?.hasError('invalidDate')) {
      return 'Fecha inválida';
    }

    if (c?.hasError('pattern')) {
      if (f.key === 'nombre') return 'El nombre solo puede contener letras';
      if (f.key === 'apellido') return 'El apellido solo puede contener letras';
      if (f.key === 'telefono') return 'El teléfono debe tener 9 números';
      if (f.key === 'dni') return 'El DNI debe tener 8 números';
      if (f.key === 'numTarjeta') return 'Debe tener exactamente 16 números';
      if (f.key === 'cvc') return 'Debe tener exactamente 3 números';
      if (f.key === 'caducidad') return 'Formato requerido: MM/AA';
      if (f.key === 'titular') return 'Solo se permiten letras y espacios';
      if (f.key === 'telefono') return 'Debe tener 9 dígitos y empezar con 9';
      if (f.key === 'departamento') return 'El departamento solo puede contener letras';
      return 'Formato inválido';
    }
    if (c?.hasError('invalidFileType')) {
      return 'Solo se permiten imágenes PNG, JPG, JPEG o WEBP';
    }

    if (c?.hasError('maxFileSize')) {
      return 'La imagen no puede superar los 5 MB';
    }
    return 'Revisa este campo';
  }

  fechaCaducidadValidator(control: AbstractControl) {
    const value = control.value;

    if (!value) return null;

    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
      return { invalidDate: true };
    }

    const [month, year] = value.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expiredDate: true };
    }

    return null;
  }

  seleccionarArchivo(event: Event, f: FieldConfig): void {
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
      this.form.get(f.key)?.setErrors({ invalidFileType: true });
      input.value = '';
      return;
    }

    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      this.form.get(f.key)?.setErrors({ maxFileSize: true });
      input.value = '';
      return;
    }

    const ref = this.dialog.open(ImageCropDialog, {
      width: '620px',
      maxWidth: '95vw',
      data: { file },
    });

    ref.afterClosed().subscribe((croppedFile: File | null) => {
      if (!croppedFile) {
        input.value = '';
        return;
      }

      this.selectedFiles[f.key] = croppedFile;
      this.previewFiles[f.key] = URL.createObjectURL(croppedFile);

      this.form.get(f.key)?.setValue(croppedFile.name);
      this.form.get(f.key)?.setErrors(null);
    });
  }

  cancel(): void {
    this.ref.close();
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

  save(): void {
    this.form.markAllAsTouched();

    this.aplicarVisibilidadYValidadores();

    if (this.form.invalid) {
      return;
    }

    const raw = this.form.getRawValue() as Record<string, unknown>;

    for (const key of Object.keys(this.selectedFiles)) {
      raw[key] = this.selectedFiles[key];
    }

    for (const f of this.data.fields) {
      if (f.type === 'number' && raw[f.key] !== '' && raw[f.key] != null) {
        raw[f.key] = Number(raw[f.key]);
      }

      if (f.type === 'date' && raw[f.key]) {
        raw[f.key] = this.formatearFecha(raw[f.key]);
      }
    }

    this.ref.close(raw);
  }
}