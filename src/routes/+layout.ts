import { waitLocale } from 'svelte-i18n';
import { initI18n } from '@/lib/i18n';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = true;

export const load: LayoutLoad = async () => {
	initI18n();
	await waitLocale('ru');
	return {};
};
