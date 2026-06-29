import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropDialog } from './image-crop-dialog';

describe('ImageCropDialog', () => {
  let component: ImageCropDialog;
  let fixture: ComponentFixture<ImageCropDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCropDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCropDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
