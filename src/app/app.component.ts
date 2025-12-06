import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';


import { ScrollToTopComponent } from "./components/scroll-to-top/scroll-to-top.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, RecaptchaModule, RecaptchaFormsModule, ScrollToTopComponent],
  template: `
    <app-header></app-header>
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
    <app-scroll-to-top></app-scroll-to-top>
    <app-footer></app-footer>
  `
})
export class AppComponent {
  title = 'EcoStore';
}