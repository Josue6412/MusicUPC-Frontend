import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'mu-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly hidePassword = signal(true);

  readonly form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMsg.set(null);

    const { username, password } = this.form.getRawValue();
    this.auth.login({ username: username!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.redirectByRole();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err?.status === 401 || err?.status === 403
            ? 'Usuario o contraseña incorrectos.'
            : 'No se pudo conectar con el servidor.',
        );
      },
    });
  }

  private redirectByRole(): void {
    const role = this.auth.getRole();
    if (role === 'ADMINISTRADOR') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'USUARIO') {
      this.router.navigate(['/usuario/reservas']);
    } else {
      this.errorMsg.set('El token no contiene un rol válido.');
      this.auth.logout();
    }
  }
}
