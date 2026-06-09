# @owdproject/kit-primevue

PrimeVue integration for OWD demo themes.

## Includes

- Nuxt module: installs `@primevue/nuxt-module` and registers `ConfirmDialog`
- Client plugin: `createDesktopDialogs` → core `DesktopDialogProvider`
- Optional explorer UI (`DesktopExplorer*`): Workspace, Toolbar, FileEntry, Frame, …

## Stacks

| Goal | `desktop.config` | Theme `installModule` | `package.json` peers |
|------|------------------|----------------------|----------------------|
| Kernel + theme only | no `module-fs` | — | `@owdproject/core` |
| PrimeVue dialogs only | no `module-fs` | `kit-primevue` with `{ explorer: false }` | `core`, `kit-primevue` |
| File explorer (PV) | `modules: ['@owdproject/module-fs']` | `kit-primevue` (default) | `core`, `module-fs`, `kit-primevue` |

Headless explorer APIs (`useExplorerWindow`, DnD, `useExplorerStore`, …) live in **`@owdproject/module-fs`**, not in core. ZenFS (`@zenfs/*`) is imported only inside `module-fs`.

## Usage

Dialogs + explorer (default):

```ts
await installModule('@owdproject/kit-primevue')
```

Dialogs only (no `DesktopExplorer*`, no `module-fs` required):

```ts
await installModule('@owdproject/kit-primevue', { explorer: false })
```

Mount theme-specific `<ConfirmDialog />` groups (`delete`, `about`, …) in your layout.

Themed file explorer also needs `@owdproject/module-fs` in `desktop.config.ts` `modules` and in the app `package.json`.
