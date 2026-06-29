import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Dashboard } from '../models';
import { API_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly api = `${API_URL}/dashboard`;

  getResumen(periodo: string = 'todo'): Observable<Dashboard> {
    return this.http.get<Dashboard>(this.api, {
      params: { periodo },
    });
  }
}