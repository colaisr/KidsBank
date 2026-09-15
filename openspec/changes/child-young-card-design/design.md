## Decisions

1. **Same route** `/child/card-design`; `ChildCardDesignPage` switches teen vs young pages.
2. **Persistence** — existing `kidsbank.cardSkin`; young allowed ids: `ocean`, `space`, `leo`, `jungle`. Invalid stored skin on young screen defaults selection to `ocean` until apply.
3. **Teen grid** — `CARD_SKIN_PREVIEWS` unchanged (6). `leo`/`jungle` not listed for teen.
4. **Components** — `YoungChildCardDesignPage`, `YoungCardThemeTile`, `src/data/youngCardThemes.ts`.
5. **Presenter** — young screen skips presenter sheet (mockup); teen keeps `child-card-design` sheet.
