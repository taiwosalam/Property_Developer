# Enhanced useFetch Hook with Singleton Cache

## Key Improvements

1. **Singleton Pattern**: Cache is now accessible globally throughout the app
2. **TTL Support**: Automatic cache expiration with customizable timeouts
3. **Pattern Matching**: Delete cache entries by URL patterns or prefixes
4. **Backward Compatibility**: All existing useFetch calls continue to work unchanged

## Basic Usage (Unchanged)

```typescript
// Existing usage continues to work exactly the same
const { data, loading, error } = useFetch<User[]>('/api/users');

// With cache enabled
const { data, loading, error, fromCache, clearCache } = useFetch<User[]>(
  '/api/users',
  { cache: { enabled: true } }
);
```

## Global Cache Management

```typescript
import { cacheManager } from '@/hooks/useFetch';

// Clear specific cache entry
cacheManager.delete('specific-cache-key');

// Clear all cache entries for a URL
cacheManager.deleteCacheByUrl('/api/users');

// Clear all cache entries with a prefix
cacheManager.deleteCacheByPrefix('/api/auth');

// Clear cache using regex pattern
cacheManager.deleteByPattern(/^\/api\/users/);

// Check cache status
console.log('Cache size:', cacheManager.size());
console.log('Cache keys:', cacheManager.getKeys());

// Clear entire cache
cacheManager.clear();
```

## Advanced Cache Options

```typescript
// Custom TTL (time to live)
const { data } = useFetch('/api/data', {
  cache: {
    enabled: true,
    ttl: 10 * 60 * 1000, // 10 minutes
  }
});

// Custom cache key
const { data } = useFetch('/api/user-profile', {
  cache: {
    enabled: true,
    key: 'current-user-profile',
    ttl: 60 * 1000, // 1 minute
  }
});
```

## Common Use Cases

### 1. Clear Cache on User Actions

```typescript
// In a user profile update component
const handleUpdateProfile = async (userData) => {
  await updateUserProfile(userData);
  
  // Clear all user-related cache
  cacheManager.deleteCacheByPrefix('/api/user');
  
  // Or clear specific cache
  cacheManager.delete('current-user-profile');
};
```

### 2. Cache Invalidation on Authentication

```typescript
// In your auth service
const logout = () => {
  // Clear all cached data on logout
  cacheManager.clear();
  
  // Or be more specific
  cacheManager.deleteCacheByPattern(/^\/api\//);
};
```

### 3. Conditional Cache Management

```typescript
// Clear cache based on conditions
const refreshData = () => {
  const cacheKeys = cacheManager.getKeys();
  
  // Clear only expired or specific caches
  cacheKeys.forEach(key => {
    if (key.includes('stale-endpoint')) {
      cacheManager.delete(key);
    }
  });
};
```

### 4. Remote Cache Invalidation (API Integration)

```typescript
// You can now easily integrate with your backend cache invalidation
const handleRemoteCacheInvalidation = (event) => {
  const { cacheKeys, patterns } = event.data;
  
  // Delete specific keys
  cacheKeys?.forEach(key => cacheManager.delete(key));
  
  // Delete by patterns
  patterns?.forEach(pattern => cacheManager.deleteByPattern(new RegExp(pattern)));
};
```

## Migration Guide

### No Breaking Changes Required

All your existing `useFetch` calls will continue to work exactly as before. The enhancement is fully backward compatible.

### Optional Enhancements

You can gradually enhance your caching by:

1. **Adding TTL to existing cached requests**:
   ```typescript
   // Before
   const { data } = useFetch('/api/data', { cache: { enabled: true } });
   
   // After (optional enhancement)
   const { data } = useFetch('/api/data', { 
     cache: { 
       enabled: true, 
       ttl: 5 * 60 * 1000 // 5 minutes
     } 
   });
   ```

2. **Using global cache management**:
   ```typescript
   import { cacheManager } from '@/hooks/useFetch';
   
   // Use anywhere in your app
   const clearUserCache = () => cacheManager.deleteCacheByPrefix('/api/user');
   ```

## Performance Benefits

- **Memory Efficient**: LRU eviction prevents memory bloat
- **Network Reduction**: Smart caching reduces API calls
- **Flexible TTL**: Automatic cache expiration prevents stale data
- **Targeted Invalidation**: Clear only specific cache entries when needed

## Best Practices

1. **Set appropriate TTL** based on data freshness requirements
2. **Use prefixes** for related endpoints to enable bulk invalidation
3. **Clear cache on mutations** that affect cached data
4. **Monitor cache size** in development to optimize capacity settings
5. **Use custom keys** for complex cache scenarios
