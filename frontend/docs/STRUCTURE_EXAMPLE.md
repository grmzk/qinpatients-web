# Пример структуры проекта согласно FSD

## Текущая структура вашего проекта

```
src/
├── app/                              # 🏠 Инициализация приложения
│   ├── store/
│   │   └── hooks.ts                 # Redux hooks
│   └── App.tsx
│
├── pages/                            # 📄 Страницы приложения
│   ├── search/
│   │   ├── index.ts                 # Public API
│   │   └── ui/
│   │       └── SearchTable.tsx
│   ├── monitor/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── MonitorTable.tsx
│   ├── patient-history/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── PatientHistoryTable.tsx
│   └── editor/
│       ├── index.ts
│       └── ui/
│           └── Editor.tsx
│
├── widgets/                         # 🧩 Комбинированные компоненты
│   └── (пусто для расширения)
│
├── features/                        # ⚡ Бизнес-логика/фичи
│   ├── editor/
│   │   ├── index.ts                 # Public API
│   │   ├── model/
│   │   │   ├── EditorTabTypes.ts
│   │   │   ├── EditorTabSlice.ts    # Redux reducer
│   │   │   └── hooks.ts
│   │   └── ui/
│   │       ├── TitleText.tsx
│   │       ├── TitleOptions.tsx
│   │       ├── FormTextOrOptions.tsx
│   │       ├── BodyPart.tsx
│   │       └── TextareaExtended.tsx
│   └── (другие фичи)
│
├── entities/                        # 🏛️ Сущности предметной области
│   └── patient/
│       ├── index.ts                 # Public API экспорты
│       ├── model/
│       │   ├── types/               # TypeScript типы
│       │   │   ├── CaseDiseaseResponse.ts
│       │   │   ├── PatientInfoResponse.ts
│       │   │   └── SummaryResponse.ts
│       │   ├── hooks.ts             # React hooks (если нужны)
│       │   └── store.ts             # Redux store для patient
│       ├── ui/
│       │   ├── ExtraInfoOutpatient.tsx
│       │   ├── ExtraInfoInpatient.tsx
│       │   ├── ExtraInfoPatient.tsx
│       │   └── index.ts
│       └── api/
│           ├── patientApi.ts        # API запросы
│           └── index.ts
│
└── shared/                          # 🔧 Переиспользуемое
    ├── ui/                          # UI Kit
    │   ├── Button.tsx
    │   ├── Table.tsx
    │   ├── Table.module.css
    │   ├── Loader.tsx
    │   ├── DepartmentSelector.tsx
    │   └── index.ts
    ├── lib/                         # Утилиты
    │   ├── capitalizeString.ts
    │   ├── formatToLocaleDate.ts
    │   └── index.ts
    ├── types/                       # Общие типы
    │   ├── Department.ts
    │   ├── ISODateStrings.ts
    │   ├── TableContent.ts
    │   └── index.ts
    ├── config/                      # Конфигурация
    │   └── config.ts
    └── index.ts
```

## Правила импортов для этого проекта

### ✅ Правильно

**Из shared:**
```typescript
// patient/ui/ExtraInfoPatient.tsx
import { formatToLocaleDate } from "@/shared/lib/formatToLocaleDate";
import styles from "@/shared/ui/Table.module.css";
```

**Из entities:**
```typescript
// pages/search/ui/SearchTable.tsx
import { ExtraInfoPatient, ExtraInfoOutpatient } from "@/entities/patient";
import type { PatientInfoResponse } from "@/entities/patient";
```

**Из features:**
```typescript
// pages/editor/ui/Editor.tsx
import { FirstExamination, useAppDispatch } from "@/features/editor";
import { deleteEditorTab } from "@/features/editor";
```

**Из pages:**
```typescript
// app/App.tsx
import { SearchPage } from "@/pages/search";
import { MonitorPage } from "@/pages/monitor";
```

### ❌ Неправильно

```typescript
// shared/ui/Button.tsx
import { ExtraInfoPatient } from "@/entities/patient"; // ❌ shared не может импортировать entities!

// entities/patient/index.ts
import { FirstExamination } from "@/features/editor"; // ❌ entities не могут импортировать features!

// features/editor/index.ts
import { SearchTable } from "@/pages/search"; // ❌ features не могут импортировать pages!

// pages/search/index.ts
import { App } from "@/app"; // ❌ pages не могут импортировать app!
```

## Как структурировать новый слой/фичу

### Новая фича (например, `auth`)

```
features/auth/
├── index.ts                    # Public API
├── model/
│   ├── AuthTypes.ts           # Типы
│   ├── AuthSlice.ts           # Redux логика
│   ├── useAuth.ts             # Custom hook
│   └── hooks.ts               # Экспорты hooks
├── ui/
│   ├── LoginForm.tsx
│   ├── LogoutButton.tsx
│   ├── AuthGuard.tsx
│   └── index.ts
├── api/
│   ├── authApi.ts
│   └── index.ts
└── config/
    └── authConfig.ts
```

**features/auth/index.ts:**
```typescript
// Types
export type { AuthUser, AuthState } from "./model/AuthTypes";

// Hooks
export { useAuth, useLogin } from "./model/hooks";

// Redux
export { authSlice, selectIsAuth } from "./model/AuthSlice";

// UI Components
export { LoginForm } from "./ui/LoginForm";
export { LogoutButton } from "./ui/LogoutButton";
export { AuthGuard } from "./ui/AuthGuard";

// API
export { authApi } from "./api/authApi";
```

### Новая entities (например, `department`)

```
entities/department/
├── index.ts
├── model/
│   ├── types.ts                   # Типы Department
│   └── hooks.ts                   # Hooks (если нужны)
├── ui/
│   ├── DepartmentCard.tsx
│   └── index.ts
└── api/
    ├── departmentApi.ts
    └── index.ts
```

## Миграция существующего кода

Если код нарушает FSD правила, используйте ESLint для поиска и исправления:

```bash
# Найти все нарушения
npm run lint

# Автоматически исправить где возможно
npm run lint:fix

# Получить отчет о нарушениях FSD
npm run lint:fsd
```

## Контрольный список для Code Review

При создании новых компонентов проверьте:

- [ ] Компонент находится в правильном слое?
- [ ] Public API определён в `index.ts`?
- [ ] Импорты следуют правилам FSD?
- [ ] Нет циклических зависимостей?
- [ ] Файлы именованы по конвенции (PascalCase для компонентов)?
- [ ] Тип компонента соответствует директории (`/ui`, `/model`, `/api`)?
- [ ] `eslint` не выдает ошибок?

## Полезные команды

```bash
# Запустить линтер
npm run lint

# Исправить ошибки автоматически
npm run lint:fix

# Проверить только нарушения FSD
npm run lint:fsd

# Получить JSON отчет о проблемах
npm run lint:check
```
