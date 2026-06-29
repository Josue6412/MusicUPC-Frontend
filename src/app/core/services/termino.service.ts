import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Termino, TerminoInsert } from '../models';

@Injectable({ providedIn: 'root' })
export class TerminoService extends CrudService<Termino, TerminoInsert> {
  protected readonly resource = 'terminos';
}
