# Cargo KG — порт лендинга на SvelteKit (архитектура dentapp_front_crm)

**Дата:** 2026-06-13
**Статус:** утверждён, готов к написанию плана реализации
**Тип:** greenfield-проект (порт дизайна)

---

## 1. Цель

Создать **точную визуальную копию** лендинга `gruzoperevozki` («Cargo KG» — грузоперевозки по Кыргызстану), реализованную на **SvelteKit 2 + Svelte 5 (runes)** с использованием конвенций и публичной части архитектуры проекта `dentapp_front_crm`.

Источник дизайна (`isi/gruzoperevozki`) — экспорт из Figma Make: React 18 + Vite + Tailwind v4 + Radix/shadcn + lucide-react. Это одностраничный статичный маркетинговый сайт. Мы переносим **дизайн и контент**, но не код: верстку реализуем заново на Svelte по конвенциям dentapp.

### Критерий успеха

Страница визуально неотличима от оригинала на десктопе и мобильном (поэтапная скриншот-сверка), весь интерактив работает, проект собирается, тесты зелёные, `svelte-check` без ошибок.

---

## 2. Принятые решения (из brainstorming)

| #   | Решение           | Выбор                                                                                                               |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | Система стилей    | **Scoped SCSS** + CSS custom properties (без Tailwind), `postcss-pxtorem`                                           |
| 2   | Объём архитектуры | **Lean-слайс**: конвенции + публичная структура dentapp; без API/auth/query/charts                                  |
| 3   | Палитра           | **CSS-токены** в `app.css` (единый источник цвета)                                                                  |
| 4   | Локализация       | **svelte-i18n**, только `ru`, namespace `home.*`                                                                    |
| 5   | Контент/контакты  | **Заглушки 1:1** из источника; технические значения — в `lib/config/site.ts`                                        |
| 6   | CTA/форма         | **Как в дизайне** — рабочей формы нет, кнопки плавно скроллят к `#contact`                                          |
| 7   | Карта             | **Реальная карта Яндекс** (lazy iframe) вместо серого плейсхолдера — единственное отклонение от оригинала           |
| 8   | Тесты             | **Сбалансированная пирамида**: unit (vitest) + компонентные (@testing-library/svelte) + один smoke-e2e (Playwright) |
| 9   | TDD               | **Прагматичный**: строгий TDD для чистой логики; тест сразу после реализации для визуальных компонентов             |
| 10  | Сверка дизайна    | **Поэтапная скриншот-сверка** оригинала и Svelte-версии (chrome-devtools)                                           |
| 11  | Скелет/локация    | `isi/cargo-kg`, пакетный менеджер **bun**                                                                           |
| 12  | Изображения       | **Скачать локально** в `static/images/` (6 шт.), сохранить `ATTRIBUTIONS.md`                                        |
| 13  | Адаптер           | **`adapter-auto`** + полный `prerender` (статичный вывод, деплой на любую платформу)                                |

### Сквозной принцип: единый источник правды

- **Текст** — только в `src/lib/i18n/locales/ru.json`.
- **Контакты/ссылки/бренд** — только в `src/lib/config/site.ts`.
- **Структура секций** (иконки, цвета, число карточек, href, изображения) — только в `src/lib/data/*`.
- **Цвета/радиусы/брейкпоинты** — только в токенах (`app.css`) / SCSS-переменных.
- Ни одно значение не дублируется между файлами.

---

## 3. Технологический стек и конвенции

| Слой              | Технология                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| Фреймворк         | SvelteKit 2, Svelte 5 (**runes**: `$props`, `$state`, `$derived`, `$effect`)                    |
| Язык              | TypeScript (strict)                                                                             |
| Стили             | Scoped SCSS (`<style lang="scss">`, вложенность, BEM-`--` модификаторы) + CSS custom properties |
| PostCSS           | `postcss-pxtorem` (база 16px, `minPixelValue: 2`) + `autoprefixer`                              |
| i18n              | `svelte-i18n` v4 (`ru` — основной/fallback, namespace `home.*`)                                 |
| Иконки            | `@iconify/svelte`, набор `lucide`, **оффлайн-бандл** конкретных иконок (без runtime-фетча)      |
| Сборка            | Vite 7 + `adapter-auto`, `prerender = true`                                                     |
| Пакетный менеджер | bun                                                                                             |
| Форматирование    | Prettier: табы, одинарные кавычки, без хвостовых запятых                                        |
| Тесты             | vitest (+ jsdom для компонентных), `@testing-library/svelte`, Playwright (smoke)                |

