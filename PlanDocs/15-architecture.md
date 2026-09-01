# 15 — Архитектура прототипа

Статус: актуален (2026-09-01), **тонкий** документ. Не C4 и не прод-банк. Менять стек — только решением владельца.

## 1. Стек

| Слой | Выбор |
|------|--------|
| Приложение | Vite + React + TypeScript |
| Стили | Tailwind + CSS-переменные на `data-theme` |
| i18n | `i18next` + `react-i18next` |
| Роутинг | React Router (когда появится `src/`) |
| Данные | нет сервера, нет БД |
| Деплой | статический хостинг |

## 2. Темы и язык

```html
<html lang="ru" data-theme="amio">
```

- `data-theme`: `amio` | `evoca`
- `lang`: `hy` | `ru` | `en`
- Состояние: `localStorage` + query `?bank=&lang=`
- Независимо: Evoca+ru и AMIO+hy валидны

## 3. Где живут демо-данные

```text
src/data/          # id сущностей: child.david, task.homework, amounts, dates
src/locales/hy.json
src/locales/ru.json
src/locales/en.json
  ui.*             # табы, кнопки, «Оформление»
  demo.*           # имена, задания, операции, реплики маскота
```

Компоненты: `t('demo.tasks.homework')`, не `task.title`. Смена языка перерисовывает UI и фикстуры одним locale.

Числа/даты/валюта: locale `hy-AM` / `ru-RU` / `en-US`, валюта демо AMD (пока не решат иначе).

## 4. Чего нет

Auth, API, Prisma, Docker runtime, микросервисы. Если задача требует сервер — это смена конституции, не «заодно».
