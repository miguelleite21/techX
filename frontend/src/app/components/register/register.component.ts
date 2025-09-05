import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,RouterModule,MatSnackBarModule],
  template: `
    <div class="container">
      <h2>Registro</h2>
      <mat-form-field appearance="outline">
      <mat-label>Usuário</mat-label>
          <input matInput [(ngModel)]="username" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Senha</mat-label>
        <input matInput type="password" [(ngModel)]="password" />
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="register()" class="full-btn">Registrar</button>
      <p class="register">
        Já tem conta? 
        <a mat-button color="accent" routerLink="/login">Login</a>
      </p>
    </div>
  `,
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private api: ApiService, private router: Router, private snack: MatSnackBar) {}
  private showSnack(message: string, action: string = 'Fechar', duration: number = 3000) {
    this.snack.open(message, action, { duration });
  }
  register() {
    this.api.register(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/login']),
       error: (err) => {
      this.showSnack('❌ Erro no registro: ' + err.error.message);
    }
    });
  }
}
