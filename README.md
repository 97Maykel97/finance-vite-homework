# Finance Dashboard

Финансовый кабинет на Next.js: операции из двух источников, фильтры, суммы по валютам, конвертация по актуальному курсу и CSV-экспорт.

## Настройка

Создайте `.env.local` в корне проекта:

```env
FINANCE_API_KEY=your-finance-api-key
```

Ключ читается только серверным Route Handler и не передаётся браузеру. Не используйте префикс `NEXT_PUBLIC_`.

## Запуск

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000/dashboard`.

## Production

```bash
npm run build
npm start
```
