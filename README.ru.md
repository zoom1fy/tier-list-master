[**English**](./README.md)

# Tier List Master

> **Конструктор рейтингов (tier lists) с перетаскиванием.** Создавайте, настраивайте и экспортируйте рейтинги — полностью в браузере. Никаких загрузок на сервер, никаких трекеров.

[**Демо**](https://zoom1fy.github.io/tier-list-master/)

---

## Возможности

- **Drag & drop** — поддержка мыши и сенсорного ввода. Перемещайте элементы между уровнями, возвращайте в пул или сбрасывайте в корзину для удаления.
- **Загрузка изображений** — вставьте URL картинки или загрузите файл с устройства. Данные не покидают ваш браузер.
- **Настройка уровней** — переименуйте любую категорию (до 15 символов). Раскладка подстраивается автоматически.
- **Экспорт скриншота** — сохраните рейтинг как PNG с высоким разрешением и встроенным водяным знаком.
- **Корзина** — при перетаскивании появляется область удаления. Бросьте туда элемент, чтобы убрать его.
- **Полностью статично** — никакого бэкенда. Изображения остаются на вашем устройстве. При обновлении страницы всё сбрасывается.
- **Open source** — создан на Next.js, React, TypeScript, Tailwind CSS.

## Технологии

[Next.js](https://nextjs.org/) 16 · [React](https://react.dev/) 19 · [TypeScript](https://www.typescriptlang.org/) · [Tailwind CSS](https://tailwindcss.com/) v4 · [Vitest](https://vitest.dev/) · [Base UI](https://base-ui.com/) · [dom-to-image-more](https://github.com/1904labs/dom-to-image-more)

## Как начать

### Требования

- Node.js 20+
- npm / bun / pnpm / yarn

### Установка и запуск

```bash
git clone https://github.com/zoom1fy/tier-list-master.git
cd tier-list-master
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запустить сервер разработки |
| `npm run build` | Собрать production (статический экспорт) |
| `npm start` | Запустить production-сервер |
| `npm run lint` | Проверить код ESLint |
| `npm test` | Запустить тесты (Vitest) |
| `npm run test:watch` | Запустить тесты в режиме наблюдения |

### Сборка

```bash
npm run build
```

Статические файлы будут в `out/`. Можно разместить где угодно — GitHub Pages, Vercel, Cloudflare Pages и т.д.

## Структура проекта

```
app/               — Страницы (App Router)
components/        — Компоненты
  tier-list/       — Ядро рейтинга (Workflow, Card, Line, ImageUpload)
  ui/              — Дизайн-система (button, dialog, sheet и т.д.)
lib/               — Утилиты
types/             — Типы TypeScript
tests/             — Настройки тестов
public/            — Статические файлы
```

## Участие в разработке

Issues и PR приветствуются. Перед отправкой убедитесь, что тесты проходят:

```bash
npm test
```

---

<p align="center">
  <sub>Сделано на Next.js · Дизайн — <a href="https://x.com/mipublicita">@mipublicita</a></sub>
</p>
