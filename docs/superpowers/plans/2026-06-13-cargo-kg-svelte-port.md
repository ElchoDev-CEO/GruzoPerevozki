# Cargo KG — SvelteKit Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Воссоздать лендинг «Cargo KG» (грузоперевозки по Кыргызстану) как точную визуальную копию React/Figma-источника на SvelteKit 2 + Svelte 5 (runes) по конвенциям dentapp_front_crm.

**Architecture:** Lean-слайс публичной части dentapp. Одностраничный статичный сайт: `(site)/(home)/+page.svelte` оркеструет секции из `sections/`; общий каркас (Header/Footer/WhatsApp) в `(site)/+layout.svelte`. Стили — scoped SCSS + CSS-токены (без Tailwind), `postcss-pxtorem`. Тексты — единый `ru.json` (svelte-i18n), контакты — единый `site.ts`, структура секций — `lib/data/*`. Полный prerender через `adapter-auto`.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript (strict), SCSS, `svelte-i18n`, `@iconify/svelte` (+ `@iconify-json/lucide` offline), Vitest + `@testing-library/svelte`, Playwright, bun.

---

## Источник истины (для исполнителя)

- **Эталон дизайна:** `/Users/elcho/Desktop/isi/gruzoperevozki/src/app/components/*.tsx` (React). Переноси разметку/классы оттуда 1:1, конвертируя Tailwind-утилиты в scoped SCSS.
- **Архитектурный образец:** `/Users/elcho/Desktop/isi/dentapp_front_crm` (конфиги, конвенции Svelte 5, SCSS-стиль).
- **Спецификация:** `docs/superpowers/specs/2026-06-13-cargo-kg-svelte-port-design.md`.

## Конвенции (соблюдать во всех задачах)

- **Только стрелочные функции.** Алиас `@` → `src` (не `$lib`, не `../`).
- Svelte 5 runes: `$props`, `$state`, `$derived`, `$effect`. Пропсы через `interface Props`.
- SCSS: scoped `<style lang="scss">`, вложенность по структуре DOM, модификаторы через `&--`.
- Все px пишем как есть (PostCSS сам конвертит в rem; border 1px остаётся px из-за `minPixelValue: 2`).
- Цвета/радиусы/тени — только через `var(--token)` из `app.css`. Никаких inline-hex в компонентах.
- Тексты — только через `$_('home.<...>')`. Никакого хардкода текста в разметке.
- Prettier: табы, одинарные кавычки, без хвостовых запятых. Перед коммитом — `bun run format`.

## Единые сигнатуры (чтобы типы совпадали между задачами)

```ts
// @/lib/utils/carousel.ts
export const nextIndex = (current: number, length: number): number => ...
export const prevIndex = (current: number, length: number): number => ...

// @/lib/utils/contact.ts
export const telHref = (phone: string): string => ...   // -> "tel:+996555123456"
export const waHref  = (phone: string): string => ...   // -> "https://wa.me/996555123456"

// @/lib/utils/scroll.ts
export const smoothScrollToId = (id: string): void => ...
export const scrollToTop = (): void => ...

// @/lib/actions/lazyIframe.ts
export const lazyIframe = (node: HTMLIFrameElement, src: string) => ...  // Svelte action

// @/lib/config/site.ts
export const site = { ... } as const

// @/components/ui/IconBox.svelte  props: { icon: string; bg: string; iconColor?: string; size?: number; radius?: number; hoverScale?: boolean }
// @/components/ui/SectionHeading.svelte  props: { title: string; subtitle?: string; subtitleMaxWidth?: number }
// @/components/ui/Button.svelte  props: { variant?: 'primary' | 'outline'; href?: string; onclick?: () => void; children?: Snippet }
// @/components/ui/Accordion.svelte  props: { items: { id: string; question: string; answer: string }[] }
// @/components/ui/YandexMap.svelte  props: { src: string; title: string }
```

## Карта файлов

| Файл                                                                                                                                  | Ответственность                             | Задача |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------ |
| `svelte.config.js`, `vite.config.ts`, `postcss.config.js`, `tsconfig.json`, `.prettierrc`, `vitest.config.ts`, `playwright.config.ts` | конфигурация                                | 1      |
| `src/app.css`                                                                                                                         | CSS-токены + базовые стили                  | 2      |
| `src/lib/i18n/index.ts`, `src/lib/i18n/locales/ru.json`                                                                               | i18n + все тексты                           | 3      |
| `src/routes/+layout.ts`, `src/routes/+layout.svelte`                                                                                  | prerender + waitLocale + регистрация иконок | 3      |
| `src/lib/config/site.ts`                                                                                                              | контакты/бренд/карта                        | 4      |
| `src/lib/utils/{carousel,contact,scroll}.ts`                                                                                          | чистая логика                               | 5–7    |
| `src/lib/actions/lazyIframe.ts`                                                                                                       | lazy-iframe action                          | 8      |
| `src/lib/icons.ts`                                                                                                                    | offline-регистрация lucide                  | 9      |
| `src/components/ui/{IconBox,SectionHeading,Button,Accordion,YandexMap}.svelte`                                                        | UI-примитивы                                | 9–13   |
| `src/components/layout/{Header,Footer,WhatsAppButton}.svelte`                                                                         | каркас                                      | 14–16  |
| `src/routes/(site)/+layout.svelte`                                                                                                    | каркас сайта                                | 17     |
| `src/routes/(site)/(home)/+page.svelte`                                                                                               | оркестратор + SEO                           | 17, 29 |
| `static/images/*`                                                                                                                     | 6 изображений                               | 18     |
| `src/lib/data/*.ts` + `src/routes/(site)/(home)/sections/*.svelte`                                                                    | секции                                      | 19–28  |
| `e2e/smoke.spec.ts`                                                                                                                   | smoke-тест                                  | 30     |

---

## PHASE A — Скелет и конфигурация

### Task 1: Скелет проекта и конфиги

**Files:**

- Create: проект в `/Users/elcho/Desktop/isi/cargo-kg` (git уже инициализирован)
- Create/Modify: `svelte.config.js`, `vite.config.ts`, `postcss.config.js`, `tsconfig.json`, `.prettierrc`, `package.json`

- [ ] **Step 1: Инициализировать SvelteKit прямо в существующей папке**

Run:

```bash
cd /Users/elcho/Desktop/isi/cargo-kg
bunx sv create . --template minimal --types ts --no-add-ons --install bun
```

Если `sv` спросит про непустую папку — подтвердить (там только `.git`, `.gitignore`, `docs/`).

- [ ] **Step 2: Установить зависимости**

Run:

```bash
bun add -d @sveltejs/adapter-auto sass-embedded postcss-pxtorem autoprefixer prettier-plugin-svelte @testing-library/svelte @testing-library/jest-dom jsdom @playwright/test
bun add svelte-i18n @iconify/svelte @iconify-json/lucide
```

- [ ] **Step 3: Записать `svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'@': 'src'
		}
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
```

- [ ] **Step 4: Записать `postcss.config.js`** (копия из dentapp)

```js
export default {
	plugins: {
		'postcss-pxtorem': {
			rootValue: 16,
			unitPrecision: 5,
			propList: ['*'],
			selectorBlackList: [],
			replace: true,
			mediaQuery: true,
			minPixelValue: 2
		},
		autoprefixer: {}
	}
};
```

- [ ] **Step 5: Записать `.prettierrc`**

```json
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100,
	"plugins": ["prettier-plugin-svelte"],
	"overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
}
```

- [ ] **Step 6: Записать `vitest.config.ts`** (jsdom для компонентных тестов)

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest-setup.ts'],
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
```

- [ ] **Step 7: Записать `vitest-setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 8: Записать `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	webServer: {
		command: 'bun run build && bun run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	use: { baseURL: 'http://localhost:4173' }
});
```

- [ ] **Step 9: Обновить scripts в `package.json`**

```json
"scripts": {
	"dev": "vite dev",
	"build": "vite build",
	"preview": "vite preview",
	"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
	"format": "prettier --write .",
	"test": "vitest run",
	"test:watch": "vitest",
	"test:e2e": "playwright test"
}
```

- [ ] **Step 10: Проверить, что проект собирается**

Run: `bun run check`
Expected: 0 ошибок (предупреждения о пустых маршрутах допустимы).

- [ ] **Step 11: Commit**

```bash
bun run format
git add -A
git commit -m "chore: scaffold SvelteKit project with dentapp config conventions"
```

---

### Task 2: Дизайн-токены и базовые стили (`src/app.css`)

**Files:**

- Create/Modify: `src/app.css`
- Reference (эталон цветов): запущенный оригинал `gruzoperevozki`

- [ ] **Step 1: Снять точные цвета серых из оригинала (опционально, для пиксель-точности)**

Запусти оригинал и сними computed-цвета:

```bash
cd /Users/elcho/Desktop/isi/gruzoperevozki && bun install && bun run dev
```

Через chrome-devtools открой страницу и выполни `getComputedStyle` на элементах с `text-gray-900`, `bg-gray-50`, `text-gray-600`, `border-gray-200`. Запиши rgb-значения. Базовые значения Tailwind ниже использовать как старт; при расхождении — заменить на снятые.

- [ ] **Step 2: Записать `src/app.css`**

```css
:root {
	/* Бренд */
	--brand: #ffc107;
	--brand-hover: #ffb300;

	/* Нейтрали (Tailwind gray; уточнить при сверке) */
	--white: #ffffff;
	--gray-50: #f9fafb;
	--gray-100: #f3f4f6;
	--gray-200: #e5e7eb;
	--gray-300: #d1d5db;
	--gray-400: #9ca3af;
	--gray-500: #6b7280;
	--gray-600: #4b5563;
	--gray-700: #374151;
	--gray-800: #1f2937;
	--gray-900: #111827;

	/* Акценты карточек */
	--whatsapp: #25d366;
	--accent-blue: #3b82f6;
	--accent-green: #22c55e;
	--accent-purple: #a855f7;
	--accent-pink: #ec4899;
	--accent-indigo: #6366f1;
	--accent-orange: #f97316;
	--accent-cyan: #06b6d4;

	/* Радиусы (Tailwind rounded-lg/xl/2xl/3xl/full) */
	--radius-lg: 8px;
	--radius-xl: 12px;
	--radius-2xl: 16px;
	--radius-3xl: 24px;
	--radius-full: 9999px;

	/* Тени (Tailwind shadow-sm/lg/xl/2xl) */
	--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
	--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
	--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

	/* Контейнер/секции */
	--container-7xl: 1280px;
	--container-4xl: 896px;
	--container-padding: 16px;

	/* Высота фикс-хедера (для scroll-margin-top) */
	--header-h: 80px;
}

*,
*::before,
*::after {
	box-sizing: border-box;
}

html {
	font-size: 16px;
	scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
	html {
		scroll-behavior: auto;
	}
}

body {
	margin: 0;
	font-family:
		ui-sans-serif,
		system-ui,
		-apple-system,
		'Segoe UI',
		Roboto,
		Helvetica,
		Arial,
		sans-serif;
	color: var(--gray-900);
	background: var(--white);
	line-height: 1.5;
	-webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
p {
	margin: 0;
}

a {
	color: inherit;
	text-decoration: none;
}

button {
	font-family: inherit;
	cursor: pointer;
}

/* Общий контейнер */
.container {
	width: 100%;
	max-width: var(--container-7xl);
	margin: 0 auto;
	padding-left: var(--container-padding);
	padding-right: var(--container-padding);
}

/* Якоря не прячутся под фикс-хедером */
:where(section[id]) {
	scroll-margin-top: var(--header-h);
}
```

- [ ] **Step 3: Подключить `app.css` глобально** — будет сделано в Task 3 (`+layout.svelte`).

- [ ] **Step 4: Commit**

```bash
git add src/app.css
git commit -m "feat(styles): add design tokens and base styles"
```

---

### Task 3: i18n + все тексты + корневой layout

**Files:**

- Create: `src/lib/i18n/index.ts`, `src/lib/i18n/locales/ru.json`
- Create: `src/routes/+layout.ts`, `src/routes/+layout.svelte`
- Modify: `src/app.html` (lang="ru")

- [ ] **Step 1: Записать `src/lib/i18n/index.ts`**

```ts
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
```

- [ ] **Step 2: Записать `src/lib/i18n/locales/ru.json`** (ЕДИНЫЙ источник всех текстов)

