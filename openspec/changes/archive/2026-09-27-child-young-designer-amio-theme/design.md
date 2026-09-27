## Decisions

1. **CSS-first:** переопределение `--brand*`, `--ink*` под `html[data-theme='amio'] .kb-designer-child`; Evoca остаётся default в `style.css`.
2. **`designerBrandPalette(bank)`** для WebGL/confetti; не писать в `:root` при импорте `leoConfig`.
3. **Карты:** те же 4 id, что young; `readDesignerCardDesign()` читает `kidsbank.cardSkin`, fallback `evoca-card-design`; запись — оба ключа.
4. **AMIO card gradients** из `youngCardThemes` / `card-skins.css` AMIO rows, без отдельных PNG для space на AMIO (gradient-only где нужно).

## Risks

- `MeshGradient` цвета меняются только при remount — передаём `key={bank}` на AmbientBackground.