### Кодстайл (из dentapp CLAUDE.md)

- **Только стрелочные функции** — никакого `function`.
- Алиас `@` → `src` (через `svelte.config.js` `kit.alias` и `tsconfig`). Никаких `../../`.
- Маленькие функции, единственная ответственность, composition over inheritance.
- Комментарии — только для нетривиальной логики.

---

## 4. Структура проекта

```
cargo-kg/
  src/
    app.css                         # CSS custom properties (токены) + базовые стили (reset, body, контейнер)
    app.html                        # lang="ru"
    app.d.ts
    routes/
      +layout.svelte                # инициализация i18n, общий каркас
      +layout.ts                    # export const prerender = true; await waitLocale()
      (site)/
        +layout.svelte              # <Header/> + <slot/> + <Footer/> + <WhatsAppButton/>
        (home)/
          +page.svelte              # оркестратор: рендерит секции по порядку + <svelte:head> (SEO)
          sections/
            Hero.svelte
            About.svelte
            Services.svelte
            Regions.svelte
            CargoTypes.svelte
            Capacity.svelte
            WhyChooseUs.svelte
            Reviews.svelte
            Faq.svelte
            Contact.svelte
    components/
      layout/
        Header.svelte               # fixed header, navбар + бургер
        Footer.svelte
        WhatsAppButton.svelte       # плавающая кнопка
      ui/
        Button.svelte               # варианты: primary (amber), outline
        Accordion.svelte            # FAQ: один открыт, collapsible, a11y
        YandexMap.svelte            # lazy iframe (для секции Contact)
    lib/
      config/
        site.ts                     # бренд, телефоны, wa.me, email, адрес, соцссылки, координаты карты
      data/
        about.ts services.ts regions.ts cargoTypes.ts
        capacity.ts whyChooseUs.ts reviews.ts faq.ts
        nav.ts footer.ts            # структура секций (иконки/цвета/href/ключи i18n/изображения)
      i18n/
        index.ts                    # register/init svelte-i18n
        locales/
          ru.json                   # ЕДИНЫЙ источник всех текстов (namespace home.*)
      utils/
        scroll.ts                   # smoothScrollToId(id), scrollToTop, с учётом reduced-motion
        carousel.ts                 # nextIndex/prevIndex (заворачивание, guard на 0/1)
        contact.ts                  # telHref(), waHref() — строят ссылки из site.ts
      actions/
        lazyIframe.ts               # use:lazyIframe (IntersectionObserver)
  static/
    images/                         # 6 скачанных изображений
    robots.txt sitemap.xml preview.jpg   # из источника; favicon — дефолтный из SvelteKit
  e2e/
    smoke.spec.ts                   # Playwright smoke
  svelte.config.js  vite.config.ts  postcss.config.js  tsconfig.json
  vitest.config.ts  playwright.config.ts  .prettierrc  .prettierignore
  package.json  ATTRIBUTIONS.md  README.md  .gitignore
```

---

## 5. Секции и контент (порядок как в `App.tsx`)

Порядок рендера: **Hero → About → Services → Regions → CargoTypes → Capacity → WhyChooseUs → Reviews → Faq → Contact** (затем Footer + WhatsAppButton вне `<main>`).

Каждая секция = `data`-файл (структура: иконки/цвета/изображения/ключи) + `ru.json` (тексты). Якоря (`id`): `services`, `regions`, `contact` (используются в навигации и скролле).

