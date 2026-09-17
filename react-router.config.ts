import type { Config } from '@react-router/dev/config';

export default {
	// P006 — web root.tsx lives at repo root; src/app is the native surface
	appDirectory: '.',
	ssr: true,
	prerender: ['/*?'],
} satisfies Config;
