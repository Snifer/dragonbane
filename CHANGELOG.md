# Changelog

## Unreleased

### Added
- Added internationalization support with `vue-i18n`
- Added English and Spanish locale messages
- Added a language selector to the app UI
- Added a GitHub Pages deployment workflow

### Changed
- Migrated domain values to stable internal keys for safer localization
- Localized main screens, gameplay components, and rules tables
- Updated the SPA public path for GitHub Pages deployment
- Replaced router alias imports with relative imports for build compatibility
- Updated Quasar boot, router, and store integration for the current toolchain

### Fixed
- Fixed persisted data compatibility during the i18n migration
- Fixed translated skill labels breaking internal logic
- Fixed Quasar wrapper compatibility issues
- Fixed PostCSS config resolution under ESM