```json
{
	"home": {
		"meta": {
			"title": "Грузоперевозки по Кыргызстану | Грузовая машина на заказ",
			"description": "Частные грузоперевозки по Кыргызстану. Перевозка мебели, техники, коробок и личных вещей. Машина на заказ.",
			"keywords": "грузоперевозки Бишкек, грузовая машина, перевозка мебели, перевозка вещей Кыргызстан",
			"ogTitle": "Частные грузоперевозки по Кыргызстану",
			"ogDescription": "Грузовая машина на заказ для перевозки вещей, мебели и техники."
		},
		"nav": {
			"home": "Главная",
			"services": "Услуги",
			"regions": "Регионы",
			"contact": "Контакты",
			"cta": "Заказать звонок"
		},
		"hero": {
			"badge": "Надежные грузоперевозки",
			"heading": "Грузоперевозки по всему Кыргызстану",
			"sub": "Перевозим грузы любого объема между регионами Кыргызстана быстро, надежно и по выгодным ценам.",
			"btnPrimary": "Заказать перевозку",
			"btnSecondary": "Получить консультацию",
			"stat1v": "1000+",
			"stat1l": "Доставок",
			"stat2v": "24/7",
			"stat2l": "Поддержка"
		},
		"about": {
			"h2": "О компании",
			"sub": "Мы специализируемся на грузоперевозках по всей территории Кыргызстана. Наша компания предлагает широкий спектр транспортных услуг для бизнеса и частных лиц. Гарантируем безопасность груза, соблюдение сроков и профессиональный подход к каждому заказу.",
			"stat1v": "Более 1000",
			"stat1l": "выполненных перевозок",
			"stat2v": "7+",
			"stat2l": "регионов обслуживания",
			"stat3v": "24/7",
			"stat3l": "поддержка клиентов",
			"stat4v": "До 20 тонн",
			"stat4l": "грузоподъемность"
		},
		"services": {
			"h2": "Наши услуги",
			"sub": "Предлагаем полный спектр услуг по грузоперевозкам для решения любых транспортных задач",
			"s1t": "Перевозка мебели",
			"s1d": "Бережная транспортировка мебели любых размеров с упаковкой и разгрузкой",
			"s2t": "Перевозка строительных материалов",
			"s2d": "Доставка стройматериалов, цемента, кирпича и других материалов",
			"s3t": "Перевозка бытовой техники",
			"s3d": "Безопасная транспортировка холодильников, стиральных машин и другой техники",
			"s4t": "Доставка товаров для бизнеса",
			"s4d": "Оптовые перевозки товаров для магазинов и предприятий",
			"s5t": "Междугородние грузоперевозки",
			"s5d": "Доставка грузов между всеми регионами Кыргызстана",
			"s6t": "Экспресс-доставка грузов",
			"s6d": "Срочная доставка грузов в кратчайшие сроки"
		},
		"regions": {
			"h2": "Регионы обслуживания",
			"sub": "Осуществляем грузоперевозки по всей территории Кыргызстана",
			"r1": "Бишкек",
			"r2": "Чуйская область",
			"r3": "Ош",
			"r4": "Джалал-Абад",
			"r5": "Баткен",
			"r6": "Нарын",
			"r7": "Талас",
			"r8": "Иссык-Куль",
			"mapTitle": "Интерактивная карта Кыргызстана",
			"mapSub": "Мы работаем во всех регионах страны"
		},
		"cargo": {
			"h2": "Типы грузов",
			"sub": "Перевозим грузы различных категорий с соблюдением всех требований безопасности",
			"c1t": "Мебель",
			"c1d": "Диваны, шкафы, столы и другая мебель",
			"c2t": "Бытовая техника",
			"c2d": "Холодильники, стиральные машины, телевизоры",
			"c3t": "Строительные материалы",
			"c3d": "Кирпич, цемент, пиломатериалы",
			"c4t": "Коммерческие товары",
			"c4d": "Товары для магазинов и предприятий",
			"c5t": "Личные вещи",
			"c5d": "Переезды и перевозка личных вещей",
			"c6t": "Крупногабаритные грузы",
			"c6d": "Негабаритные и тяжелые грузы"
		},
		"capacity": {
			"h2": "Грузоподъемность",
			"sub": "Выберите подходящий вариант в зависимости от объема вашего груза",
			"popular": "Популярно",
			"cap1w": "До 1 тонны",
			"cap1v": "Газель",
			"cap1e1": "Мелкие посылки",
			"cap1e2": "Бытовая техника",
			"cap1e3": "Личные вещи",
			"cap2w": "До 3 тонн",
			"cap2v": "Газель (удлиненная)",
			"cap2e1": "Мебель",
			"cap2e2": "Стройматериалы",
			"cap2e3": "Оборудование",
			"cap3w": "До 5 тонн",
			"cap3v": "ЗИЛ / Бычок",
			"cap3e1": "Крупная мебель",
			"cap3e2": "Паллеты",
			"cap3e3": "Оптовые товары",
			"cap4w": "До 10 тонн",
			"cap4v": "КАМАЗ",
			"cap4e1": "Промышленные грузы",
			"cap4e2": "Оптовые партии",
			"cap4e3": "Оборудование",
			"cap5w": "До 20 тонн",
			"cap5v": "КАМАЗ (большегруз)",
			"cap5e1": "Негабаритные грузы",
			"cap5e2": "Строительные материалы",
			"cap5e3": "Спецтехника"
		},
		"why": {
			"h2": "Почему выбирают нас",
			"sub": "Мы предлагаем качественный сервис и индивидуальный подход к каждому клиенту",
			"w1t": "Надежная доставка",
			"w1d": "Гарантируем сохранность груза и страхование на всех этапах перевозки",
			"w2t": "Собственный автопарк",
			"w2d": "Современные грузовики различной грузоподъемности в отличном состоянии",
			"w3t": "Работаем по всему Кыргызстану",
			"w3d": "Доставка в любой регион страны с соблюдением сроков",
			"w4t": "Опытные водители",
			"w4d": "Профессиональная команда с многолетним опытом грузоперевозок",
			"w5t": "Контроль груза",
			"w5d": "Отслеживание местоположения и статуса доставки в режиме реального времени",
			"w6t": "Поддержка 24/7",
			"w6d": "Круглосуточная служба поддержки для решения любых вопросов"
		},
		"reviews": {
			"h2": "Отзывы клиентов",
			"sub": "Что говорят наши клиенты о нашей работе",
			"r1name": "Азамат Кадыров",
			"r1role": "Владелец мебельного магазина",
			"r1text": "Отличный сервис! Перевозили крупную партию мебели из Бишкека в Ош. Все прибыло в целости и сохранности, водители профессиональные. Рекомендую!",
			"r1date": "Апрель 2026",
			"r2name": "Гульнара Садыкова",
			"r2role": "Частный клиент",
			"r2text": "Переезжали с семьей из Джалал-Абада в Бишкек. Ребята помогли с упаковкой, погрузкой и разгрузкой. Очень довольны качеством услуг и приемлемыми ценами.",
			"r2date": "Март 2026",
			"r3name": "Бекболот Алиев",
			"r3role": "Директор строительной компании",
			"r3text": "Сотрудничаем уже более года. Регулярно заказываем доставку стройматериалов по всему Кыргызстану. Всегда вовремя, надежно и без проблем.",
			"r3date": "Май 2026",
			"r4name": "Нурбек Токтогулов",
			"r4role": "Владелец магазина техники",
			"r4text": "Перевозили холодильники и стиральные машины. Груз был доставлен точно в срок, все упаковано аккуратно. Цены адекватные, сервис на высоте!",
			"r4date": "Апрель 2026"
		},
		"faq": {
			"h2": "Часто задаваемые вопросы",
			"sub": "Ответы на популярные вопросы о наших услугах",
			"q1": "Какие грузы вы перевозите?",
			"a1": "Мы перевозим широкий спектр грузов: мебель, бытовую технику, строительные материалы, коммерческие товары, личные вещи и крупногабаритные грузы. Работаем как с частными лицами, так и с бизнесом. Грузоподъемность наших транспортных средств – от 1 до 20 тонн.",
			"q2": "В каких регионах работаете?",
			"a2": "Мы осуществляем грузоперевозки по всей территории Кыргызстана, включая Бишкек, Чуйскую область, Ош, Джалал-Абад, Баткен, Нарын, Талас и Иссык-Кульскую область. Доставляем грузы в любой населенный пункт страны.",
			"q3": "Как рассчитывается стоимость?",
			"a3": "Стоимость перевозки зависит от нескольких факторов: расстояние доставки, объем и вес груза, тип транспортного средства, необходимость погрузо-разгрузочных работ и дополнительных услуг (упаковка, подъем на этаж). Для точного расчета свяжитесь с нами по телефону или через WhatsApp.",
			"q4": "Сколько времени занимает доставка?",
			"a4": "Сроки доставки зависят от маршрута и региона. Доставка по Бишкеку занимает от нескольких часов. Междугородние перевозки: Бишкек-Ош – 1-2 дня, Бишкек-Джалал-Абад – 1 день, в другие регионы – от 1 до 3 дней. Также предлагаем услугу экспресс-доставки.",
			"q5": "Можно ли заказать перевозку срочно?",
			"a5": "Да, мы предлагаем услугу срочной экспресс-доставки грузов. В большинстве случаев можем организовать перевозку в день обращения. Свяжитесь с нами по телефону или WhatsApp, и мы оперативно подберем подходящий транспорт для вашего груза."
		},
		"contact": {
			"h2": "Контакты",
			"sub": "Свяжитесь с нами для заказа перевозки или консультации",
			"phoneTitle": "Телефон",
			"whatsappTitle": "WhatsApp",
			"whatsappNote": "Быстрая связь и консультация",
			"emailTitle": "Email",
			"addressTitle": "Адрес",
			"hoursTitle": "Режим работы",
			"hoursValue": "Круглосуточно, 24/7\nБез выходных и праздников"
		},
		"footer": {
			"desc": "Надежные грузоперевозки по всему Кыргызстану. Профессионально, быстро, безопасно.",
			"navTitle": "Навигация",
			"navAbout": "О компании",
			"servicesTitle": "Услуги",
			"svc1": "Перевозка мебели",
			"svc2": "Строительные материалы",
			"svc3": "Бытовая техника",
			"svc4": "Междугородние перевозки",
			"contactsTitle": "Контакты",
			"copyright": "© 2026 Cargo KG. Все права защищены."
		}
	}
}
```

- [ ] **Step 3: Записать `src/routes/+layout.ts`**

```ts
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
```

- [ ] **Step 4: Записать `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
	import '@/app.css';
	import '@/lib/icons';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}
```

> Примечание: `@/lib/icons` создаётся в Task 9. До Task 9 временно закомментировать импорт, раскомментировать в Task 9.

- [ ] **Step 5: Обновить `src/app.html`** — убедиться, что `<html lang="ru">`.

- [ ] **Step 6: Commit**

```bash
bun run format
git add -A
git commit -m "feat(i18n): add svelte-i18n setup and complete ru locale"
```

---

### Task 4: Конфиг сайта (`src/lib/config/site.ts`)

**Files:**

- Create: `src/lib/config/site.ts`

- [ ] **Step 1: Записать `src/lib/config/site.ts`** (единый источник контактов/бренда; значения-заглушки из источника)

```ts
export const site = {
	brand: 'Cargo KG',
	phones: ['+996 555 123 456', '+996 700 987 654'],
	whatsapp: '996555123456',
	email: 'info@cargo-kg.com',
	address: 'г. Бишкек, ул. Ахунбаева 123\nКыргызская Республика',
	addressShort: 'г. Бишкек, ул. Ахунбаева 123',
	social: {
		facebook: '#',
		instagram: '#'
	},
	// Координаты центра Бишкека для встраивания карты Яндекс (lazy iframe)
	map: {
		src: 'https://yandex.ru/map-widget/v1/?ll=74.590416%2C42.874621&z=12',
		title: 'Карта: г. Бишкек'
	}
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/config/site.ts
git commit -m "feat(config): add site config (contacts, brand, map)"
```

---

## PHASE B — Чистая логика (строгий TDD)

### Task 5: `carousel.ts` (TDD)

**Files:**

- Create: `src/lib/utils/carousel.ts`
- Test: `src/lib/utils/carousel.test.ts`

- [ ] **Step 1: Написать падающий тест**

