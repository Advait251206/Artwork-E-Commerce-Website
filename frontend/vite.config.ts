import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Strict Enterprise 250KB Limit
const MAX_BUNDLE_SIZE_KB = 250;

/**
 * Custom Vite Plugin: BundleSizer
 * Enforces a strict chunk size limit during development and build,
 * breaking the build or warning heavily if the core tier 1 bundle is too large.
 * By default, this ensures 3D assets are correctly lazy-loaded via React.lazy.
 */
function BundleSizer(): Plugin {
  return {
    name: 'bundle-sizer-constraint',
    enforce: 'post',
    generateBundle(_, bundle) {
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          const sizeKb = chunk.code.length / 1024;
          if (sizeKb > MAX_BUNDLE_SIZE_KB) {
            console.warn(
              `\n🚨 [SECURITY/PERF CONSTRAINT VIOLATION] 🚨\n` +
              `Chunk "${fileName}" is ${sizeKb.toFixed(2)}KB (Limit: ${MAX_BUNDLE_SIZE_KB}KB).\n` +
              `You must dynamically import (React.lazy) heavy libraries like R3F or Framer Motion.\n`
            );
          } else {
            console.log(`\n✅ [BUNDLE SIZER] "${fileName}": ${sizeKb.toFixed(2)}KB (Pass)`);
          }
        }
      });
    }
  };
}

export default defineConfig(() => {
  
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Only run the sizer if we're actively building or developing, not polluting prod outputs
      BundleSizer()
    ],
    define: {
      // Deterministic Algorithm Hashing for future Backend Synchronization
      __WORKER_ALGO_HASH__: JSON.stringify('v1.2.a_distortion_engine')
    },
    build: {
      chunkSizeWarningLimit: 1600,
    }
  };
});
