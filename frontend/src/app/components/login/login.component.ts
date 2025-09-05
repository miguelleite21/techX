import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,RouterModule,MatSnackBarModule ],
  template: `
    <div class="container">
      <h2>Login</h2>
      <mat-form-field appearance="outline">
        <mat-label>Usuário</mat-label>
          <input matInput [(ngModel)]="username" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Senha</mat-label>
        <input matInput type="password" [(ngModel)]="password" />
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="login()" class="full-btn" [disabled]="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
      <p class="register">
        Não tem conta?
        <a mat-button color="accent" routerLink="/register">Registre-se</a>
      </p>
    </div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private api: ApiService, private router: Router, private snack: MatSnackBar) {}

loading = false;
private showSnack(message: string, action: string = 'Fechar', duration: number = 3000) {
  this.snack.open(message, action, { duration });
}

login() {
  this.loading = true;
  this.api.login(this.username, this.password).subscribe({
    next: (res) => {
      this.api.saveToken(res.accessToken);
      this.router.navigate(['/board']);
      this.showSnack('✅ Login realizado com sucesso!', 'Fechar', 2000);
    },
    error: (err) => {
      this.showSnack('❌ Erro no login: ' + err.error.message);
      this.loading = false;
    },
    complete: () => this.loading = false
  });
}

}