```ts
import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from '@/lib/utils/carousel';

describe('carousel', () => {
	it('nextIndex увеличивает индекс', () => {
		expect(nextIndex(0, 4)).toBe(1);
	});
	it('nextIndex заворачивается с последнего на первый', () => {
		expect(nextIndex(3, 4)).toBe(0);
	});
	it('prevIndex уменьшает индекс', () => {
		expect(prevIndex(2, 4)).toBe(1);
	});
	it('prevIndex заворачивается с первого на последний', () => {
		expect(prevIndex(0, 4)).toBe(3);
	});
	it('length=1 всегда возвращает 0', () => {
		expect(nextIndex(0, 1)).toBe(0);
		expect(prevIndex(0, 1)).toBe(0);
	});
	it('length=0 безопасно возвращает 0 (нет деления на ноль)', () => {
		expect(nextIndex(0, 0)).toBe(0);
		expect(prevIndex(0, 0)).toBe(0);
	});
});
```

- [ ] **Step 2: Запустить тест — должен упасть**

Run: `bun run test src/lib/utils/carousel.test.ts`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

```ts
export const nextIndex = (current: number, length: number): number =>
	length <= 0 ? 0 : (current + 1) % length;

export const prevIndex = (current: number, length: number): number =>
	length <= 0 ? 0 : (current - 1 + length) % length;
```

- [ ] **Step 4: Запустить тест — должен пройти**

Run: `bun run test src/lib/utils/carousel.test.ts`
Expected: PASS (6 тестов).

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/carousel.ts src/lib/utils/carousel.test.ts
git commit -m "feat(utils): add carousel index helpers with wrap-around"
```

---

### Task 6: `contact.ts` (TDD)

**Files:**

- Create: `src/lib/utils/contact.ts`
- Test: `src/lib/utils/contact.test.ts`

- [ ] **Step 1: Написать падающий тест**

```ts
import { describe, it, expect } from 'vitest';
import { telHref, waHref } from '@/lib/utils/contact';

describe('contact href builders', () => {
	it('telHref убирает пробелы и добавляет схему tel:', () => {
		expect(telHref('+996 555 123 456')).toBe('tel:+996555123456');
	});
	it('waHref строит ссылку wa.me только из цифр', () => {
		expect(waHref('996555123456')).toBe('https://wa.me/996555123456');
	});
	it('waHref убирает + и пробелы', () => {
		expect(waHref('+996 555 123 456')).toBe('https://wa.me/996555123456');
	});
});
```

- [ ] **Step 2: Запустить тест — должен упасть**

Run: `bun run test src/lib/utils/contact.test.ts`
Expected: FAIL.

- [ ] **Step 3: Реализация**

```ts
const stripSpaces = (phone: string): string => phone.replace(/\s+/g, '');
const digitsAndPlus = (phone: string): string => phone.replace(/[^\d+]/g, '');
const digitsOnly = (phone: string): string => phone.replace(/\D/g, '');

export const telHref = (phone: string): string => `tel:${digitsAndPlus(stripSpaces(phone))}`;

export const waHref = (phone: string): string => `https://wa.me/${digitsOnly(phone)}`;
```

- [ ] **Step 4: Запустить тест — должен пройти**

Run: `bun run test src/lib/utils/contact.test.ts`
Expected: PASS (3 теста).

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/contact.ts src/lib/utils/contact.test.ts
git commit -m "feat(utils): add tel/whatsapp href builders"
```

---

### Task 7: `scroll.ts` (TDD)

**Files:**

- Create: `src/lib/utils/scroll.ts`
- Test: `src/lib/utils/scroll.test.ts`

- [ ] **Step 1: Написать падающий тест**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { smoothScrollToId, scrollToTop } from '@/lib/utils/scroll';

describe('scroll helpers', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('smoothScrollToId вызывает scrollIntoView у найденного элемента', () => {
		const el = document.createElement('div');
		el.id = 'target';
		const spy = vi.fn();
		el.scrollIntoView = spy;
		document.body.appendChild(el);

		smoothScrollToId('target');
		expect(spy).toHaveBeenCalledOnce();

		document.body.removeChild(el);
	});

	it('smoothScrollToId — no-op для отсутствующего id', () => {
		expect(() => smoothScrollToId('does-not-exist')).not.toThrow();
	});

	it('scrollToTop вызывает window.scrollTo', () => {
		const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
		scrollToTop();
		expect(spy).toHaveBeenCalledOnce();
	});
});
```

- [ ] **Step 2: Запустить тест — должен упасть**

Run: `bun run test src/lib/utils/scroll.test.ts`
Expected: FAIL.

- [ ] **Step 3: Реализация**

```ts
const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' &&
	window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const behavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');

export const smoothScrollToId = (id: string): void => {
	const el = document.getElementById(id);
	el?.scrollIntoView({ behavior: behavior() });
};

export const scrollToTop = (): void => {
	window.scrollTo({ top: 0, behavior: behavior() });
};
```

- [ ] **Step 4: Запустить тест — должен пройти**

Run: `bun run test src/lib/utils/scroll.test.ts`
Expected: PASS (3 теста).

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/scroll.ts src/lib/utils/scroll.test.ts
git commit -m "feat(utils): add smooth scroll helpers honoring reduced-motion"
```

---

### Task 8: `lazyIframe.ts` action (TDD)

**Files:**

- Create: `src/lib/actions/lazyIframe.ts`
- Test: `src/lib/actions/lazyIframe.test.ts`

- [ ] **Step 1: Написать падающий тест**

```ts
import { describe, it, expect, vi } from 'vitest';
import { lazyIframe } from '@/lib/actions/lazyIframe';

describe('lazyIframe action', () => {
	it('без IntersectionObserver выставляет src сразу', () => {
		const original = globalThis.IntersectionObserver;
		// @ts-expect-error эмулируем отсутствие API
		globalThis.IntersectionObserver = undefined;

		const iframe = document.createElement('iframe');
		lazyIframe(iframe, 'https://example.com/map');
		expect(iframe.getAttribute('src')).toBe('https://example.com/map');

		globalThis.IntersectionObserver = original;
	});

	it('возвращает объект с destroy', () => {
		const iframe = document.createElement('iframe');
		const ret = lazyIframe(iframe, 'https://example.com/map');
		expect(typeof ret?.destroy).toBe('function');
		ret?.destroy?.();
	});
});
```

- [ ] **Step 2: Запустить тест — должен упасть**

Run: `bun run test src/lib/actions/lazyIframe.test.ts`
Expected: FAIL.

- [ ] **Step 3: Реализация**

```ts
export const lazyIframe = (node: HTMLIFrameElement, src: string) => {
	const load = (): void => {
		if (!node.getAttribute('src')) node.setAttribute('src', src);
	};

	if (typeof IntersectionObserver === 'undefined') {
		load();
		return { destroy: (): void => {} };
	}

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				load();
				observer.disconnect();
			}
		},
		{ rootMargin: '200px' }
	);
	observer.observe(node);

	return {
		destroy: (): void => observer.disconnect()
	};
};
```

- [ ] **Step 4: Запустить тест — должен пройти**

Run: `bun run test src/lib/actions/lazyIframe.test.ts`
Expected: PASS (2 теста).

- [ ] **Step 5: Commit**

```bash
git add src/lib/actions/lazyIframe.ts src/lib/actions/lazyIframe.test.ts
git commit -m "feat(actions): add lazyIframe action with IntersectionObserver"
```

---

## PHASE C — UI-примитивы

### Task 9: Offline-иконки + `IconBox.svelte`

**Files:**

- Create: `src/lib/icons.ts`, `src/components/ui/IconBox.svelte`
- Modify: `src/routes/+layout.svelte` (раскомментировать импорт `@/lib/icons`)

- [ ] **Step 1: Записать `src/lib/icons.ts`** (регистрация набора lucide офлайн — без runtime-фетча, корректный SSR/prerender)

```ts
import { addCollection } from '@iconify/svelte';
import lucide from '@iconify-json/lucide/icons.json';

addCollection(lucide);
```

> Бандлится весь набор lucide (приемлемо для статичного лендинга, gzip невелик). Будущая оптимизация — подмножество через `unplugin-icons`.

- [ ] **Step 2: Раскомментировать в `src/routes/+layout.svelte`** импорт `import '@/lib/icons';`.

- [ ] **Step 3: Записать `src/components/ui/IconBox.svelte`** (цветной скруглённый бокс с иконкой — переиспользуется ~10 раз)

```svelte
<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		icon: string;
		bg: string;
		iconColor?: string;
		size?: number;
		radius?: number;
		hoverScale?: boolean;
	}

	let {
		icon,
		bg,
		iconColor = 'var(--gray-900)',
		size = 56,
		radius = 12,
		hoverScale = false
	}: Props = $props();

	const iconSize = $derived(Math.round(size * 0.5));
</script>

<div
	class="icon-box"
	class:icon-box--hover={hoverScale}
	style="--box-bg:{bg}; --box-size:{size}px; --box-radius:{radius}px; --box-color:{iconColor}; --box-icon:{iconSize}px"
>
	<Icon {icon} width={iconSize} height={iconSize} />
</div>

<style lang="scss">
	.icon-box {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--box-size);
		height: var(--box-size);
		border-radius: var(--box-radius);
		background: var(--box-bg);
		color: var(--box-color);

		&--hover {
			transition: transform 0.3s ease;
		}
	}
</style>
```

- [ ] **Step 4: Проверка типов и сборки**

Run: `bun run check`
Expected: 0 ошибок.

- [ ] **Step 5: Commit**

```bash
bun run format
git add -A
git commit -m "feat(ui): add offline lucide icons and IconBox component"
```

---

### Task 10: `SectionHeading.svelte`

**Files:**

- Create: `src/components/ui/SectionHeading.svelte`

- [ ] **Step 1: Записать компонент** (центрированный заголовок секции, используется ~9 раз)

```svelte
<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		subtitleMaxWidth?: number;
	}

	let { title, subtitle, subtitleMaxWidth = 672 }: Props = $props();
</script>

<div class="section-heading">
	<h2>{title}</h2>
	{#if subtitle}
		<p style="--sub-mw:{subtitleMaxWidth}px">{subtitle}</p>
	{/if}
</div>

<style lang="scss">
	.section-heading {
		text-align: center;
		margin-bottom: 48px;

		h2 {
			font-size: 30px;
			font-weight: 700;
			color: var(--gray-900);
			margin-bottom: 16px;
		}

		p {
			font-size: 18px;
			color: var(--gray-600);
			max-width: var(--sub-mw);
			margin: 0 auto;
		}

		@media (min-width: 768px) {
			h2 {
				font-size: 36px;
			}
		}
	}
</style>
```

- [ ] **Step 2: Commit**

```bash
bun run format
git add src/components/ui/SectionHeading.svelte
git commit -m "feat(ui): add SectionHeading component"
```

---

### Task 11: `Button.svelte`

**Files:**

- Create: `src/components/ui/Button.svelte`

- [ ] **Step 1: Записать компонент** (варианты primary/outline; рендерит `<a>` если есть `href`, иначе `<button>`)

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'outline';
		href?: string;
		onclick?: () => void;
		ariaLabel?: string;
		children?: Snippet;
	}

	let { variant = 'primary', href, onclick, ariaLabel, children }: Props = $props();
</script>

{#if href}
	<a class="btn btn--{variant}" {href} aria-label={ariaLabel}>{@render children?.()}</a>
{:else}
	<button class="btn btn--{variant}" {onclick} aria-label={ariaLabel}>
		{@render children?.()}
	</button>
{/if}

<style lang="scss">
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-weight: 500;
		border: none;
		transition: all 0.3s ease;

		&--primary {
			background: var(--brand);
			color: var(--gray-900);
			padding: 8px 24px;
			border-radius: var(--radius-xl);

			&:hover {
				background: var(--brand-hover);
			}
		}

		&--outline {
			background: transparent;
			color: var(--gray-900);
			padding: 8px 24px;
			border: 2px solid var(--gray-300);
			border-radius: var(--radius-xl);

			&:hover {
				border-color: var(--brand);
			}
		}
	}
</style>
```

> Примечание: размеры hero-кнопок (`px-8 py-6 text-lg rounded-2xl`) задаются в самой Hero-секции через локальный класс-обёртку или модификатор — уточнить при сверке (Task 19).

- [ ] **Step 2: Commit**

```bash
bun run format
git add src/components/ui/Button.svelte
git commit -m "feat(ui): add Button component (primary/outline)"
```

---

### Task 12: `Accordion.svelte` (+ компонентный тест)

**Files:**

- Create: `src/components/ui/Accordion.svelte`
- Test: `src/components/ui/Accordion.test.ts`

- [ ] **Step 1: Написать падающий компонентный тест**

```ts
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Accordion from '@/components/ui/Accordion.svelte';

const items = [
	{ id: 'a', question: 'Вопрос 1', answer: 'Ответ 1' },
	{ id: 'b', question: 'Вопрос 2', answer: 'Ответ 2' }
];

