import { defineConfig } from 'orval';

export default defineConfig({
  content: {
    input: {
      target: './openapi.json',
    },
    output: {
      mode: 'tags-split',
      client: 'react-query',
      httpClient: 'fetch',
      target: './src/generated/endpoints',
      schemas: './src/generated/model',
      clean: true,
      override: {
        mutator: {
          path: './src/lib/api/customFetch.ts',
          name: 'customFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'biome check --write --no-errors-on-unmatched src/generated',
    },
  },
});
