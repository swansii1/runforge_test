# Runforge Runs

Страница запусков AI-агентов на React, TypeScript и Vite. Стили компонентов оформлены через CSS Modules.

## Локальный запуск

Используйте Node.js 20.19+ ветки 20 или Node.js 22.12+.

```sh
npm ci
npm run dev
```

## Проверки

- `npm test` — запустить тесты Vitest с React Testing Library.
- `npm run test:watch` — перезапускать тесты при изменениях.
- `npm run build` — проверить типы и собрать приложение в `dist`.
- `npm run preview` — открыть локальный сервер для готовой сборки.

## Структура

- `src/app` — точка входа и глобальные стили.
- `src/pages/runs` — страница Runs, её стили и тест.
- `src/entities/run` — типы запуска и его статуса.
