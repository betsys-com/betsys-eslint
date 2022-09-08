<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/19550608/189107427-33501040-d335-4081-a339-0532a88cc5be.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
    <img width="200px" alt="Shows an illustrated sun in light color mode and a moon with stars in dark color mode." src="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
  </picture>
</p>
<h1 align="center">@betsys-eslint/eslint-plugin-angular-template-spacing</h1>
<p align="center">ESLint plugin that ensures your angular interpolations and pipes are consistent across the project</p>

---

## Requirements
Angular ESLint configured

## Quick Start

To install the configuration, we recommend using our [installation script](https://github.com/betsys-com/betsys-eslint/tree/main/packages/install)
which also installs the needed peer dependencies automatically.
```bash
npx @betsys-eslint/install plugin angular-template-spacing
```

after installation, add the configuration to you ESLint config:
```json5
{
  // Root configuration of your Angular project
  "overrides": [
    {
      files: ["*.html"],
      // Locate configuration for your HTML files
      "extends": [
        // ...
        "plugin:@betsys-eslint/angular-template-spacing/recommended"
      ]
    }
  ]
}
```

## Specific rules

TBA
