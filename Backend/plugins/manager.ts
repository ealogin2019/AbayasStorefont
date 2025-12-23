/**
 * Plugin Manager
 * Manages plugin registration, initialization, and lifecycle
 */

import { Plugin, PluginInfo } from "@shared/plugins";

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private initialized = false;

  /**
   * Register a plugin
   */
  registerPlugin(plugin: Plugin) {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" already registered. Skipping...`);
      return;
    }

    this.plugins.set(plugin.name, plugin);
    console.log(`✅ Plugin registered: ${plugin.name} v${plugin.version}`);
  }

  /**
   * Register multiple plugins at once
   */
  registerPlugins(...plugins: Plugin[]) {
    plugins.forEach((plugin) => this.registerPlugin(plugin));
  }

  /**
   * Initialize all registered plugins
   */
  async initializeAll() {
    if (this.initialized) {
      console.warn("Plugin system already initialized");
      return;
    }

    console.log("🚀 Initializing plugin system...");

    for (const [name, plugin] of this.plugins) {
      try {
        if (plugin.initialize) {
          await plugin.initialize();
          console.log(`✅ Plugin initialized: ${name}`);
        }
      } catch (error) {
        console.error(`❌ Error initializing plugin "${name}":`, error);
      }
    }

    this.initialized = true;
    console.log("✅ All plugins initialized");
  }

  /**
   * Trigger a hook across all plugins
   */
  async triggerHook<T extends keyof Plugin>(hookName: T, data: any) {
    const results: any[] = [];

    for (const [name, plugin] of this.plugins) {
      const hook = (plugin as any)[hookName];
      if (hook && typeof hook === "function") {
        try {
          const result = await hook(data);
          results.push({ plugin: name, result });
        } catch (error) {
          console.error(`❌ Error in plugin "${name}" hook "${String(hookName)}":`, error);
        }
      }
    }

    return results;
  }

  /**
   * Get a specific plugin
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all plugins info
   */
  getPluginsInfo(): PluginInfo[] {
    return Array.from(this.plugins.values()).map((plugin) => ({
      name: plugin.name,
      displayName: plugin.displayName || plugin.name,
      version: plugin.version,
      enabled: true,
      type: plugin.type,
      description: plugin.description,
    }));
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Unregister a plugin (useful for testing)
   */
  unregisterPlugin(name: string): boolean {
    return this.plugins.delete(name);
  }

  /**
   * Clear all plugins
   */
  clearPlugins() {
    this.plugins.clear();
    this.initialized = false;
  }
}

// Singleton instance
export const pluginManager = new PluginManager();

// Import and register plugins
import { inventoryPlugin } from "./inventory-management.js";

pluginManager.registerPlugin(inventoryPlugin);
