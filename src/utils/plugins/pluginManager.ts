import { Plugin, PluginMetadata } from '../types';

export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<string, Plugin> = new Map();
  private enabled: Set<string> = new Set();

  private constructor() {}

  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  registerPlugin(plugin: Plugin): void {
    if (this.validatePlugin(plugin)) {
      this.plugins.set(plugin.id, plugin);
    }
  }

  enablePlugin(id: string): void {
    if (this.plugins.has(id)) {
      this.enabled.add(id);
    }
  }

  disablePlugin(id: string): void {
    this.enabled.delete(id);
  }

  getEnabledPlugins(): Plugin[] {
    return Array.from(this.enabled)
      .map(id => this.plugins.get(id))
      .filter((p): p is Plugin => p !== undefined);
  }

  private validatePlugin(plugin: Plugin): boolean {
    const required: (keyof Plugin)[] = ['id', 'name', 'version', 'author', 'execute'];
    return required.every(key => key in plugin);
  }

  async executePlugins(context: any): Promise<void> {
    for (const plugin of this.getEnabledPlugins()) {
      try {
        await plugin.execute(context);
      } catch (error) {
        console.error(`Plugin ${plugin.id} failed:`, error);
      }
    }
  }
}