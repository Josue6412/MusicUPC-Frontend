import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Pago, PagoInsert } from '../models';

@Injectable({ providedIn: 'root' })
export class PagoService extends CrudService<Pago, PagoInsert> {
  protected readonly resource = 'pagos';
}
