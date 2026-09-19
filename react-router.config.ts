import type { Config } from '@react-router/dev/config';

const onVercel = process.env.VERCEL === '1';

export default {
	appDirectory: '.',
	ssr: onVercel ? false : true,
	prerender: onVercel ? ['/', '/trust', '/privacy', '/terms'] : [],
} satisfies Config;
