<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/19550608/189107427-33501040-d335-4081-a339-0532a88cc5be.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
    <img width="200px" alt="Shows an illustrated sun in light color mode and a moon with stars in dark color mode." src="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
  </picture>
</p>
<h1 align="center">@betsys-eslint/eslint-config-typescript</h1>
<p align="center">Set of ESLint rules we use for our TypeScript code</p>

---

## Requirements
Having at least basic ESLint configuration will make the installation process way easier.
If you haven't done it yet, take a look at [`@typescript-eslint/eslint-plugin`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin).

## Quick Start

#### Installing automatically
To install the configuration, we recommend using our [installation script](https://github.com/betsys-com/betsys-eslint/tree/main/packages/install)
which also automatically alters `.eslintrc.json` file.
```bash
npx @betsys-eslint/install config typescript
```

#### Installing manually
To install the configuration manually, use the following:
```bash
npm install --save-dev @betsys-eslint/eslint-config-typescript
```

after installation, add the configuration to you ESLint config:
```json5
{
  // Root configuration of your project
  "overrides": [
    {
      files: ["*.ts"],
      // Locate configuration for your TS files
      "extends": [
        // ...
        "@betsys-eslint/typescript"
      ]
    }
  ]
}
```

This configuration is inspired by [`eslint-config-airbnb-base`](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) ESLint package.