| Секция          | Фон                      | Данные                                    | Иконки (lucide)                                                          | Интерактив                                                                |
| --------------- | ------------------------ | ----------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Header**      | `white/95` + blur, fixed | `nav.ts` (4 пункта + CTA)                 | `truck`, `menu`, `x`                                                     | бургер-меню (мобайл), скролл к якорям, scrollToTop по лого                |
| **Hero**        | white                    | — (статика + 1 изображение + 2 стата)     | `truck`, `phone`                                                         | 2 CTA → скролл к `#contact`                                               |
| **About**       | gray-50                  | `about.ts` (4 стата)                      | `trending-up`, `map-pin`, `clock`, `weight`                              | hover-карточки                                                            |
| **Services**    | white                    | `services.ts` (6 услуг)                   | `armchair`, `hammer`, `monitor-smartphone`, `store`, `navigation`, `zap` | hover                                                                     |
| **Regions**     | gray-50                  | `regions.ts` (8 регионов, разные цвета)   | `map-pin`                                                                | hover; + плейсхолдер «интерактивной карты» (как в оригинале — серый блок) |
| **CargoTypes**  | white                    | `cargoTypes.ts` (6 типов + изображения)   | —                                                                        | hover-zoom изображения                                                    |
| **Capacity**    | gray-50                  | `capacity.ts` (5 тарифов, один `popular`) | `truck`, `check`                                                         | бейдж «Популярно», hover                                                  |
| **WhyChooseUs** | white                    | `whyChooseUs.ts` (6 преимуществ)          | `shield`, `truck`, `map`, `users`, `eye`, `headphones`                   | hover                                                                     |
| **Reviews**     | gray-50                  | `reviews.ts` (4 отзыва, рейтинг 5)        | `star`, `chevron-left`, `chevron-right`                                  | **карусель** prev/next                                                    |
| **Faq**         | white, `max-w-4xl`       | `faq.ts` (5 Q/A)                          | — (chevron из аккордеона)                                                | **аккордеон** (один открыт)                                               |
| **Contact**     | gray-50                  | `site.ts` (контакты)                      | `phone`, `mail`, `map-pin`, `clock` + inline WhatsApp SVG                | **карта Яндекс** (lazy iframe) вместо плейсхолдера                        |
| **Footer**      | gray-900                 | `footer.ts` + `site.ts`                   | `truck`, `phone`, `mail`, `map-pin` + inline FB/IG/WA SVG                | скролл к якорям                                                           |

### Палитра (токены в `app.css`)

- Бренд: `--brand: #FFC107`, `--brand-hover: #FFB300`.
- Акценты карточек: WhatsApp `#25D366`, `blue-500`, `green-500`, `purple-500`, `pink-500`, `indigo-500`, `orange-500`, `cyan-500`.
- Нейтрали: шкала серых + белый + `gray-900` (футер).
- **Точные значения серых (Tailwind v4 oklch) снимаются из оригинала через инспектор computed-стилей при сверке** — чтобы цвета совпали 1:1.

### Брейкпоинты (Tailwind по умолчанию — воспроизводим в SCSS)

`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`. Контейнеры: `max-w-7xl` (1280px), `max-w-4xl` (896px, FAQ), `max-w-3xl`/`2xl` (тексты). Горизонтальные отступы `px-4` (16px). Вертикальные секции `py-16 md:py-24`.

### SEO (из `Home.tsx`, в `<svelte:head>`)

- `<title>`: «Грузоперевозки по Кыргызстану | Грузовая машина на заказ»
- `description`, `keywords`, `og:title`, `og:description` — переносятся 1:1.
- `<html lang="ru">`.

---

## 6. Интерактив и чистая логика (тестируемое ядро)

| Модуль                  | Ответственность                                      | Крайние случаи                                                                                                                     |
| ----------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `utils/scroll.ts`       | `smoothScrollToId(id)`, `scrollToTop()`              | отсутствующий `id` → no-op; `prefers-reduced-motion` → мгновенный скролл; учёт высоты fixed-header через `scroll-margin-top` (CSS) |
| `utils/carousel.ts`     | `nextIndex(i, len)`, `prevIndex(i, len)`             | заворачивание (last→0, 0→last); `len === 0/1` без деления на ноль                                                                  |
| `utils/contact.ts`      | `telHref(phone)`, `waHref(phone)`                    | нормализация номера (убрать пробелы), формат `tel:`/`https://wa.me/`                                                               |
| `actions/lazyIframe.ts` | подгрузка `src` карты при попадании в зону видимости | нет `IntersectionObserver` → грузить сразу; фикс. aspect-ratio (нет CLS); отключение наблюдателя после загрузки                    |
| `Header.svelte`         | бургер-меню                                          | закрытие при выборе пункта; закрытие при ресайзе в desktop                                                                         |
| `Accordion.svelte`      | FAQ, один открыт                                     | клавиатура (Enter/Space), `aria-expanded`, поведение `single + collapsible`                                                        |
| `Reviews.svelte`        | карусель                                             | использует `carousel.ts`; кнопки prev/next                                                                                         |

