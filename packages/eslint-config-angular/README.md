<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/19550608/189107427-33501040-d335-4081-a339-0532a88cc5be.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
    <img width="200px" alt="Shows an illustrated sun in light color mode and a moon with stars in dark color mode." src="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
  </picture>
</p>
<h1 align="center">@betsys-eslint/eslint-config-angular</h1>
<p align="center">Set of ESLint rules we use for our Angular code</p>

---

## Requirements
Having at least basic Angular ESLint already configured will make the installation process way easier.
If you haven't done it yet, take a look at [`@angular-eslint/eslint-plugin`](https://github.com/angular-eslint/angular-eslint). 

## Quick Start

To install the configuration, we recommend using our [installation script](https://github.com/betsys-com/betsys-eslint/tree/main/packages/install)
which also installs the needed peer dependencies automatically.
```bash
npx @betsys-eslint/install config angular
```

after installation, add the configuration to you ESLint config:
```json5
{
  // Root configuration of your project
  "overrides": [
    {
      files: ["*.ts"],
      // Locate configuration for your TypeScript files
      "extends": [
        // ...
        "@betsys-eslint/angular"
      ]
    }
  ]
}
```
This configuration is based on our [`@betsys-eslint/eslint-config-typescript`](https://github.com/betsys-com/betsys-eslint/tree/main/packages/eslint-config-typescript) configuration.
If you'd like to use our full set of rules for Angular, also to check out [Angular Templates](https://github.com/betsys-com/betsys-eslint/tree/main/packages/eslint-config-angular-template) configuration.
