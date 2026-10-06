# Архитектура Next.js

## Почему Next.js

Приложение развивается из закрытого финансового кабинета в набор страниц с отдельными метаданными и защищёнными интеграциями. Next.js App Router даёт файловую маршрутизацию, metadata API и server-side Route Handlers в одном проекте.

```text
src/
├── app/                              # Next.js App Router
│   ├── (dashboard)/                  # группа защищённого интерфейса
│   │   ├── dashboard/page.jsx
│   │   ├── settings/page.jsx
│   │   ├── loading.jsx
│   │   └── error.jsx
│   ├── api/                          # server-side API proxy
│   │   ├── finance/[source]/route.js
│   │   └── rates/[from]/[to]/route.js
│   ├── layout.jsx                    # общие metadata и Providers
│   ├── page.jsx                      # redirect на dashboard
│   └── providers.jsx
├── features/                         # доменные возможности
│   ├── currency/
│   ├── dashboard/
│   ├── export/
│   ├── filters/
│   ├── finance/
│   └── settings/
└── style.css
```

## Поток данных

`DashboardScreen` → TanStack Query → клиент API → Next Route Handler → внешний финансовый API.

Ключ финансового API живёт только в `FINANCE_API_KEY` на сервере. Браузер получает данные через внутренний `/api/finance/...` и не видит секрет.

Курсы проходят через `/api/rates/...`; Next кэширует ответ внешнего сервиса до пяти минут, а TanStack Query дополнительно кэширует клиентские запросы.

## Чеклист

| Концепция | Реализация |
| --- | --- |
| Маршрутизация | `src/app/(dashboard)/*/page.jsx` |
| Метаданные | `metadata` в `layout.jsx` и каждой странице |
| Серверные интеграции | Next Route Handlers в `src/app/api` |
| Data fetching и кэш | TanStack Query в features, server fetch cache для курсов |
| Состояние | Query для серверных данных; Context для настройки валюты; hook для фильтров |
| Ошибки и загрузка | `error.jsx`, `loading.jsx`, изолированные UI-состояния запросов |
| Формы | `SettingsScreen`, связанные label/select, `role="status"` |
| Оптимизация | статический рендер страниц, Route Handlers по запросу, Turbopack, кэширование |
