/// <reference types="vite/client" />

declare const __IS_PREVIEW__: boolean;

declare module "*.md?raw" {
  const content: string;
  export default content;
}
