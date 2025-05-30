// Performance cache utilities
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class PerformanceCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 100;

  set<T>(key: string, data: T, ttl = 300000): void { // 5 minutes default TTL
    // Clean expired entries and maintain size limit
    this.cleanup();
    
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const performanceCache = new PerformanceCache();

// Image cache specifically for optimized loading
export const preloadAndCache = async (src: string): Promise<string> => {
  const cacheKey = `img_${src}`;
  
  if (performanceCache.has(cacheKey)) {
    return performanceCache.get(cacheKey);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      performanceCache.set(cacheKey, src, 1800000); // 30 minutes for images
      resolve(src);
    };
    img.onerror = reject;
    img.src = src;
  });
};