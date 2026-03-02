# Project Rules

## Component Organization

- **Do NOT add custom components to `components/ui/`** - This folder is reserved for shadcn/ui primitives only
- Custom components should go in `components/core/` or other appropriate folders
- **App-specific screens go in `components/screens/app-specific/`** - The `components/screens/` root is for boilerplate screens shared across apps
- **App-specific utils go in `utils/app-specific/`** - The `utils/` root is for boilerplate utilities shared across apps

## Route Files

- **Route files in `app/` should be thin** - They should primarily utilize screen components from `components/screens/` and handle routing logic
- Avoid putting significant UI implementation directly in route files
- **Screen components must not do routing** - Navigation (`router.push`, `router.navigate`, `router.replace`, etc.) should be handled in route files via callback props, not inside screen components in `components/screens/`

## TypeScript

- **Use `type` over `interface`** for type definitions
- **Use `??` instead of `||`** for fallback/default values (nullish coalescing over logical OR)
- **Use object parameters for callbacks** - Callback props and function declarations should use a single object parameter, not positional arguments:
  ```ts
  // Good
  onAddLog: (params: { selectedDate: string }) => void;
  // Bad
  onAddLog: (selectedDate: string) => void;
  ```
- **Derive types from const arrays** - Define a `const` array with `as const`, then derive the type from it:
  ```ts
  export const POOP_COLORS = ['brown', 'light-brown'] as const;
  export type PoopColor = (typeof POOP_COLORS)[number];
  ```

## Header Buttons

- **Always use components from `components/core/header-button.tsx`** for `headerLeft` and `headerRight` in navigation options
- Use `HeaderCloseButton` for close/dismiss actions
- Use `HeaderSubmitButton` for save/submit actions
- Do NOT use inline `Button` or `Pressable` components in header options

## Icons

- **Always call `iconWithClassName` on every Lucide icon** before rendering it - This is required for `className` styling to work. Import `iconWithClassName` from `@/components/icons/iconWithClassName` and call it at the module level for each icon:
  ```ts
  import { iconWithClassName } from '@/components/icons/iconWithClassName';
  import { Bell, Target } from 'lucide-react-native';
  iconWithClassName(Bell);
  iconWithClassName(Target);
  ```

## Styling

- **Screen backgrounds should use `bg-background`** on the outermost content container - This gives a light gray background in light mode and near-black in dark mode. Cards (`bg-card`) render as white/dark gray on top of this background.

## Localization

- **When adding a new language**, always add both the translation file in `locales/<code>/translation.json` **and** register it in `app.json` under the `locales` key
- **Always localize user-facing text** - Use the `useTranslation` hook and `t()` function for all visible copy. Never hardcode strings that users will see
