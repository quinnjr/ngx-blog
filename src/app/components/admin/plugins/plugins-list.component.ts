import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PluginService } from '../../../services';

@Component({
  selector: 'app-plugins-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent],
  templateUrl: './plugins-list.component.html',
  styleUrl: './plugins-list.component.css'
})
export class PluginsListComponent {
  private pluginService = inject(PluginService);

  plugins = this.pluginService.installedPlugins;
  selectedPlugin = signal<any>(null);
  showSettings = signal(false);
  pluginSettings = signal<Record<string, any>>({});

  async togglePlugin(pluginId: string, enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        await this.pluginService.enablePlugin(pluginId);
      } else {
        await this.pluginService.disablePlugin(pluginId);
      }
    } catch (error) {
      console.error('Failed to toggle plugin:', error);
      alert('Failed to toggle plugin. Please try again.');
    }
  }

  openSettings(plugin: any): void {
    this.selectedPlugin.set(plugin);
    const config = this.pluginService.getPluginConfig(plugin.id);
    const currentSettings = this.pluginService.getPluginSettings(plugin.id);
    this.pluginSettings.set(currentSettings);
    this.showSettings.set(true);
  }

  closeSettings(): void {
    this.showSettings.set(false);
    this.selectedPlugin.set(null);
  }

  async saveSettings(): Promise<void> {
    const plugin = this.selectedPlugin();
    if (!plugin) return;

    try {
      await this.pluginService.updatePluginSettings(plugin.id, this.pluginSettings());
      this.closeSettings();
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  }

  updateSetting(key: string, value: any): void {
    this.pluginSettings.update(settings => ({
      ...settings,
      [key]: value
    }));
  }

  getPluginConfig(pluginId: string) {
    return this.pluginService.getPluginConfig(pluginId);
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      content: 'file-alt',
      marketing: 'bullhorn',
      analytics: 'chart-bar',
      social: 'share-alt',
      seo: 'search',
      utility: 'tools',
      other: 'puzzle-piece',
    };
    return icons[category] || 'puzzle-piece';
  }
}
