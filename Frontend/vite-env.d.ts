
/// <reference types="vite/client" />

// Vite environment declarations.
// Add additional custom env variables by extending ImportMetaEnv below if needed.

declare global {
	interface ImportMetaEnv {
		readonly VITE_API_BASE?: string
		// add more VITE_ variables here as needed
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv
	}
}

export {}