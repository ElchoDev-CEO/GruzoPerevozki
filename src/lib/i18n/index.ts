import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('ru', () => import('@/lib/i18n/locales/ru.json'));

export const initI18n = (): void => {
	init({
		fallbackLocale: 'ru',
		initialLocale: 'ru'
	});
	// getLocaleFromNavigator зарезервирован на будущее (мультиязычность)
	void getLocaleFromNavigator;
};
