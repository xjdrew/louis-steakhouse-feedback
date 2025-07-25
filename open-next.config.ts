import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
//import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";


export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
    // This is only required if you use On-demand revalidation
  tagCache: d1NextTagCache,

  enableCacheInterception: true, // Optional: Improves ISR/SSG performance
});
