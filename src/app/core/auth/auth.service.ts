import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../api.config';
import { LoginRequest, LoginResponse, UsuarioInsert } from '../models';

const TOKEN_KEY = 'musicupc_token';

interface JwtPayload {
  [claim: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** Señal con el token actual (sincronizada con localStorage). */
  private readonly token = signal<string | null>(this.readToken());

  /** Rol del usuario logueado (derivado del JWT). */
  readonly role = computed<string | null>(() => this.decodeRole(this.token()));

  /** Nombre/usuario mostrado en la topbar (claim `sub` o `username`). */
  readonly username = computed<string | null>(() => {
    const p = this.decode(this.token());
    if (!p) return null;
    return (
      (p['username'] as string) ??
      (p['nombre'] as string) ??
      (p['sub'] as string) ??
      null
    );
  });

  /** ID del usuario logueado (claim `id`/`userId`/`sub` numérico). */
  readonly userId = computed<number | null>(() => {
    const p = this.decode(this.token());
    if (!p) return null;
    const raw = p['id'] ?? p['userId'] ?? p['usuarioId'] ?? p['sub'];
    const n = Number(raw);
    return Number.isFinite(n) && raw != null && raw !== '' ? n : null;
  });

  readonly loggedIn = computed(() => this.token() !== null);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/login`, credentials)
      .pipe(tap((res) => this.setToken(res.token)));
  }

  /** Registro público. La cuenta se crea como USUARIO y queda logueada. */
  register(data: UsuarioInsert): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/registro`, data)
      .pipe(tap((res) => this.setToken(res.token)));
  }

  /** Recuperación de contraseña validando email + DNI (sin correo). */
  recuperar(body: {
    email: string;
    dni: string;
    nuevaContrasena: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${API_URL}/recuperar`, body);
  }

  // --- API pública solicitada ---

  getToken(): string | null {
    return this.token();
  }

  getRole(): string | null {
    return this.role();
  }

  getUserId(): number | null {
    return this.userId();
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }

  // --- Helpers internos ---

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  private readToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /** Decodifica el payload del JWT con `atob` (sin librerías externas). */
  private decode(token: string | null): JwtPayload | null {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
      );
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  /** Extrae el rol del payload, tolerando varias convenciones de claim. */
  private decodeRole(token: string | null): string | null {
    const p = this.decode(token);
    if (!p) return null;
    let raw: unknown =
      p['rol'] ?? p['role'] ?? p['roles'] ?? p['authorities'] ?? null;
    if (Array.isArray(raw)) raw = raw[0];
    if (raw && typeof raw === 'object' && 'authority' in raw) {
      raw = (raw as { authority: unknown })['authority'];
    }
    if (typeof raw !== 'string') return null;
    return raw.replace(/^ROLE_/, '').toUpperCase();
  }
}