---

## 7. Ассеты

- **Изображения (6 уникальных):** скачать с Unsplash в `static/images/` с осмысленными именами (`hero-truck.jpg`, `cargo-furniture.jpg`, `cargo-appliances.jpg`, `cargo-construction.jpg`, `cargo-commercial.jpg`, `cargo-oversized.jpg`). Заданные `width`/`height` или `aspect-ratio` (нет CLS), `loading="lazy"` ниже сгиба, осмысленный `alt`. Эквивалент `ImageWithFallback` — `on:error` → плейсхолдер.
- **`ATTRIBUTIONS.md`:** переносим (shadcn MIT + Unsplash license).
- **Иконки:** lucide через `@iconify/svelte`, оффлайн-набор. WhatsApp/Facebook/Instagram — inline-SVG (в оригинале это кастомные `path`).
- **Карта Яндекс:** iframe на Бишкек, координаты/ссылка — в `site.ts`. Lazy-загрузка, обёртка с тем же радиусом/тенью, что у блока в оригинале.

---

## 8. Тестирование

**Unit (vitest, TDD «тест → код»):**

- `carousel.ts` — заворачивание индекса, границы, `len 0/1`.
- `contact.ts` — корректные `tel:`/`wa.me` из разных форматов номера.
- `scroll.ts` — выбор поведения по `prefers-reduced-motion`, no-op на отсутствующий id (через мок DOM).

**Компонентные (@testing-library/svelte + jsdom, тест сразу после реализации):**

- `Header` — бургер открывается/закрывается; закрытие при клике по пункту.
- `Accordion` — открытие/закрытие; одновременно открыт только один; клавиатура; `aria-expanded`.
- `Reviews` — prev/next меняют активный отзыв; корректное заворачивание.

**E2E (Playwright, один smoke):**

- Страница грузится без ошибок; присутствуют все секции (по заголовкам).
- Якорная навигация прокручивает к нужной секции.
- Мобильное меню открывается и навигирует.
- Ссылки `wa.me` присутствуют и корректны.

**Сверка дизайна (процесс, не CI-тест):** запуск оригинала и Svelte-версии, поэтапные скриншоты через chrome-devtools, доведение до совпадения посекционно (десктоп + мобильный вьюпорт).

---

## 9. Сборка и деплой

- `svelte.config.js`: `adapter-auto`, `kit.alias['@'] = 'src'`, runes через `vitePlugin.dynamicCompileOptions`.
- `+layout.ts`: `export const prerender = true;` + `await waitLocale()`.
- Результат — полностью статичный сайт; `adapter-auto` подберёт целевой адаптер на платформе деплоя (Vercel/Netlify/Cloudflare/Node), локально работает без настройки.
- Скрипты `package.json`: `dev`, `build`, `preview`, `check` (svelte-check), `format`, `test` (vitest), `test:e2e` (playwright).

---

## 10. Вне объёма (YAGNI)

Не реализуем: API-слой/Orval/svelte-query, axios, авторизацию/RBAC, charts, PWA, voice/AI, рабочие формы и бэкенд, мультиязычность (только `ru`), scroll-reveal/`motion`-анимации (их нет в оригинале — переносим только CSS-transitions 1:1), неиспользуемый shadcn-кит из источника.

---

## 11. Риски и смягчение

| Риск                                                                         | Смягчение                                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Цветовой дрейф (Tailwind v4 oklch-серые vs ручной SCSS)                      | Снять точные computed-цвета из оригинала через инспектор; зафиксировать в токенах |
| `postcss-pxtorem` ломает значения, которые должны остаться в px (border 1px) | `minPixelValue: 2` (как в dentapp) — 1px остаётся px                              |
| Runtime-фетч иконок iconify даёт вспышку при prerender                       | Оффлайн-бандл конкретных lucide-иконок                                            |
| Вспышка ключей i18n до загрузки локали                                       | `await waitLocale()` в `+layout.ts` до рендера                                    |
| CLS от карты/изображений                                                     | Фиксированные размеры/aspect-ratio, lazy-загрузка карты                           |
| Якоря скрыты под fixed-header                                                | `scroll-margin-top` на секциях                                                    |

---

## 12. Следующий шаг

После вычитки и одобрения этой спецификации — переход к skill **writing-plans** для детального плана реализации (порядок задач, TDD-циклы, чек-поинты сверки).
