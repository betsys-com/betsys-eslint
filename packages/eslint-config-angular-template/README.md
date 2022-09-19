<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/19550608/189107427-33501040-d335-4081-a339-0532a88cc5be.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
    <img width="200px" alt="Shows an illustrated sun in light color mode and a moon with stars in dark color mode." src="https://user-images.githubusercontent.com/19550608/189107408-a7845b2c-1256-4489-8de5-2891b60f7b16.svg">
  </picture>
</p>
<h1 align="center">@betsys-eslint/eslint-config-angular-template</h1>
<p align="center">Set of ESLint rules we use for our Angular templates</p>

---

## Requirements
Having at least basic Angular ESLint already configured will make the installation process way easier.
If you haven't done it yet, take a look at [`@angular-eslint/eslint-plugin`](https://github.com/angular-eslint/angular-eslint).

#### Installing automatically
To install the configuration, we recommend using our [installation script](https://github.com/betsys-com/betsys-eslint/tree/main/packages/install)
which also automatically alters `.eslintrc.json` file.
```bash
npx @betsys-eslint/install config angular-template
```

#### Installing manually
To install the configuration manually, use the following:
```bash
npm install --save-dev @betsys-eslint/eslint-config-angular-template
```

after installation, add the configuration to you ESLint config:
```json5
{
  // Root configuration of your project
  "overrides": [
    {
      files: ["*.html"],
      // Locate configuration for your HTML files
      "extends": [
        // ...
        "@betsys-eslint/angular-template"
      ]
    }
  ]
}
```

If you'd like to use our full set of rules for Angular, check out the [Angular](https://github.com/betsys-com/betsys-eslint/tree/main/packages/eslint-config-angular) configuration.
Also, this configuration uses our [Angular Template Spacing](https://github.com/betsys-com/betsys-eslint/tree/main/packages/eslint-plugin-angular-template-spacing) plugin to make sure your spacing is correct. 
