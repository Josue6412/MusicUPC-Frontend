import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Suscripcion, SuscripcionInsert } from '../models';

@Injectable({ providedIn: 'root' })
export class SuscripcionService extends CrudService<Suscripcion, SuscripcionInsert> {
  protected readonly resource = 'suscripciones';
}