describe('Accordion', () => {
	it('по умолчанию все закрыты', () => {
		render(Accordion, { items });
		const triggers = screen.getAllByRole('button');
		expect(triggers[0]).toHaveAttribute('aria-expanded', 'false');
	});

	it('клик открывает элемент', async () => {
		render(Accordion, { items });
		const triggers = screen.getAllByRole('button');
		await fireEvent.click(triggers[0]);
		expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
	});

	it('открытие второго закрывает первый (single)', async () => {
		render(Accordion, { items });
		const triggers = screen.getAllByRole('button');
		await fireEvent.click(triggers[0]);
		await fireEvent.click(triggers[1]);
		expect(triggers[0]).toHaveAttribute('aria-expanded', 'false');
		expect(triggers[1]).toHaveAttribute('aria-expanded', 'true');
	});

	it('повторный клик закрывает (collapsible)', async () => {
		render(Accordion, { items });
		const triggers = screen.getAllByRole('button');
		await fireEvent.click(triggers[0]);
		await fireEvent.click(triggers[0]);
		expect(triggers[0]).toHaveAttribute('aria-expanded', 'false');
	});
});
```

- [ ] **Step 2: Запустить тест — должен упасть**

Run: `bun run test src/components/ui/Accordion.test.ts`
Expected: FAIL.

- [ ] **Step 3: Реализация**

```svelte
<script lang="ts">
	interface Item {
		id: string;
		question: string;
		answer: string;
	}

	interface Props {
		items: Item[];
	}

	let { items }: Props = $props();

	let openId = $state<string | null>(null);

	const toggle = (id: string): void => {
		openId = openId === id ? null : id;
	};
</script>

