# 🚀 Быстрый старт: ESLint + FSD

## Что было установлено?

✅ **eslint-plugin-boundaries** (v7.4.4) - плагин для проверки правил FSD архитектуры

## Новые правила ESLint

Добавлено правило `boundaries/element-types` которое:
- Проверяет импорты между слоями
- Запрещает нарушения архитектуры
- Автоматически обнаруживает циклические зависимости

**Важно:** 
1. Плагин `boundaries` должен быть добавлен в массив `plugins`:
```json
"plugins": ["@typescript-eslint", "import", "react", "react-hooks", "boundaries"]
```

2. Добавить `boundaries/elements` в `settings` для описания слоев:
```json
"settings": {
  "boundaries/elements": [
    {
      "type": "shared",
      "pattern": "src/shared/**/*",
      "capture": ["elementType", "elementName"]
    },
    {
      "type": "entities",
      "pattern": "src/entities/**/*",
      "capture": ["elementType", "elementName"]
    },
    // ... остальные слои
  ]
}
```

## Новые скрипты

```bash
# Проверить весь код
npm run lint

# Исправить проблемы автоматически
npm run lint:fix

# Показать отчет о нарушениях FSD
npm run lint:fsd

# Получить JSON отчет
npm run lint:check
```

## Правила импортов (краткая версия)

```
shared    → может импортировать: shared
entities  → может импортировать: shared, entities
features  → может импортировать: shared, entities, features
widgets   → может импортировать: shared, entities, features, widgets
pages     → может импортировать: shared, entities, features, widgets, pages
app       → может импортировать: все
```

## Что делать с ошибками?

### Если ESLint говорит: "Module is not allowed in [layer]"

```typescript
// ❌ БЫЛО (неправильно)
import { LoginForm } from "@/features/auth"; // в shared/ui/Button.tsx

// ✅ БУДЕТ (правильно)
// Переместите LoginForm в shared/ или измените архитектуру
```

### Если есть циклическая зависимость

```
Error: Module "@/features/auth" is not allowed
because it imports from "@/entities/user"
which imports from "@/features/auth"
```

**Решение:** Переместите общий код в `shared/` или `entities/`

## Проверка конфигурации

```bash
# Убедитесь, что eslint видит новый плагин
npx eslint --print-config src/app/App.tsx | grep -A 20 boundaries

# Если плагин не виден, установите зависимости
npm install
```

## Интеграция с IDE

### VS Code

Установите расширение: `ESLint` (dbaeumer.vscode-eslint)

Это автоматически:
- Показывает ошибки в коде
- Предлагает исправления
- Запускает `lint:fix` по сохранению (при правильной конфигурации)

**Добавьте в `.vscode/settings.json`:**
```json
{
  "eslint.validate": ["typescript", "typescriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### WebStorm / IntelliJ IDEA

- Файл → Параметры → Языки и платформы → TypeScript → ESLint
- Включите: "Run eslint --fix on Save"

## Частые вопросы

**Q: ESLint говорит об ошибке, но я считаю это правильно?**
A: Возможно, нужно обновить архитектуру. Смотрите [FSD_GUIDE.md](./FSD_GUIDE.md)

**Q: Как отключить правило для конкретного файла?**
A: Добавьте в начало файла:
```typescript
/* eslint-disable boundaries/element-types */
// код
```

**Q: Как отключить плагин boundaries полностью?**
A: В `.eslintrc.json` измените:
```json
"boundaries/element-types": "off"
```

**Q: Нужно ли обновлять tsconfig.json?**
A: Убедитесь, что baseUrl и paths правильно настроены:
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Дополнительная информация

- 📖 [FSD_GUIDE.md](./FSD_GUIDE.md) - Полное руководство
- 📂 [STRUCTURE_EXAMPLE.md](./STRUCTURE_EXAMPLE.md) - Примеры структуры
- 🔗 [Feature-Sliced Design Official](https://feature-sliced.design/)
- 🔗 [eslint-plugin-boundaries](https://github.com/javierbyte/eslint-plugin-boundaries)

## Следующие шаги

1. **Установите зависимости:**
   ```bash
   npm install
   ```

2. **Проверьте текущее состояние:**
   ```bash
   npm run lint
   ```

3. **Прочитайте рекомендации:**
   - Если ошибок мало → исправьте вручную
   - Если много → используйте `npm run lint:fix`

4. **Добавьте в pre-commit hook** (опционально):
   ```bash
   # Установите husky
   npm install --save-dev husky
   npx husky install
   
   # Создайте hook
   npx husky add .husky/pre-commit "npm run lint"
   ```

5. **Интегрируйте с CI/CD** (опционально):
   ```yaml
   # .github/workflows/lint.yml
   - name: Lint
     run: npm run lint
   ```

---

**Вопросы?** Смотрите документацию или обратитесь к документам выше! 📚
