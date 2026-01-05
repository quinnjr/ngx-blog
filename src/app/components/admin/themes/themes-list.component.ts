import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-themes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './themes-list.component.html',
  styleUrls: ['./themes-list.component.css']
})
export class ThemesListComponent {
  private themeService = inject(ThemeService);
  
  themes = this.themeService.getAvailableThemes();
  activeTheme = this.themeService.theme;

  activateTheme(themeId: string) {
    const theme = this.themeService.getThemeById(themeId);
    if (theme) {
      this.themeService.setTheme(theme);
    }
  }
}
