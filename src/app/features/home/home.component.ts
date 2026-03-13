import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
})
export class HomeComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  isAlmacenista() {
    return this.auth.isAlmacenista();
  }

  isTecnico() {
    return this.auth.isTecnico();
  }

  navigate(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
