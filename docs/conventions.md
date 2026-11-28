# Conventions

## Documentation

- All documentation belongs in the [/docs](./) directory
- Documentation file names should use kebab case

> The CLAUDE.md file includes instructions to read and follow everything in the /docs directory

## Constants

- Global constants belong in the [/constants](../src/constants/) directory
- Modules should be domain-specific
- File names should use kebab case
- Constant object variable names should use Screaming Snake Case
- Constant objects should be declared "as const" so types scan be read using typeof

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
