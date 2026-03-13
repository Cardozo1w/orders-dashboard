import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.html',
})
export class LayoutComponent {

  menuOpen = false;
  private auth = inject(AuthService);
  isAlmacenista() {
    return this.auth.isAlmacenista();
  }

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigate(route: string) {
    this.menuOpen = false;
    this.router.navigate([route]);
  }

}