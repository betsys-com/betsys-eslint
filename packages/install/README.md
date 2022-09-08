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

## Quick Start

Installs all the peer dependencies of the package, and the package itself with a single command.

#### Installing ESLint configurations

```bash
npx @betsys-eslint/install config CONFIGURATION_NAME
# Note: Use CONFIGURATION_NAME without "eslint-config" prefix

# Example
npx @betsys-eslint/install config typescript
```

#### Installing ESLint plugins
```bash
npx @betsys-eslint/install plugin PLUGIN_NAME
# Note: Use PLUGIN_NAME without "eslint-plugin" prefix

# Example
npx @betsys-eslint/install plugin angular-template-spacing
```
