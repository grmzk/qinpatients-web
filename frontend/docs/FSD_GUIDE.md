# FSD (Feature-Sliced Design) - Руководство по конфигурации ESLint

## Что такое FSD?

Feature-Sliced Design - это архитектурная методология, которая организует код по признакам (features) и слоям (layers).

## Слои в проекте (от внутренних к внешним)

```
app/           # Инициализация приложения, глобальные провайдеры
├─ pages/      # Страницы приложения
├─ widgets/    # Комбинированные UI компоненты
├─ features/   # Независимые фичи/бизнес-логика
├─ entities/   # Сущности предметной области
└─ shared/     # Переиспользуемые утилиты, UIkit
```

## Правила импортов (ESLint-plugin-boundaries)

### ✅ ПРАВИЛЬНО:
```typescript
// shared может импортировать только shared
import { Button } from "@/shared/ui/Button";

// entities могут импортировать shared и другие entities
import { User } from "@/entities/user";
import { formatDate } from "@/shared/lib/formatDate";

// features могут импортировать shared, entities, другие features
import { UserCard } from "@/entities/user/ui/UserCard";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { useAuth } from "@/features/auth/model/hooks";

// widgets могут импортировать все слои кроме app
import { UserMenu } from "@/widgets/UserMenu";
import { Sidebar } from "@/features/sidebar";

// pages могут импортировать все кроме app
import { HomePage } from "@/pages/home";

// app может импортировать всё
import { App } from "@/app";
```

### ❌ НЕПРАВИЛЬНО:
```typescript
// shared не может импортировать никакие слои выше
import { Button } from "@/shared/ui/Button";
import { LoginForm } from "@/features/auth"; // ❌ ОШИБКА!

// entities не может импортировать features
import { User } from "@/entities/user";
import { LoginForm } from "@/features/auth"; // ❌ ОШИБКА!

// features не могут импортировать widgets/pages/app
import { LoginForm } from "@/features/auth";
import { MainLayout } from "@/widgets/MainLayout"; // ❌ ОШИБКА!

// pages не могут импортировать app
import { HomePage } from "@/pages/home";
import { App } from "@/app"; // ❌ ОШИБКА!
```

## Структура внутри слоя

Каждый слой должен иметь следующую структуру:

```
entities/user/
├─ index.ts              # Public API экспорты
├─ model/
│  ├─ types.ts          # TypeScript типы
│  ├─ hooks.ts          # React hooks
│  └─ store.ts          # Redux store (если нужна глобальная логика)
├─ ui/
│  ├─ UserCard.tsx      # UI компоненты
│  ├─ UserCard.module.css
│  └─ index.ts          # Экспорты компонентов
└─ api/
   ├─ userApi.ts        # API запросы
   └─ index.ts
```

## Правила именования

### Компоненты (UI)
- **Файлы**: PascalCase (UserCard.tsx)
- **Экспорты**: PascalCase (export function UserCard)
- **Директории**: kebab-case (user-card/)

### Утилиты, хуки, типы
- **Файлы**: camelCase (formatDate.ts, useUser.ts)
- **Экспорты**: camelCase (export function formatDate)

### Директории слоев
- **Слои**: kebab-case (user-menu, login-form)

## Экспорты (index.ts)

Каждый слой должен иметь `index.ts`, который определяет публичный API:

```typescript
// entities/user/index.ts
export type { User, UserProfile } from "./model/types";
export { useUser } from "./model/hooks";
export { UserCard } from "./ui/UserCard";
export { userApi } from "./api/userApi";
```

**Это предотвращает:**
- Импорты из внутренних директорий: `import { User } from "@/entities/user/model/types"` ❌
- Нарушение инкапсуляции

## Запуск ESLint

```bash
# Проверить все файлы
npm run lint

# Проверить конкретную директорию
npx eslint src/entities/

# Автоматически исправить проблемы
npx eslint src/ --fix

# Или используйте скрипт
npm run lint:fix
```

## Типичные ошибки ESLint

### 1. Циклические зависимости
```typescript
// entities/user/index.ts
export { User } from "@/features/auth"; // ❌ ОШИБКА!
// features/auth не может импортировать entities/user, 
// если entities/user импортирует features/auth
```

### 2. Нарушение слоев
```typescript
// shared/ui/Button.tsx
import { LoginForm } from "@/features/auth"; // ❌ ОШИБКА!
// shared не может зависеть от других слоев
```

### 3. Импорты из внутренних директорий
```typescript
// BAD
import { User } from "@/entities/user/model/types";

// GOOD
import type { User } from "@/entities/user";
```

## Конфигурация TypeScript paths

Убедитесь, что в `tsconfig.json` настроены пути:

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

## Дополнительные ресурсы

- [Feature-Sliced Design Official](https://feature-sliced.design/)
- [eslint-plugin-boundaries](https://github.com/javierbyte/eslint-plugin-boundaries)
- [Статья на Habr](https://habr.com/ru/articles/718154/)

## Часто задаваемые вопросы

**Q: Где должны быть API запросы?**
A: В слое `entities` в директории `api/`. Или в `features` если это специфично для фичи.

**Q: Где должна быть глобальная логика (Redux)?**
A: В `model/` директориях соответствующих слоев. Или в `app/` для глобального state.

**Q: Можно ли создавать дополнительные директории в слоях?**
A: Да, главное соблюдать правило: только `index.ts` имеет публичный API слоя.

**Q: Как структурировать формы?**
A: Если форма связана с конкретной фичей → `features/`, если универсальная → `shared/`
