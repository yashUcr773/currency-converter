// Performance monitoring utilities for production
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  timestamp: string;
  userAgent: string;
  connectionType?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    
    if (this.isEnabled) {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      this.recordLoadTime();
    });

    // Monitor navigation timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.recordNavigationTiming(entry as PerformanceNavigationTiming);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch {
        console.warn('Performance Observer not supported');
      }
    }

    // Monitor memory usage (Chrome only)
    if ('memory' in performance) {
      setInterval(() => {
        this.recordMemoryUsage();
      }, 60000); // Every minute
    }
  }

  private recordLoadTime() {
    if (!('performance' in window)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    const renderTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;

    const metrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    };

    this.addMetric(metrics);
  }

  private recordNavigationTiming(navigation: PerformanceNavigationTiming) {
    const metrics: PerformanceMetrics = {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      renderTime: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    };

    this.addMetric(metrics);
  }

  private recordMemoryUsage() {
    if (!('memory' in performance)) return;

    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    if (!memory) return;
    
    const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB

    const metrics: PerformanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    };

    this.addMetric(metrics);
  }

  private getConnectionType(): string | undefined {
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & { 
        connection?: { effectiveType?: string; type?: string } 
      }).connection;
      return connection?.effectiveType || connection?.type;
    }
    return undefined;
  }

  private addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Send to analytics if enabled
    this.sendToAnalytics(metric);
  }

  private async sendToAnalytics(metric: PerformanceMetrics) {
    try {
      // Replace with your analytics service
      console.log('Performance Metric:', metric);
      
      // Example: Google Analytics 4
      if (window.gtag && import.meta.env.VITE_GOOGLE_ANALYTICS_ID) {
        window.gtag('event', 'performance_metric', {
          custom_parameter_1: metric.loadTime,
          custom_parameter_2: metric.renderTime,
          custom_parameter_3: metric.memoryUsage || 0
        });
      }
    } catch (error) {
      console.warn('Failed to send performance metrics:', error);
    }
  }

  // Public methods
  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public recordCustomMetric(name: string, value: number) {
    if (!this.isEnabled) return;

    const metric: PerformanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    };

    // Add custom property
    (metric as PerformanceMetrics & Record<string, unknown>)[name] = value;
    this.addMetric(metric);
  }

  public measureFunction<T>(name: string, fn: () => T): T {
    if (!this.isEnabled) return fn();

    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.recordCustomMetric(`${name}_duration`, duration);
    return result;
  }

  public async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return fn();

    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    this.recordCustomMetric(`${name}_duration`, duration);
    return result;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default performanceMonitor;
