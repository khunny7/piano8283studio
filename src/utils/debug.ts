// Debug utility for conditional logging and debug features
export class DebugUtils {
  // Check if debug mode is enabled via URL parameter
  static isDebugMode(): boolean {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === 'true';
  }

  // Conditional console logging - only logs in debug mode
  static log(message: string, ...args: any[]): void {
    if (this.isDebugMode()) {
      console.log(`🐛 [DEBUG] ${message}`, ...args);
    }
  }

  // Conditional console error - only logs in debug mode
  static error(message: string, ...args: any[]): void {
    if (this.isDebugMode()) {
      console.error(`🐛 [DEBUG ERROR] ${message}`, ...args);
    }
  }

  // Conditional console warn - only logs in debug mode
  static warn(message: string, ...args: any[]): void {
    if (this.isDebugMode()) {
      console.warn(`🐛 [DEBUG WARN] ${message}`, ...args);
    }
  }

  // Always log critical errors (production safe)
  static logError(message: string, error: any): void {
    console.error(`❌ ${message}`, error);
  }

  // Always log important info (production safe)
  static logInfo(message: string, ...args: any[]): void {
    console.log(`ℹ️ ${message}`, ...args);
  }
}