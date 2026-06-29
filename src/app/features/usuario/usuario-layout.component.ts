import { Component, inject, signal, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'mu-usuario-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './usuario-layout.component.html',
  styleUrl: './usuario-layout.component.scss',
})
export class UsuarioLayoutComponent implements OnDestroy{
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly usuarios = inject(UsuarioService);
  private readonly notificaciones = inject(NotificacionService);
  private readonly translate = inject(TranslateService);
  private readonly actualizarFotoListener = () => {
    this.cargarFotoPerfil();
  };

  readonly username = this.auth.username;
  readonly fotoPerfil = signal<string>('');
  readonly notificacionesNoLeidas = signal(0);

  constructor() {
    this.cargarFotoPerfil();
    this.cargarNotificacionesNoLeidas();
    window.addEventListener('notificacionesActualizadas', this.actualizarNotificacionesListener);
    window.addEventListener('fotoPerfilActualizada', this.actualizarFotoListener);
  }

  cargarFotoPerfil(): void {
    const id = this.auth.getUserId();

    if (id == null) {
      return;
    }

    this.usuarios.getById(id).subscribe({
      next: (usuario) => {
        this.fotoPerfil.set(usuario.fotoPerfil ?? '');
      },
      error: () => {
        this.fotoPerfil.set('');
      },
    });
  }

  cargarNotificacionesNoLeidas(): void {
    const id = this.auth.getUserId();

    if (id == null) {
      return;
    }

    this.notificaciones.porUsuario(id).subscribe({
      next: (rows) => {
        const cantidad = rows.filter((n) => !n.leido).length;
        this.notificacionesNoLeidas.set(cantidad);
      },
      error: () => {
        this.notificacionesNoLeidas.set(0);
      },
    });
  }

  usarImagenPorDefecto(event: Event): void {
    const img = event.target as HTMLImageElement;
    this.fotoPerfil.set('');
  }

  cambiarIdioma(lang: string): void {
    this.translate.use(lang);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    window.removeEventListener('fotoPerfilActualizada', this.actualizarFotoListener);
    window.removeEventListener('notificacionesActualizadas', this.actualizarNotificacionesListener);
  }

  private readonly actualizarNotificacionesListener = () => {
    this.cargarNotificacionesNoLeidas();
  };
}