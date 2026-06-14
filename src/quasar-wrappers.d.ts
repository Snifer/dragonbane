declare module 'quasar/wrappers' {
  import type { ConfigureCallback } from '@quasar/app-vite/types/configuration';

  export function configure(callback: ConfigureCallback): ConfigureCallback;
}
