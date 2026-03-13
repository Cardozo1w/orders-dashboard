import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.html',
})
export class LayoutComponent {

  menuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigate(route: string) {
    this.menuOpen = false;
    this.router.navigate([route]);
  }

}