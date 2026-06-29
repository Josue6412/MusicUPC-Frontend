import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmData {
  title: string;
  message: string;
  confirmText?: string;
}

@Component({
  selector: 'mu-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="mu-title">{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">
        <mat-icon>delete</mat-icon>
        {{ data.confirmText ?? 'Eliminar' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  private readonly ref = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<ConfirmData>(MAT_DIALOG_DATA);
}
