# Conventions

## Constants

- Global constants belong in the [/constants](../src/constants/) directory
- Modules should be domain-specific

## Types

- Global types belong in the [/types](../src/types/) directory
- Modules should be named after the type in them. Example: Link.ts

## Routing

All routing must use constructor methods in [/constants/routes.ts](../src/constants/routes.ts)

## Component File Structure

- Components should be exported as non default
- Modules should be names after the component in them: `Sidebar.tsx`
- Complex modules should be nested into directories: `/components/navigation/AppNavigation/Sidebar/Navigation/Navigation.tsx`
  - Add an index.ts file to export root component: `/components/navigation/AppNavigation/Sidebar/Navigation.index.ts`
    - Export root component: `export * from "./Navigation"`
  - Supporting components get placed at the level they are consumed. Example: `/components/navigation/AppNavigation/Sidebar/NotificationBadge.tsx`
- Components should be placed higher than all of the modules they are consumed in
