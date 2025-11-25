import { Component } from '@angular/core';
import { HeaderComponent } from './core/layout/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/layout/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
})
export class App {
  
}
  
