/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_LEGACY_AUTH: string;
  readonly VITE_ENABLE_V1_API: string;
  readonly VITE_ENABLE_LEGACY_PAYMENTS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
