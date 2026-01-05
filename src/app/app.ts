import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { registerFontAwesomeIcons } from './config/font-awesome.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ngx-blog-cms');
  
  constructor() {
    // Register Font Awesome icons
    const library = inject(FaIconLibrary);
    registerFontAwesomeIcons(library);
  }
}
