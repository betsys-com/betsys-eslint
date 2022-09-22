<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/19550608/189107427-33501040-d335-4081-a339-0532a88cc5be.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
    <img width="200px" alt="Shows an illustrated sun in light color mode and a moon with stars in dark color mode." src="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
  </picture>
</p>
<h1 align="center">@betsys-eslint/install</h1>
<p align="center">Installer for our ESLint configurations and plugins</p>

---

## Requirements
This cli tool requires Node.js v16 and later to work correctly.

## Quick Start

CLI tool will install any `@betsys-eslint` package with its peer dependencies and execute the package's `install` schematics that alters your code automatically.

### Installing ESLint configurations

```bash
npx @betsys-eslint/install config CONFIGURATION_NAME
# Note: Use CONFIGURATION_NAME without "eslint-config" prefix

# Example
npx @betsys-eslint/install config typescript
```

### Installing ESLint plugins
```bash
npx @betsys-eslint/install plugin PLUGIN_NAME
# Note: Use PLUGIN_NAME without "eslint-plugin" prefix

# Example
npx @betsys-eslint/install plugin angular-template-spacing
```

### Command details
```bash
npx @betsys-eslint/install TYPE NAME INSTALL_DIR
```

Parameters:
- TYPE (required)
  - either `config` or `plugin`
- NAME (required)
  - when `TYPE` is `config`, name of the config package without `@betsys-eslint/eslint-config-` prefix
  - when `TYPE` is `plugin`, name of the plugin package without `@betsys-eslint/eslint-plugin-` prefix
- INSTALL_DIR (optional)
  - path to directory with `package.json` file (relative or absolute)
  - defaults to current directory


