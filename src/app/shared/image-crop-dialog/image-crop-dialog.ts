import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  ImageCropperComponent,
  ImageCroppedEvent,
} from 'ngx-image-cropper';

@Component({
  selector: 'mu-image-crop-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ImageCropperComponent
  ],
  templateUrl: './image-crop-dialog.html',
  styleUrl: './image-crop-dialog.scss',
})
export class ImageCropDialog {

  private readonly ref = inject(MatDialogRef<ImageCropDialog>);
  readonly data = inject<{ file: File }>(MAT_DIALOG_DATA);

  imageChangedEvent: Event | null = null;
  croppedBlob: Blob | null = null;

  constructor() {
    this.fileToEvent(this.data.file);
  }

  private fileToEvent(file: File): void {

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const input = document.createElement('input');
    input.type = 'file';
    input.files = dataTransfer.files;

    this.imageChangedEvent = {
      target: input,
    } as unknown as Event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedBlob = event.blob ?? null;
  }

  cancel(): void {
    this.ref.close(null);
  }

  aceptar(): void {

    if (!this.croppedBlob) {
      this.ref.close(null);
      return;
    }

    const file = new File(
      [this.croppedBlob],
      'foto-perfil.jpg',
      {
        type: 'image/jpeg',
        lastModified: Date.now(),
      }
    );

    this.ref.close(file);
  }

}