<div class="accordion">
	{#each items as item (item.id)}
		<div class="accordion__item" class:accordion__item--open={openId === item.id}>
			<button
				class="accordion__trigger"
				aria-expanded={openId === item.id}
				aria-controls="panel-{item.id}"
				onclick={() => toggle(item.id)}
			>
				<span>{item.question}</span>
				<svg
					class="accordion__chevron"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>
			{#if openId === item.id}
				<div class="accordion__panel" id="panel-{item.id}">{item.answer}</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.accordion {
		display: flex;
		flex-direction: column;
		gap: 16px;

		&__item {
			background: var(--gray-50);
			border: 1px solid var(--gray-200);
			border-radius: var(--radius-2xl);
			padding: 0 24px;
			transition: border-color 0.2s ease;

			&--open {
				border-color: var(--brand);
			}
		}

		&__trigger {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			width: 100%;
			padding: 24px 0;
			background: none;
			border: none;
			text-align: left;
			font-weight: 600;
			color: var(--gray-900);
		}

		&__chevron {
			flex-shrink: 0;
			transition: transform 0.2s ease;
			color: var(--gray-500);
		}

		&__item--open &__chevron {
			transform: rotate(180deg);
		}

		&__panel {
			padding-bottom: 24px;
			color: var(--gray-600);
			line-height: 1.625;
		}
	}
</style>
```

- [ ] **Step 4: Запустить тест — должен пройти**

Run: `bun run test src/components/ui/Accordion.test.ts`
Expected: PASS (4 теста).

- [ ] **Step 5: Commit**

```bash
bun run format
git add src/components/ui/Accordion.svelte src/components/ui/Accordion.test.ts
git commit -m "feat(ui): add single-collapsible Accordion with a11y"
```

---

### Task 13: `YandexMap.svelte`

**Files:**

- Create: `src/components/ui/YandexMap.svelte`

- [ ] **Step 1: Записать компонент** (lazy iframe, фикс. соотношение, без CLS)

```svelte
<script lang="ts">
	import { lazyIframe } from '@/lib/actions/lazyIframe';

	interface Props {
		src: string;
		title: string;
	}

	let { src, title }: Props = $props();
</script>

<div class="yandex-map">
	<iframe {title} use:lazyIframe={src} loading="lazy" allowfullscreen></iframe>
</div>

<style lang="scss">
	.yandex-map {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 400px;
		border-radius: var(--radius-3xl);
		overflow: hidden;

		iframe {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			border: none;
		}
	}
</style>
```

- [ ] **Step 2: Commit**

```bash
bun run format
git add src/components/ui/YandexMap.svelte
git commit -m "feat(ui): add lazy-loaded YandexMap component"
```

---

## PHASE D — Каркас сайта

### Task 14: `Header.svelte` (+ компонентный тест)

**Files:**

- Create: `src/components/layout/Header.svelte`
- Create: `src/lib/data/nav.ts`
- Test: `src/components/layout/Header.test.ts`

- [ ] **Step 1: Записать `src/lib/data/nav.ts`**

```ts
export interface NavLink {
	labelKey: string;
	targetId: string | null; // null => scrollToTop
}

export const navLinks: NavLink[] = [
	{ labelKey: 'home.nav.home', targetId: null },
	{ labelKey: 'home.nav.services', targetId: 'services' },
	{ labelKey: 'home.nav.regions', targetId: 'regions' },
	{ labelKey: 'home.nav.contact', targetId: 'contact' }
];
```

- [ ] **Step 2: Написать падающий компонентный тест**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { init, addMessages } from 'svelte-i18n';
import ru from '@/lib/i18n/locales/ru.json';
import Header from '@/components/layout/Header.svelte';

beforeEach(() => {
	addMessages('ru', ru);
	init({ fallbackLocale: 'ru', initialLocale: 'ru' });
});

describe('Header', () => {
	it('бургер-меню скрыто по умолчанию', () => {
		render(Header);
		const toggle = screen.getByLabelText('menu');
		expect(toggle).toHaveAttribute('aria-expanded', 'false');
	});

	it('клик по бургеру открывает мобильное меню', async () => {
		render(Header);
		const toggle = screen.getByLabelText('menu');
		await fireEvent.click(toggle);
		expect(toggle).toHaveAttribute('aria-expanded', 'true');
	});
});
```

- [ ] **Step 3: Запустить тест — должен упасть**

Run: `bun run test src/components/layout/Header.test.ts`
Expected: FAIL.

- [ ] **Step 4: Реализация** (перенос из `Header.tsx`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import { site } from '@/lib/config/site';
	import { navLinks } from '@/lib/data/nav';
	import { smoothScrollToId, scrollToTop } from '@/lib/utils/scroll';
	import IconBox from '@/components/ui/IconBox.svelte';
	import Button from '@/components/ui/Button.svelte';

	let menuOpen = $state(false);

	const go = (targetId: string | null): void => {
		if (targetId) smoothScrollToId(targetId);
		else scrollToTop();
		menuOpen = false;
	};

	$effect(() => {
		const onResize = (): void => {
			if (window.innerWidth >= 768) menuOpen = false;
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});
</script>

<header class="header">
	<div class="container header__inner">
		<button class="header__logo" onclick={() => go(null)}>
			<IconBox icon="lucide:truck" bg="var(--brand)" size={48} hoverScale />
			<span class="header__brand">{site.brand}</span>
		</button>

		<nav class="header__nav">
			{#each navLinks as link}
				<button class="header__link" onclick={() => go(link.targetId)}>{$_(link.labelKey)}</button>
			{/each}
		</nav>

		<div class="header__cta">
			<Button variant="primary" onclick={() => go('contact')}>{$_('home.nav.cta')}</Button>
		</div>

		<button
			class="header__burger"
			aria-label="menu"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<Icon icon={menuOpen ? 'lucide:x' : 'lucide:menu'} width="24" height="24" />
		</button>
	</div>

	{#if menuOpen}
		<div class="container header__mobile">
			{#each navLinks as link}
				<button class="header__mobile-link" onclick={() => go(link.targetId)}>
					{$_(link.labelKey)}
				</button>
			{/each}
			<Button variant="primary" onclick={() => go('contact')}>{$_('home.nav.cta')}</Button>
		</div>
	{/if}
</header>

<style lang="scss">
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 40;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(4px);
		box-shadow: var(--shadow-sm);

		&__inner {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: var(--header-h);
		}

		&__logo {
			display: flex;
			align-items: center;
			gap: 8px;
			background: none;
			border: none;

			&:hover :global(.icon-box--hover) {
				transform: scale(1.1);
			}
		}

		&__brand {
			font-size: 24px;
			font-weight: 700;
			color: var(--gray-900);
		}

		&__nav {
			display: none;
			align-items: center;
			gap: 32px;
		}

		&__link {
			background: none;
			border: none;
			font-weight: 500;
			color: var(--gray-700);
			transition: color 0.2s ease;

			&:hover {
				color: var(--brand);
			}
		}

		&__cta {
			display: none;
		}

		&__burger {
			display: inline-flex;
			padding: 8px;
			background: none;
			border: none;
			color: var(--gray-700);
			border-radius: var(--radius-lg);

			&:hover {
				background: var(--gray-100);
			}
		}

		&__mobile {
			display: flex;
			flex-direction: column;
			gap: 8px;
			padding: 16px;
			border-top: 1px solid var(--gray-100);
		}

		&__mobile-link {
			text-align: left;
			padding: 12px 16px;
			background: none;
			border: none;
			color: var(--gray-700);
			border-radius: var(--radius-lg);

			&:hover {
				background: var(--gray-50);
			}
		}

		@media (min-width: 768px) {
			&__nav,
			&__cta {
				display: flex;
			}
			&__burger {
				display: none;
			}
		}
	}
</style>
```

- [ ] **Step 5: Запустить тест — должен пройти**

Run: `bun run test src/components/layout/Header.test.ts`
Expected: PASS (2 теста).

- [ ] **Step 6: Commit**

```bash
bun run format
git add -A
git commit -m "feat(layout): add Header with mobile menu and smooth-scroll nav"
```

---

### Task 15: `Footer.svelte`

**Files:**

- Create: `src/components/layout/Footer.svelte`
- Create: `src/lib/data/footer.ts`

- [ ] **Step 1: Записать `src/lib/data/footer.ts`**

```ts
export const footerNav = [
	{ labelKey: 'home.nav.services', targetId: 'services' },
	{ labelKey: 'home.nav.regions', targetId: 'regions' },
	{ labelKey: 'home.nav.contact', targetId: 'contact' }
];

export const footerServiceKeys = [
	'home.footer.svc1',
	'home.footer.svc2',
	'home.footer.svc3',
	'home.footer.svc4'
];
```

- [ ] **Step 2: Реализация** (перенос из `Footer.tsx`; FB/IG/WA — inline SVG)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import { site } from '@/lib/config/site';
	import { footerNav, footerServiceKeys } from '@/lib/data/footer';
	import { smoothScrollToId } from '@/lib/utils/scroll';
	import { telHref, waHref } from '@/lib/utils/contact';
	import IconBox from '@/components/ui/IconBox.svelte';
</script>

<footer class="footer">
	<div class="container">
		<div class="footer__grid">
			<div class="footer__col">
				<div class="footer__brand">
					<IconBox icon="lucide:truck" bg="var(--brand)" size={40} />
					<span>{site.brand}</span>
				</div>
				<p class="footer__desc">{$_('home.footer.desc')}</p>
			</div>

			<div class="footer__col">
				<h3>{$_('home.footer.navTitle')}</h3>
				<ul>
					{#each footerNav as link}
						<li>
							<button onclick={() => smoothScrollToId(link.targetId)}>{$_(link.labelKey)}</button>
						</li>
					{/each}
					<li><a href="#top">{$_('home.footer.navAbout')}</a></li>
				</ul>
			</div>

			<div class="footer__col">
				<h3>{$_('home.footer.servicesTitle')}</h3>
				<ul class="footer__plain">
					{#each footerServiceKeys as key}
						<li>{$_(key)}</li>
					{/each}
				</ul>
			</div>

			<div class="footer__col">
				<h3>{$_('home.footer.contactsTitle')}</h3>
				<ul class="footer__contacts">
					<li>
						<Icon icon="lucide:phone" width="20" height="20" />
						<a href={telHref(site.phones[0])}>{site.phones[0]}</a>
					</li>
					<li>
						<Icon icon="lucide:mail" width="20" height="20" />
						<a href="mailto:{site.email}">{site.email}</a>
					</li>
					<li>
						<Icon icon="lucide:map-pin" width="20" height="20" />
						<span>{site.addressShort}</span>
					</li>
				</ul>
			</div>
		</div>

		<div class="footer__bottom">
			<div class="footer__social">
				<a class="footer__social-link" href={site.social.facebook} aria-label="Facebook">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
						/>
					</svg>
				</a>
				<a class="footer__social-link" href={site.social.instagram} aria-label="Instagram">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
						/>
					</svg>
				</a>
				<a
					class="footer__social-link footer__social-link--wa"
					href={waHref(site.whatsapp)}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="WhatsApp"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
						/>
					</svg>
				</a>
			</div>
			<div class="footer__copy">{$_('home.footer.copyright')}</div>
		</div>
	</div>
</footer>

<style lang="scss">
	.footer {
		background: var(--gray-900);
		color: var(--white);
		padding-top: 64px;
		padding-bottom: 32px;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 32px;
			margin-bottom: 48px;
		}

		&__brand {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 16px;
			font-size: 20px;
			font-weight: 700;
		}

		&__desc {
			color: var(--gray-400);
			line-height: 1.625;
		}

		&__col {
			h3 {
				font-size: 18px;
				font-weight: 600;
				margin-bottom: 16px;
			}

			ul {
				list-style: none;
				margin: 0;
				padding: 0;
				display: flex;
				flex-direction: column;
				gap: 8px;
			}

			button,
			a {
				background: none;
				border: none;
				color: var(--gray-400);
				text-align: left;
				transition: color 0.2s ease;

				&:hover {
					color: var(--brand);
				}
			}
		}

		&__plain li {
			color: var(--gray-400);
		}

		&__contacts li {
			display: flex;
			align-items: flex-start;
			gap: 8px;
			color: var(--gray-400);

			:global(svg) {
				color: var(--brand);
				flex-shrink: 0;
				margin-top: 2px;
			}
		}

		&__bottom {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 16px;
			border-top: 1px solid var(--gray-800);
			padding-top: 32px;
		}

		&__social {
			display: flex;
			gap: 16px;
		}

		&__social-link {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
			background: var(--gray-800);
			border-radius: var(--radius-lg);
			transition: all 0.3s ease;

			&:hover {
				background: var(--brand);
				color: var(--gray-900);
			}

			&--wa:hover {
				background: var(--whatsapp);
				color: var(--white);
			}
		}

		&__copy {
			color: var(--gray-400);
			font-size: 14px;
		}

		@media (min-width: 768px) {
			&__grid {
				grid-template-columns: repeat(2, 1fr);
			}
			&__bottom {
				flex-direction: row;
				justify-content: space-between;
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: repeat(4, 1fr);
			}
		}
	}
</style>
```

- [ ] **Step 3: Commit**

```bash
bun run format
git add -A
git commit -m "feat(layout): add Footer"
```

---

### Task 16: `WhatsAppButton.svelte`

**Files:**

- Create: `src/components/layout/WhatsAppButton.svelte`

- [ ] **Step 1: Реализация** (перенос из `WhatsAppButton.tsx`)

```svelte
<script lang="ts">
	import { site } from '@/lib/config/site';
	import { waHref } from '@/lib/utils/contact';
</script>

<a
	class="wa-button"
	href={waHref(site.whatsapp)}
	target="_blank"
	rel="noopener noreferrer"
	aria-label="Contact us on WhatsApp"
>
	<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
		<path
			d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
		/>
	</svg>
</a>

<style lang="scss">
	.wa-button {
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background: var(--whatsapp);
		color: var(--white);
		border-radius: var(--radius-full);
		box-shadow: var(--shadow-2xl);
		transition: transform 0.3s ease;

		&:hover {
			transform: scale(1.1);
		}
	}
</style>
```

- [ ] **Step 2: Commit**

```bash
bun run format
git add src/components/layout/WhatsAppButton.svelte
git commit -m "feat(layout): add floating WhatsApp button"
```

---

### Task 17: Каркас сайта + пустой `+page.svelte` с SEO

**Files:**

- Create: `src/routes/(site)/+layout.svelte`
- Create: `src/routes/(site)/(home)/+page.svelte`

- [ ] **Step 1: Записать `src/routes/(site)/+layout.svelte`**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Header from '@/components/layout/Header.svelte';
	import Footer from '@/components/layout/Footer.svelte';
	import WhatsAppButton from '@/components/layout/WhatsAppButton.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<Header />
<main>{@render children?.()}</main>
<Footer />
<WhatsAppButton />
```

- [ ] **Step 2: Записать `src/routes/(site)/(home)/+page.svelte`** (пока только SEO-голова; секции добавятся в Task 29)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$_('home.meta.title')}</title>
	<meta name="description" content={$_('home.meta.description')} />
	<meta name="keywords" content={$_('home.meta.keywords')} />
	<meta property="og:title" content={$_('home.meta.ogTitle')} />
	<meta property="og:description" content={$_('home.meta.ogDescription')} />
</svelte:head>

<!-- Секции добавляются в Task 29 -->
```

- [ ] **Step 3: Запустить dev и проверить, что Header/Footer/WhatsApp рендерятся**

Run: `bun run dev` → открыть http://localhost:5173
Expected: видны хедер с логотипом «Cargo KG», футер, плавающая кнопка WhatsApp; ошибок в консоли нет.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(site): add site layout shell and home page SEO head"
```

---

## PHASE E — Ассеты

### Task 18: Скачать изображения

**Files:**

- Create: `static/images/*.jpg`, `ATTRIBUTIONS.md`

- [ ] **Step 1: Скачать 6 изображений** (URL из `gruzoperevozki/src/app/components/{HeroSection,CargoTypesSection}.tsx`)

Run:

```bash
cd /Users/elcho/Desktop/isi/cargo-kg && mkdir -p static/images
curl -L -o static/images/hero-truck.jpg "https://images.unsplash.com/photo-1624898115402-eddff44b6491?fm=jpg&q=80&w=1080"
curl -L -o static/images/cargo-furniture.jpg "https://images.unsplash.com/photo-1730154838368-c37b1fdebcf6?fm=jpg&q=80&w=1080"
curl -L -o static/images/cargo-appliances.jpg "https://images.unsplash.com/photo-1614018453562-77f6180ce036?fm=jpg&q=80&w=1080"
curl -L -o static/images/cargo-construction.jpg "https://images.unsplash.com/photo-1761805618757-9d2b9552ee32?fm=jpg&q=80&w=1080"
curl -L -o static/images/cargo-commercial.jpg "https://images.unsplash.com/photo-1605745341112-85968b19335b?fm=jpg&q=80&w=1080"
curl -L -o static/images/cargo-oversized.jpg "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?fm=jpg&q=80&w=1080"
```

> Примечание: «Личные вещи» в источнике повторно использует фото мебели (`photo-1730154838368`). В нашей версии для `c5` используем `cargo-furniture.jpg` (как в оригинале).

- [ ] **Step 2: Проверить, что файлы скачались (не нулевого размера)**

Run: `ls -la static/images && file static/images/*.jpg`
Expected: 6 JPEG-файлов > 10KB каждый. Если какой-то URL вернул 404/HTML — найти рабочий вариант в оригинале или скачать через запущенный оригинал.

- [ ] **Step 3: Записать `ATTRIBUTIONS.md`**

```markdown
This project includes UI components derived from [shadcn/ui](https://ui.shadcn.com/) under the [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).

Photos from [Unsplash](https://unsplash.com) used under the [Unsplash license](https://unsplash.com/license).
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(assets): add hero and cargo images, attributions"
```

---

## PHASE F — Секции

> Общий паттерн для каждой секции: (1) data-файл, если есть структура; (2) перенос разметки из `*.tsx` в scoped SCSS с токенами; (3) рендер dev и **скриншот-сверка** с оригиналом (десктоп + мобильный); (4) коммит. Тексты берутся ТОЛЬКО из `home.<section>.*`.

### Task 19: Hero

**Files:**

- Create: `src/routes/(site)/(home)/sections/Hero.svelte`

- [ ] **Step 1: Реализация** (перенос из `HeroSection.tsx`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import { smoothScrollToId } from '@/lib/utils/scroll';
	import Button from '@/components/ui/Button.svelte';
</script>

<section class="hero">
	<div class="container hero__grid">
		<div class="hero__content">
			<div class="hero__badge">
				<Icon icon="lucide:truck" width="20" height="20" />
				<span>{$_('home.hero.badge')}</span>
			</div>
			<h1 class="hero__heading">{$_('home.hero.heading')}</h1>
			<p class="hero__sub">{$_('home.hero.sub')}</p>

			<div class="hero__actions">
				<button class="hero__cta hero__cta--primary" onclick={() => smoothScrollToId('contact')}>
					{$_('home.hero.btnPrimary')}
				</button>
				<button class="hero__cta hero__cta--outline" onclick={() => smoothScrollToId('contact')}>
					<Icon icon="lucide:phone" width="20" height="20" />
					{$_('home.hero.btnSecondary')}
				</button>
			</div>
		</div>

		<div class="hero__media">
			<div class="hero__image-wrap">
				<img src="/images/hero-truck.jpg" alt={$_('home.hero.heading')} width="1080" height="720" />
				<div class="hero__overlay"></div>
			</div>
			<div class="hero__stats">
				<div>
					<div class="hero__stat-v">{$_('home.hero.stat1v')}</div>
					<div class="hero__stat-l">{$_('home.hero.stat1l')}</div>
				</div>
				<div>
					<div class="hero__stat-v">{$_('home.hero.stat2v')}</div>
					<div class="hero__stat-l">{$_('home.hero.stat2l')}</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.hero {
		background: var(--white);
		padding: 80px 0 64px;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 48px;
			align-items: center;
		}

		&__badge {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 8px 16px;
			border-radius: var(--radius-full);
			background: rgba(255, 193, 7, 0.1);
			font-size: 14px;
			font-weight: 500;
			color: var(--gray-700);

			:global(svg) {
				color: var(--brand);
			}
		}

		&__heading {
			font-size: 36px;
			font-weight: 700;
			color: var(--gray-900);
			line-height: 1.1;
			margin: 16px 0;
		}

		&__sub {
			font-size: 18px;
			color: var(--gray-600);
			line-height: 1.625;
		}

		&__actions {
			display: flex;
			flex-direction: column;
			gap: 16px;
			margin-top: 32px;
		}

		&__cta {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
			font-size: 18px;
			font-weight: 500;
			padding: 16px 32px;
			border-radius: var(--radius-2xl);
			border: none;
			transition: all 0.3s ease;

			&--primary {
				background: var(--brand);
				color: var(--gray-900);
				box-shadow: var(--shadow-lg);

				&:hover {
					background: var(--brand-hover);
					box-shadow: var(--shadow-xl);
				}
			}

			&--outline {
				background: transparent;
				color: var(--gray-900);
				border: 2px solid var(--gray-300);

				&:hover {
					border-color: var(--brand);
				}
			}
		}

		&__media {
			position: relative;
		}

		&__image-wrap {
			position: relative;
			border-radius: var(--radius-3xl);
			overflow: hidden;
			box-shadow: var(--shadow-2xl);

			img {
				display: block;
				width: 100%;
				height: 400px;
				object-fit: cover;
			}
		}

		&__overlay {
			position: absolute;
			inset: 0;
			background: linear-gradient(to top, rgba(17, 24, 39, 0.2), transparent);
		}

		&__stats {
			position: absolute;
			left: 32px;
			right: 32px;
			bottom: -32px;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 16px;
			padding: 24px;
			background: var(--white);
			border-radius: var(--radius-2xl);
			box-shadow: var(--shadow-xl);
		}

		&__stat-v {
			font-size: 30px;
			font-weight: 700;
			color: var(--brand);
		}

		&__stat-l {
			font-size: 14px;
			color: var(--gray-600);
		}

		@media (min-width: 768px) {
			padding: 112px 0 96px;

			&__heading {
				font-size: 48px;
			}
			&__sub {
				font-size: 20px;
			}
			&__actions {
				flex-direction: row;
			}
			&__image-wrap img {
				height: 500px;
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: 1fr 1fr;
			}
			&__heading {
				font-size: 60px;
			}
		}
	}
</style>
```

- [ ] **Step 2: Подключить временно для проверки** — в `+page.svelte` добавить `<Hero />` (импорт + рендер), запустить `bun run dev`.

- [ ] **Step 3: Скриншот-сверка** — снять оригинал (Hero) и нашу версию на 1280px и 390px, сравнить. Откорректировать значения SCSS до совпадения.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add Hero section"
```

---

### Task 20: About

**Files:**

- Create: `src/lib/data/about.ts`, `src/routes/(site)/(home)/sections/About.svelte`

- [ ] **Step 1: Записать `src/lib/data/about.ts`**

```ts
export interface AboutStat {
	icon: string;
	bg: string;
	valueKey: string;
	labelKey: string;
}

export const aboutStats: AboutStat[] = [
	{
		icon: 'lucide:trending-up',
		bg: 'var(--brand)',
		valueKey: 'home.about.stat1v',
		labelKey: 'home.about.stat1l'
	},
	{
		icon: 'lucide:map-pin',
		bg: 'var(--accent-blue)',
		valueKey: 'home.about.stat2v',
		labelKey: 'home.about.stat2l'
	},
	{
		icon: 'lucide:clock',
		bg: 'var(--accent-green)',
		valueKey: 'home.about.stat3v',
		labelKey: 'home.about.stat3l'
	},
	{
		icon: 'lucide:weight',
		bg: 'var(--accent-purple)',
		valueKey: 'home.about.stat4v',
		labelKey: 'home.about.stat4l'
	}
];
```

- [ ] **Step 2: Реализация** (перенос из `AboutSection.tsx`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import IconBox from '@/components/ui/IconBox.svelte';
	import { aboutStats } from '@/lib/data/about';
</script>

<section class="about">
	<div class="container">
		<SectionHeading
			title={$_('home.about.h2')}
			subtitle={$_('home.about.sub')}
			subtitleMaxWidth={768}
		/>
		<div class="about__grid">
			{#each aboutStats as stat}
				<div class="about__card">
					<IconBox icon={stat.icon} bg={stat.bg} iconColor="var(--white)" size={56} />
					<div class="about__value">{$_(stat.valueKey)}</div>
					<div class="about__label">{$_(stat.labelKey)}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.about {
		background: var(--gray-50);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			background: var(--white);
			border-radius: var(--radius-2xl);
			padding: 24px;
			box-shadow: var(--shadow-lg);
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-xl);
				transform: translateY(-4px);
			}

			:global(.icon-box) {
				margin-bottom: 16px;
			}
		}

		&__value {
			font-size: 30px;
			font-weight: 700;
			color: var(--gray-900);
			margin-bottom: 4px;
		}

		&__label {
			color: var(--gray-600);
		}

		@media (min-width: 768px) {
			padding: 96px 0;
			&__grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: repeat(4, 1fr);
			}
		}
	}
</style>
```

- [ ] **Step 3: Скриншот-сверка** (десктоп + мобильный), корректировка.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add About section"
```

---

### Task 21: Services

**Files:**

- Create: `src/lib/data/services.ts`, `src/routes/(site)/(home)/sections/Services.svelte`

- [ ] **Step 1: Записать `src/lib/data/services.ts`**

```ts
export interface ServiceItem {
	icon: string;
	titleKey: string;
	descKey: string;
}

export const services: ServiceItem[] = [
	{ icon: 'lucide:armchair', titleKey: 'home.services.s1t', descKey: 'home.services.s1d' },
	{ icon: 'lucide:hammer', titleKey: 'home.services.s2t', descKey: 'home.services.s2d' },
	{
		icon: 'lucide:monitor-smartphone',
		titleKey: 'home.services.s3t',
		descKey: 'home.services.s3d'
	},
	{ icon: 'lucide:store', titleKey: 'home.services.s4t', descKey: 'home.services.s4d' },
	{ icon: 'lucide:navigation', titleKey: 'home.services.s5t', descKey: 'home.services.s5d' },
	{ icon: 'lucide:zap', titleKey: 'home.services.s6t', descKey: 'home.services.s6d' }
];
```

- [ ] **Step 2: Реализация** (перенос из `ServicesSection.tsx`, `id="services"`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import IconBox from '@/components/ui/IconBox.svelte';
	import { services } from '@/lib/data/services';
</script>

<section id="services" class="services">
	<div class="container">
		<SectionHeading title={$_('home.services.h2')} subtitle={$_('home.services.sub')} />
		<div class="services__grid">
			{#each services as item}
				<div class="services__card">
					<IconBox icon={item.icon} bg="var(--brand)" iconColor="var(--gray-900)" size={56} />
					<h3>{$_(item.titleKey)}</h3>
					<p>{$_(item.descKey)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.services {
		background: var(--white);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			background: var(--gray-50);
			border: 1px solid var(--gray-100);
			border-radius: var(--radius-2xl);
			padding: 24px;
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-xl);
				transform: translateY(-4px);
				border-color: var(--brand);
			}

			:global(.icon-box) {
				margin-bottom: 16px;
			}

			h3 {
				font-size: 20px;
				font-weight: 700;
				color: var(--gray-900);
				margin-bottom: 8px;
			}

			p {
				color: var(--gray-600);
				line-height: 1.625;
			}
		}

		@media (min-width: 768px) {
			padding: 96px 0;
			&__grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: repeat(3, 1fr);
			}
		}
	}
</style>
```

- [ ] **Step 3: Скриншот-сверка**, корректировка.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add Services section"
```

---

### Task 22: Regions

**Files:**

- Create: `src/lib/data/regions.ts`, `src/routes/(site)/(home)/sections/Regions.svelte`

- [ ] **Step 1: Записать `src/lib/data/regions.ts`**

```ts
export interface RegionItem {
	nameKey: string;
	bg: string;
}

export const regions: RegionItem[] = [
	{ nameKey: 'home.regions.r1', bg: 'var(--brand)' },
	{ nameKey: 'home.regions.r2', bg: 'var(--accent-blue)' },
	{ nameKey: 'home.regions.r3', bg: 'var(--accent-green)' },
	{ nameKey: 'home.regions.r4', bg: 'var(--accent-purple)' },
	{ nameKey: 'home.regions.r5', bg: 'var(--accent-pink)' },
	{ nameKey: 'home.regions.r6', bg: 'var(--accent-indigo)' },
	{ nameKey: 'home.regions.r7', bg: 'var(--accent-orange)' },
	{ nameKey: 'home.regions.r8', bg: 'var(--accent-cyan)' }
];
```

- [ ] **Step 2: Реализация** (перенос из `RegionsSection.tsx`, `id="regions"`; нижний блок — серый плейсхолдер карты, как в оригинале)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import IconBox from '@/components/ui/IconBox.svelte';
	import { regions } from '@/lib/data/regions';
</script>

<section id="regions" class="regions">
	<div class="container">
		<SectionHeading title={$_('home.regions.h2')} subtitle={$_('home.regions.sub')} />
		<div class="regions__grid">
			{#each regions as region}
				<div class="regions__card">
					<IconBox
						icon="lucide:map-pin"
						bg={region.bg}
						iconColor="var(--white)"
						size={48}
						hoverScale
					/>
					<div class="regions__name">{$_(region.nameKey)}</div>
				</div>
			{/each}
		</div>

		<div class="regions__map">
			<div class="regions__map-inner">
				<Icon icon="lucide:map-pin" width="64" height="64" />
				<p class="regions__map-title">{$_('home.regions.mapTitle')}</p>
				<p class="regions__map-sub">{$_('home.regions.mapSub')}</p>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.regions {
		background: var(--gray-50);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 16px;
			margin-bottom: 48px;
		}

		&__card {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			background: var(--white);
			border-radius: var(--radius-2xl);
			padding: 24px;
			box-shadow: var(--shadow-lg);
			cursor: pointer;
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-xl);
				transform: translateY(-4px);

				:global(.icon-box--hover) {
					transform: scale(1.1);
				}
			}

			:global(.icon-box) {
				margin-bottom: 12px;
			}
		}

		&__name {
			font-weight: 600;
			color: var(--gray-900);
		}

		&__map {
			background: var(--white);
			border-radius: var(--radius-3xl);
			box-shadow: var(--shadow-xl);
			overflow: hidden;
		}

		&__map-inner {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 400px;
			background: linear-gradient(to bottom right, var(--gray-100), var(--gray-200));
			text-align: center;

			:global(svg) {
				color: var(--brand);
				margin-bottom: 16px;
			}
		}

		&__map-title {
			font-weight: 500;
			color: var(--gray-600);
		}

		&__map-sub {
			font-size: 14px;
			color: var(--gray-500);
			margin-top: 8px;
		}

		@media (min-width: 768px) {
			padding: 96px 0;
			&__grid {
				grid-template-columns: repeat(4, 1fr);
			}
		}
	}
</style>
```

- [ ] **Step 3: Скриншот-сверка**, корректировка.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add Regions section"
```

---

### Task 23: CargoTypes

**Files:**

- Create: `src/lib/data/cargoTypes.ts`, `src/routes/(site)/(home)/sections/CargoTypes.svelte`

- [ ] **Step 1: Записать `src/lib/data/cargoTypes.ts`**

```ts
export interface CargoType {
	image: string;
	titleKey: string;
	descKey: string;
}

export const cargoTypes: CargoType[] = [
	{ image: '/images/cargo-furniture.jpg', titleKey: 'home.cargo.c1t', descKey: 'home.cargo.c1d' },
	{ image: '/images/cargo-appliances.jpg', titleKey: 'home.cargo.c2t', descKey: 'home.cargo.c2d' },
	{
		image: '/images/cargo-construction.jpg',
		titleKey: 'home.cargo.c3t',
		descKey: 'home.cargo.c3d'
	},
	{ image: '/images/cargo-commercial.jpg', titleKey: 'home.cargo.c4t', descKey: 'home.cargo.c4d' },
	{ image: '/images/cargo-furniture.jpg', titleKey: 'home.cargo.c5t', descKey: 'home.cargo.c5d' },
	{ image: '/images/cargo-oversized.jpg', titleKey: 'home.cargo.c6t', descKey: 'home.cargo.c6d' }
];
```

- [ ] **Step 2: Реализация** (перенос из `CargoTypesSection.tsx`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { cargoTypes } from '@/lib/data/cargoTypes';
</script>

<section class="cargo">
	<div class="container">
		<SectionHeading title={$_('home.cargo.h2')} subtitle={$_('home.cargo.sub')} />
		<div class="cargo__grid">
			{#each cargoTypes as item}
				<div class="cargo__card">
					<div class="cargo__media">
						<img
							src={item.image}
							alt={$_(item.titleKey)}
							loading="lazy"
							width="1080"
							height="720"
						/>
						<div class="cargo__overlay"></div>
						<h3 class="cargo__title">{$_(item.titleKey)}</h3>
					</div>
					<div class="cargo__body">
						<p>{$_(item.descKey)}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.cargo {
		background: var(--white);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			background: var(--white);
			border-radius: var(--radius-2xl);
			overflow: hidden;
			box-shadow: var(--shadow-lg);
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-2xl);
				transform: translateY(-4px);

				.cargo__media img {
					transform: scale(1.1);
				}
			}
		}

		&__media {
			position: relative;
			height: 192px;
			overflow: hidden;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				transition: transform 0.5s ease;
			}
		}

		&__overlay {
			position: absolute;
			inset: 0;
			background: linear-gradient(to top, rgba(17, 24, 39, 0.7), transparent);
		}

		&__title {
			position: absolute;
			left: 16px;
			right: 16px;
			bottom: 16px;
			font-size: 20px;
			font-weight: 700;
			color: var(--white);
		}

		&__body {
			padding: 24px;

			p {
				color: var(--gray-600);
			}
		}

		@media (min-width: 768px) {
			padding: 96px 0;
			&__grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: repeat(3, 1fr);
			}
		}
	}
</style>
```

- [ ] **Step 3: Скриншот-сверка**, корректировка.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add CargoTypes section"
```

---

### Task 24: Capacity

**Files:**

- Create: `src/lib/data/capacity.ts`, `src/routes/(site)/(home)/sections/Capacity.svelte`

- [ ] **Step 1: Записать `src/lib/data/capacity.ts`**

```ts
export interface CapacityTier {
	weightKey: string;
	vehicleKey: string;
	exampleKeys: string[];
	popular: boolean;
}

export const capacities: CapacityTier[] = [
	{
		weightKey: 'home.capacity.cap1w',
		vehicleKey: 'home.capacity.cap1v',
		exampleKeys: ['home.capacity.cap1e1', 'home.capacity.cap1e2', 'home.capacity.cap1e3'],
		popular: false
	},
	{
		weightKey: 'home.capacity.cap2w',
		vehicleKey: 'home.capacity.cap2v',
		exampleKeys: ['home.capacity.cap2e1', 'home.capacity.cap2e2', 'home.capacity.cap2e3'],
		popular: true
	},
	{
		weightKey: 'home.capacity.cap3w',
		vehicleKey: 'home.capacity.cap3v',
		exampleKeys: ['home.capacity.cap3e1', 'home.capacity.cap3e2', 'home.capacity.cap3e3'],
		popular: false
	},
	{
		weightKey: 'home.capacity.cap4w',
		vehicleKey: 'home.capacity.cap4v',
		exampleKeys: ['home.capacity.cap4e1', 'home.capacity.cap4e2', 'home.capacity.cap4e3'],
		popular: false
	},
	{
		weightKey: 'home.capacity.cap5w',
		vehicleKey: 'home.capacity.cap5v',
		exampleKeys: ['home.capacity.cap5e1', 'home.capacity.cap5e2', 'home.capacity.cap5e3'],
		popular: false
	}
];
```

- [ ] **Step 2: Реализация** (перенос из `CapacitySection.tsx`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { capacities } from '@/lib/data/capacity';
</script>

<section class="capacity">
	<div class="container">
		<SectionHeading title={$_('home.capacity.h2')} subtitle={$_('home.capacity.sub')} />
		<div class="capacity__grid">
			{#each capacities as tier}
				<div class="capacity__card" class:capacity__card--popular={tier.popular}>
					{#if tier.popular}
						<div class="capacity__badge">{$_('home.capacity.popular')}</div>
					{/if}
					<div class="capacity__head">
						<div class="capacity__icon">
							<Icon icon="lucide:truck" width="32" height="32" />
						</div>
						<div class="capacity__weight">{$_(tier.weightKey)}</div>
						<div class="capacity__vehicle">{$_(tier.vehicleKey)}</div>
					</div>
					<div class="capacity__list">
						{#each tier.exampleKeys as ex}
							<div class="capacity__row">
								<Icon icon="lucide:check" width="16" height="16" />
								<span>{$_(ex)}</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.capacity {
		background: var(--gray-50);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			position: relative;
			background: var(--white);
			border: 1px solid var(--gray-100);
			border-radius: var(--radius-2xl);
			padding: 24px;
			box-shadow: var(--shadow-lg);
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-2xl);
				transform: translateY(-4px);
			}

			&--popular {
				border: 2px solid var(--brand);
			}
		}

		&__badge {
			position: absolute;
			top: -12px;
			left: 50%;
			transform: translateX(-50%);
			background: var(--brand);
			color: var(--gray-900);
			padding: 4px 16px;
			border-radius: var(--radius-full);
			font-size: 14px;
			font-weight: 600;
		}

		&__head {
			text-align: center;
			margin-bottom: 24px;
		}

		&__icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 64px;
			height: 64px;
			margin: 0 auto 16px;
			background: var(--gray-100);
			border-radius: var(--radius-2xl);
			color: var(--brand);
		}

		&__weight {
			font-size: 24px;
			font-weight: 700;
			color: var(--gray-900);
			margin-bottom: 8px;
		}

		&__vehicle {
			font-size: 14px;
			color: var(--gray-500);
		}

		&__list {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		&__row {
			display: flex;
			align-items: flex-start;
			gap: 8px;
			font-size: 14px;
			color: var(--gray-600);

			:global(svg) {
				color: var(--brand);
				flex-shrink: 0;
				margin-top: 2px;
			}
		}

		@media (min-width: 768px) {
			padding: 96px 0;
			&__grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: repeat(3, 1fr);
			}
		}

		@media (min-width: 1280px) {
			&__grid {
				grid-template-columns: repeat(5, 1fr);
			}
		}
	}
</style>
```

- [ ] **Step 3: Скриншот-сверка**, корректировка.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add Capacity section"
```

---

### Task 25: WhyChooseUs

**Files:**

- Create: `src/lib/data/whyChooseUs.ts`, `src/routes/(site)/(home)/sections/WhyChooseUs.svelte`

- [ ] **Step 1: Записать `src/lib/data/whyChooseUs.ts`**

```ts
export interface Feature {
	icon: string;
	titleKey: string;
	descKey: string;
}

export const features: Feature[] = [
	{ icon: 'lucide:shield', titleKey: 'home.why.w1t', descKey: 'home.why.w1d' },
	{ icon: 'lucide:truck', titleKey: 'home.why.w2t', descKey: 'home.why.w2d' },
	{ icon: 'lucide:map', titleKey: 'home.why.w3t', descKey: 'home.why.w3d' },
	{ icon: 'lucide:users', titleKey: 'home.why.w4t', descKey: 'home.why.w4d' },
	{ icon: 'lucide:eye', titleKey: 'home.why.w5t', descKey: 'home.why.w5d' },
	{ icon: 'lucide:headphones', titleKey: 'home.why.w6t', descKey: 'home.why.w6d' }
];
```

- [ ] **Step 2: Реализация** (перенос из `WhyChooseUsSection.tsx`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import IconBox from '@/components/ui/IconBox.svelte';
	import { features } from '@/lib/data/whyChooseUs';
</script>

<section class="why">
	<div class="container">
		<SectionHeading title={$_('home.why.h2')} subtitle={$_('home.why.sub')} />
		<div class="why__grid">
			{#each features as feature}
				<div class="why__card">
					<IconBox icon={feature.icon} bg="var(--brand)" iconColor="var(--gray-900)" size={56} />
					<h3>{$_(feature.titleKey)}</h3>
					<p>{$_(feature.descKey)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.why {
		background: var(--white);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			background: linear-gradient(to bottom right, var(--gray-50), var(--white));
			border: 1px solid var(--gray-100);
			border-radius: var(--radius-2xl);
			padding: 24px;
			transition: all 0.3s ease;

			&:hover {
				border-color: var(--brand);
				box-shadow: var(--shadow-xl);
			}

			:global(.icon-box) {
				margin-bottom: 16px;
			}

			h3 {
				font-size: 20px;
				font-weight: 700;
				color: var(--gray-900);
				margin-bottom: 8px;
			}

			p {
				color: var(--gray-600);
				line-height: 1.625;
			}
		}

		@media (min-width: 768px) {
			padding: 96px 0;
			&__grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: repeat(3, 1fr);
			}
		}
	}
</style>
```

- [ ] **Step 3: Скриншот-сверка**, корректировка.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add WhyChooseUs section"
```

---

### Task 26: Reviews (+ компонентный тест)

**Files:**

- Create: `src/lib/data/reviews.ts`, `src/routes/(site)/(home)/sections/Reviews.svelte`
- Test: `src/routes/(site)/(home)/sections/Reviews.test.ts`

- [ ] **Step 1: Записать `src/lib/data/reviews.ts`**

```ts
export interface Review {
	nameKey: string;
	roleKey: string;
	textKey: string;
	dateKey: string;
	rating: number;
}

export const reviews: Review[] = [
	{
		nameKey: 'home.reviews.r1name',
		roleKey: 'home.reviews.r1role',
		textKey: 'home.reviews.r1text',
		dateKey: 'home.reviews.r1date',
		rating: 5
	},
	{
		nameKey: 'home.reviews.r2name',
		roleKey: 'home.reviews.r2role',
		textKey: 'home.reviews.r2text',
		dateKey: 'home.reviews.r2date',
		rating: 5
	},
	{
		nameKey: 'home.reviews.r3name',
		roleKey: 'home.reviews.r3role',
		textKey: 'home.reviews.r3text',
		dateKey: 'home.reviews.r3date',
		rating: 5
	},
	{
		nameKey: 'home.reviews.r4name',
		roleKey: 'home.reviews.r4role',
		textKey: 'home.reviews.r4text',
		dateKey: 'home.reviews.r4date',
		rating: 5
	}
];
```

- [ ] **Step 2: Написать падающий компонентный тест**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { init, addMessages } from 'svelte-i18n';
import ru from '@/lib/i18n/locales/ru.json';
import Reviews from '@/routes/(site)/(home)/sections/Reviews.svelte';

beforeEach(() => {
	addMessages('ru', ru);
	init({ fallbackLocale: 'ru', initialLocale: 'ru' });
});

describe('Reviews carousel', () => {
	it('по умолчанию показывает первый отзыв', () => {
		render(Reviews);
		expect(screen.getByText('Азамат Кадыров')).toBeInTheDocument();
	});

	it('кнопка "вперёд" показывает второй отзыв', async () => {
		render(Reviews);
		await fireEvent.click(screen.getByLabelText('Next review'));
		expect(screen.getByText('Гульнара Садыкова')).toBeInTheDocument();
	});

	it('кнопка "назад" с первого заворачивает на последний', async () => {
		render(Reviews);
		await fireEvent.click(screen.getByLabelText('Previous review'));
		expect(screen.getByText('Нурбек Токтогулов')).toBeInTheDocument();
	});
});
```

- [ ] **Step 3: Запустить тест — должен упасть**

Run: `bun run test "src/routes/(site)/(home)/sections/Reviews.test.ts"`
Expected: FAIL.

- [ ] **Step 4: Реализация** (перенос из `ReviewsSection.tsx`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { reviews } from '@/lib/data/reviews';
	import { nextIndex, prevIndex } from '@/lib/utils/carousel';

	let current = $state(0);
	const review = $derived(reviews[current]);

	const next = (): void => {
		current = nextIndex(current, reviews.length);
	};
	const prev = (): void => {
		current = prevIndex(current, reviews.length);
	};
</script>

<section class="reviews">
	<div class="container">
		<SectionHeading title={$_('home.reviews.h2')} subtitle={$_('home.reviews.sub')} />
		<div class="reviews__stage">
			<div class="reviews__card">
				<button class="reviews__nav reviews__nav--prev" aria-label="Previous review" onclick={prev}>
					<Icon icon="lucide:chevron-left" width="24" height="24" />
				</button>
				<button class="reviews__nav reviews__nav--next" aria-label="Next review" onclick={next}>
					<Icon icon="lucide:chevron-right" width="24" height="24" />
				</button>

				<div class="reviews__content">
					<div class="reviews__stars">
						{#each Array(review.rating) as _star}
							<Icon icon="lucide:star" width="24" height="24" />
						{/each}
					</div>
					<p class="reviews__text">"{$_(review.textKey)}"</p>
					<div class="reviews__name">{$_(review.nameKey)}</div>
					<div class="reviews__role">{$_(review.roleKey)}</div>
					<div class="reviews__date">{$_(review.dateKey)}</div>
				</div>

				<div class="reviews__dots">
					{#each reviews as _r, i}
						<button
							class="reviews__dot"
							class:reviews__dot--active={i === current}
							aria-label="Go to review {i + 1}"
							onclick={() => (current = i)}
						></button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.reviews {
		background: var(--gray-50);
		padding: 64px 0;

		&__stage {
			max-width: var(--container-4xl);
			margin: 0 auto;
		}

		&__card {
			position: relative;
			background: var(--white);
			border-radius: var(--radius-3xl);
			box-shadow: var(--shadow-xl);
			padding: 32px;
		}

		&__nav {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			display: inline-flex;
			padding: 12px;
			background: var(--white);
			border: 1px solid var(--gray-200);
			border-radius: var(--radius-full);
			box-shadow: var(--shadow-lg);
			color: var(--gray-700);
			transition: all 0.3s ease;

			&:hover {
				background: var(--gray-50);
				border-color: var(--brand);
			}

			&--prev {
				left: 16px;
			}
			&--next {
				right: 16px;
			}
		}

		&__content {
			text-align: center;
			margin-bottom: 24px;
		}

		&__stars {
			display: flex;
			justify-content: center;
			gap: 4px;
			margin-bottom: 16px;
			color: var(--brand);

			:global(svg) {
				fill: var(--brand);
			}
		}

		&__text {
			font-size: 18px;
			font-style: italic;
			color: var(--gray-700);
			line-height: 1.625;
			margin-bottom: 24px;
		}

		&__name {
			font-size: 18px;
			font-weight: 700;
			color: var(--gray-900);
		}

		&__role {
			color: var(--gray-600);
		}

		&__date {
			font-size: 14px;
			color: var(--gray-500);
			margin-top: 4px;
		}

		&__dots {
			display: flex;
			justify-content: center;
			gap: 8px;
			margin-top: 32px;
		}

		&__dot {
			width: 8px;
			height: 8px;
			border: none;
			border-radius: var(--radius-full);
			background: var(--gray-300);
			transition: all 0.3s ease;

			&--active {
				width: 32px;
				background: var(--brand);
			}
		}

		@media (min-width: 768px) {
			padding: 96px 0;

			&__card {
				padding: 48px;
			}
			&__text {
				font-size: 20px;
			}
		}
	}
</style>
```

- [ ] **Step 5: Запустить тест — должен пройти**

Run: `bun run test "src/routes/(site)/(home)/sections/Reviews.test.ts"`
Expected: PASS (3 теста).

- [ ] **Step 6: Скриншот-сверка**, корректировка.

- [ ] **Step 7: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add Reviews carousel section"
```

---

### Task 27: Faq

**Files:**

- Create: `src/lib/data/faq.ts`, `src/routes/(site)/(home)/sections/Faq.svelte`

- [ ] **Step 1: Записать `src/lib/data/faq.ts`**

```ts
export interface FaqEntry {
	id: string;
	questionKey: string;
	answerKey: string;
}

export const faqEntries: FaqEntry[] = [
	{ id: 'q1', questionKey: 'home.faq.q1', answerKey: 'home.faq.a1' },
	{ id: 'q2', questionKey: 'home.faq.q2', answerKey: 'home.faq.a2' },
	{ id: 'q3', questionKey: 'home.faq.q3', answerKey: 'home.faq.a3' },
	{ id: 'q4', questionKey: 'home.faq.q4', answerKey: 'home.faq.a4' },
	{ id: 'q5', questionKey: 'home.faq.q5', answerKey: 'home.faq.a5' }
];
```

- [ ] **Step 2: Реализация** (использует `Accordion`; `max-w-4xl`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import Accordion from '@/components/ui/Accordion.svelte';
	import { faqEntries } from '@/lib/data/faq';

	const items = $derived(
		faqEntries.map((e) => ({ id: e.id, question: $_(e.questionKey), answer: $_(e.answerKey) }))
	);
</script>

<section class="faq">
	<div class="container faq__inner">
		<SectionHeading title={$_('home.faq.h2')} subtitle={$_('home.faq.sub')} />
		<Accordion {items} />
	</div>
</section>

<style lang="scss">
	.faq {
		background: var(--white);
		padding: 64px 0;

		&__inner {
			max-width: var(--container-4xl);
		}

		@media (min-width: 768px) {
			padding: 96px 0;
		}
	}
</style>
```

- [ ] **Step 3: Скриншот-сверка**, корректировка.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add FAQ section"
```

---

### Task 28: Contact

**Files:**

- Create: `src/lib/data/contact.ts`, `src/routes/(site)/(home)/sections/Contact.svelte`

- [ ] **Step 1: Записать `src/lib/data/contact.ts`** (структура инфо-карточек; значения берутся из `site.ts`/i18n)

```ts
export interface ContactCard {
	icon: string;
	bg: string;
	iconColor: string;
	titleKey: string;
}

export const contactCards: ContactCard[] = [
	{
		icon: 'lucide:phone',
		bg: 'var(--brand)',
		iconColor: 'var(--gray-900)',
		titleKey: 'home.contact.phoneTitle'
	},
	{
		icon: 'lucide:mail',
		bg: 'var(--accent-blue)',
		iconColor: 'var(--white)',
		titleKey: 'home.contact.emailTitle'
	},
	{
		icon: 'lucide:map-pin',
		bg: 'var(--accent-purple)',
		iconColor: 'var(--white)',
		titleKey: 'home.contact.addressTitle'
	},
	{
		icon: 'lucide:clock',
		bg: 'var(--accent-green)',
		iconColor: 'var(--white)',
		titleKey: 'home.contact.hoursTitle'
	}
];
```

- [ ] **Step 2: Реализация** (перенос из `ContactSection.tsx`, `id="contact"`; карта-плейсхолдер заменена на `YandexMap`; WhatsApp-карточка — отдельный блок с inline SVG)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import IconBox from '@/components/ui/IconBox.svelte';
	import YandexMap from '@/components/ui/YandexMap.svelte';
	import { site } from '@/lib/config/site';
	import { telHref, waHref } from '@/lib/utils/contact';
</script>

<section id="contact" class="contact">
	<div class="container">
		<div class="contact__head">
			<h2>{$_('home.contact.h2')}</h2>
			<p>{$_('home.contact.sub')}</p>
		</div>

		<div class="contact__grid">
			<div class="contact__cards">
				<!-- Телефон -->
				<div class="contact__card">
					<IconBox icon="lucide:phone" bg="var(--brand)" iconColor="var(--gray-900)" size={48} />
					<div>
						<h3>{$_('home.contact.phoneTitle')}</h3>
						{#each site.phones as phone}
							<a class="contact__link contact__link--brand" href={telHref(phone)}>{phone}</a>
						{/each}
					</div>
				</div>

				<!-- WhatsApp -->
				<div class="contact__card">
					<div class="contact__wa-icon">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
							/>
						</svg>
					</div>
					<div>
						<h3>{$_('home.contact.whatsappTitle')}</h3>
						<a
							class="contact__link contact__link--wa"
							href={waHref(site.whatsapp)}
							target="_blank"
							rel="noopener noreferrer"
						>
							{site.phones[0]}
						</a>
						<p class="contact__note">{$_('home.contact.whatsappNote')}</p>
					</div>
				</div>

				<!-- Email -->
				<div class="contact__card">
					<IconBox icon="lucide:mail" bg="var(--accent-blue)" iconColor="var(--white)" size={48} />
					<div>
						<h3>{$_('home.contact.emailTitle')}</h3>
						<a class="contact__link contact__link--blue" href="mailto:{site.email}">{site.email}</a>
					</div>
				</div>

				<!-- Адрес -->
				<div class="contact__card">
					<IconBox
						icon="lucide:map-pin"
						bg="var(--accent-purple)"
						iconColor="var(--white)"
						size={48}
					/>
					<div>
						<h3>{$_('home.contact.addressTitle')}</h3>
						<p class="contact__multiline">{site.address}</p>
					</div>
				</div>

				<!-- Режим работы -->
				<div class="contact__card">
					<IconBox
						icon="lucide:clock"
						bg="var(--accent-green)"
						iconColor="var(--white)"
						size={48}
					/>
					<div>
						<h3>{$_('home.contact.hoursTitle')}</h3>
						<p class="contact__multiline">{$_('home.contact.hoursValue')}</p>
					</div>
				</div>
			</div>

			<div class="contact__map">
				<YandexMap src={site.map.src} title={site.map.title} />
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.contact {
		background: var(--gray-50);
		padding: 64px 0;

		&__head {
			text-align: center;
			margin-bottom: 48px;

			h2 {
				font-size: 30px;
				font-weight: 700;
				color: var(--gray-900);
				margin-bottom: 16px;
			}

			p {
				font-size: 18px;
				color: var(--gray-600);
			}
		}

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 32px;
		}

		&__cards {
			display: flex;
			flex-direction: column;
			gap: 24px;
		}

		&__card {
			display: flex;
			align-items: flex-start;
			gap: 16px;
			background: var(--white);
			border-radius: var(--radius-2xl);
			padding: 24px;
			box-shadow: var(--shadow-lg);
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-xl);
			}

			h3 {
				font-weight: 600;
				color: var(--gray-900);
				margin-bottom: 8px;
			}
		}

		&__wa-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			width: 48px;
			height: 48px;
			border-radius: var(--radius-xl);
			background: var(--whatsapp);
			color: var(--white);
		}

		&__link {
			display: block;
			font-size: 18px;

			&--brand {
				color: var(--brand);
			}
			&--wa {
				color: var(--whatsapp);
			}
			&--blue {
				color: var(--accent-blue);
			}

			&:hover {
				text-decoration: underline;
			}
		}

		&__note {
			font-size: 14px;
			color: var(--gray-500);
			margin-top: 4px;
		}

		&__multiline {
			color: var(--gray-600);
			white-space: pre-line;
		}

		&__map {
			background: var(--white);
			border-radius: var(--radius-3xl);
			box-shadow: var(--shadow-xl);
			overflow: hidden;
			min-height: 400px;
		}

		@media (min-width: 768px) {
			padding: 96px 0;

			&__head h2 {
				font-size: 36px;
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}
	}
</style>
```

- [ ] **Step 3: Скриншот-сверка** + проверить, что карта Яндекс грузится при прокрутке к секции.

- [ ] **Step 4: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): add Contact section with lazy Yandex map"
```

---

### Task 29: Сборка страницы (порядок секций)

**Files:**

- Modify: `src/routes/(site)/(home)/+page.svelte`

- [ ] **Step 1: Заменить тело `+page.svelte`** на полный порядок секций (как в `App.tsx`)

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Hero from './sections/Hero.svelte';
	import About from './sections/About.svelte';
	import Services from './sections/Services.svelte';
	import Regions from './sections/Regions.svelte';
	import CargoTypes from './sections/CargoTypes.svelte';
	import Capacity from './sections/Capacity.svelte';
	import WhyChooseUs from './sections/WhyChooseUs.svelte';
	import Reviews from './sections/Reviews.svelte';
	import Faq from './sections/Faq.svelte';
	import Contact from './sections/Contact.svelte';
</script>

<svelte:head>
	<title>{$_('home.meta.title')}</title>
	<meta name="description" content={$_('home.meta.description')} />
	<meta name="keywords" content={$_('home.meta.keywords')} />
	<meta property="og:title" content={$_('home.meta.ogTitle')} />
	<meta property="og:description" content={$_('home.meta.ogDescription')} />
</svelte:head>

<Hero />
<About />
<Services />
<Regions />
<CargoTypes />
<Capacity />
<WhyChooseUs />
<Reviews />
<Faq />
<Contact />
```

- [ ] **Step 2: Запустить dev и пройти всю страницу сверху вниз**

Run: `bun run dev`
Expected: все 10 секций в правильном порядке, навигация по якорям (services/regions/contact) работает, нет ошибок в консоли.

- [ ] **Step 3: Commit**

```bash
bun run format
git add -A
git commit -m "feat(home): assemble all sections on home page"
```

---

## PHASE G — Проверка

### Task 30: Smoke e2e (Playwright)

**Files:**

- Create: `e2e/smoke.spec.ts`

- [ ] **Step 1: Установить браузеры Playwright**

Run: `bunx playwright install chromium`

- [ ] **Step 2: Записать `e2e/smoke.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('главная грузится и показывает ключевые секции', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/Грузоперевозки по Кыргызстану/);
	await expect(
		page.getByRole('heading', { name: 'Грузоперевозки по всему Кыргызстану' })
	).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Наши услуги' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Контакты', exact: true })).toBeVisible();
});

test('якорная навигация ведёт к секции услуг', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Услуги' }).first().click();
	await expect(page.locator('#services')).toBeInViewport();
});

test('есть ссылка на WhatsApp', async ({ page }) => {
	await page.goto('/');
	const wa = page.getByRole('link', { name: 'Contact us on WhatsApp' });
	await expect(wa).toHaveAttribute('href', /wa\.me\/996555123456/);
});
```

- [ ] **Step 3: Запустить e2e**

Run: `bun run test:e2e`
Expected: 3 теста PASS (Playwright сам соберёт и поднимет preview).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test(e2e): add smoke test for home page"
```

---

### Task 31: Финальная проверка и сверка

- [ ] **Step 1: Прогнать все unit/компонентные тесты**

Run: `bun run test`
Expected: все зелёные (carousel, contact, scroll, lazyIframe, Accordion, Header, Reviews).

- [ ] **Step 2: Проверка типов**

Run: `bun run check`
Expected: 0 ошибок, 0 предупреждений.

- [ ] **Step 3: Прод-сборка и preview**

Run: `bun run build && bun run preview`
Expected: сборка без ошибок; в `.svelte-kit`/выводе адаптера присутствует prerender главной (`index.html`).

- [ ] **Step 4: Полная скриншот-сверка с оригиналом**

Запустить оригинал (`gruzoperevozki`) и наш preview. Снять полностраничные скриншоты на 1280px и 390px, сравнить секцию за секцией. Зафиксировать и устранить расхождения по цвету/отступам/радиусам.

- [ ] **Step 5: Финальный коммит**

```bash
git add -A
git commit -m "chore: final verification (types, tests, build, visual parity)"
```

---

## Self-Review (выполнено автором плана)

**Покрытие спецификации:** все 13 решений и 11 секций имеют задачи (Tasks 1–31). Карта Яндекс — Task 28; плейсхолдер «Регионов» сохранён (Task 22); единый источник правды — `ru.json` (Task 3), `site.ts` (Task 4), `lib/data/*` (по секциям). Тесты: unit (5–8), компонентные (12, 14, 26), e2e (30). Сверка дизайна — шаги в каждой секции + Task 31.

**Плейсхолдеры:** запрещённых заглушек нет; код приведён полностью. Точные значения серых уточняются в Task 2/сверке (это исполняемый шаг с инструментом, не заглушка). Временный закомментированный импорт `@/lib/icons` явно описан (Task 3 → раскомментировать в Task 9).

**Согласованность типов:** сигнатуры `nextIndex/prevIndex`, `telHref/waHref`, `smoothScrollToId/scrollToTop`, `lazyIframe`, пропсы `IconBox/SectionHeading/Button/Accordion/YandexMap` совпадают между определением и использованием во всех секциях.
