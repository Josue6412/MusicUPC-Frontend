import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/auth/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'mu-admin-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TranslatePipe
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly usuarios = inject(UsuarioService);
  private readonly translate = inject(TranslateService);

  readonly collapsed = signal(false);
  readonly username = this.auth.username;
  readonly fotoPerfil = signal<string>('');

  readonly nav: NavItem[] = [
    { label: 'ADMIN.DASHBOARD', icon: 'dashboard', path: 'dashboard' },
    { label: 'ADMIN.USUARIOS', icon: 'group', path: 'usuarios' },
    { label: 'ADMIN.ARTISTAS', icon: 'music_note', path: 'artistas' },
    { label: 'ADMIN.GENEROS', icon: 'queue_music', path: 'generos' },
    { label: 'ADMIN.REGIONES', icon: 'public', path: 'regiones' },
    { label: 'ADMIN.RESERVAS', icon: 'event', path: 'reservas' },
    { label: 'ADMIN.PAGOS', icon: 'payments', path: 'pagos' },
    { label: 'ADMIN.RESENAS', icon: 'reviews', path: 'reseñas' },
    { label: 'ADMIN.NOTIFICACIONES', icon: 'notifications', path: 'notificaciones' },
    { label: 'ADMIN.SUSCRIPCIONES', icon: 'card_membership', path: 'suscripciones' },
    { label: 'ADMIN.TERMINOS', icon: 'gavel', path: 'terminos' },
  ];

  constructor() {
    this.cargarFotoPerfil();
  }

  private cargarFotoPerfil(): void {
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

  usarImagenPorDefecto(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default-user.png';
  }

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }

  cambiarIdioma(lang: string): void {
    this.translate.use(lang);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
