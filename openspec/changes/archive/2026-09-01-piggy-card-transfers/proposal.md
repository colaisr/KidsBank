## Why

Экран копилки показывает баланс и внешние пополнения, но ребёнок не может отложить деньги с карты или вывести накопленное обратно — типичный сценарий детского банкинга (B1). Действия логично держать только на `/child/piggy`, без изменений главной.

**Не ломать:** инварианты, три языка, две темы, `kidsbank.demo` + сброс, без бэкенда.

## What Changes

- На `/child/piggy`: кнопки «Положить с карты» и «Вывести на карту» под балансом.
- Модалка с пресетами сумм (500/1000/2000), балансом источника, проверкой средств.
- `demoActions`: `transferCardToPiggy`, `transferPiggyToCard`; типы `cardToPiggy`, `piggyToCard`.
- `cardToPiggy` — в списке пополнений копилки; `piggyToCard` — в общей истории `/child/transactions`.
- Лимит карты (`cardLimit`) **не** блокирует перевод карта→копилка.
- i18n hy/ru/en.

### Non-goals

- Изменения главной, hub, родительского экрана.
- Подтверждение родителем, свободный ввод суммы.

### Acceptance

- Копилка: положить с карты → балансы и пополнения обновляются.
- Копилка: вывести на карту → балансы обновляются, запись в транзакциях.
- Недостаточно средств — локализованная ошибка.
- hy/ru/en; AMIO/Evoca; reset; `npm run build`.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `child-piggy-bank`: кнопки и модалка карта↔копилка на экране копилки.
- `money-flow`: внутренние переводы карта↔копилка ребёнка.
- `child-transactions`: отображение `cardToPiggy` и `piggyToCard`.

## Impact

- **Код:** `ChildPiggyBankPage`, `PiggyTransferModal`, `demoActions`, `demoBaseline`, `TransactionRow`, locales.
- **PlanDocs:** `01`, `19`.
