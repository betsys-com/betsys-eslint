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
We recommend using Node.js v16 as we do not support lower version of Node.js.
Angular version 12 and later are supported.

## Quick Start

#### Installing automatically
To install the configuration with all the necessary configuration changes, use the following:
```bash
npx @betsys-eslint/install plugin angular-template-spacing
```

To read more about our installation script visit: [@betsys-eslint/install](https://github.com/betsys-com/betsys-eslint/tree/main/packages/install).
:warning: This package currently works only with `.eslintrc.json` file. We plan to support other configuration files (`.js` and `.yml`) in the future.

#### Installing manually
You can install the plugin without using the installation script above, see the following:
```bash
npm install --save-dev @betsys-eslint/eslint-plugin-angular-template-spacing
```

after installation, add the plugin to you ESLint config:
```json5
{
  // Root configuration of your Angular project
  "overrides": [
    {
      files: ["*.html"],
      // Locate configuration for your HTML files
      "plugins": [
        // ...
        "@betsys-eslint/angular-template-spacing"
      ],
      "extends": [
        // ...
        "plugin:@betsys-eslint/angular-template-spacing/recommended"
      ]
    }
  ]
}
```

## Specific rules

#### @betsys-eslint/angular-template-spacing/interpolation
We follow common ESLint configuration practices:
- First parameter is [`ESLint severity level`](https://eslint.org/docs/latest/user-guide/configuring/rules)
- Second parameter
  - `always` requires whitespace between `|` (pipe) character
  - `never` disallows whitespace between `|` (pipe) character
- Third parameter is an object with additional options
  - `allowNewlines` option:
    - defaults to `true`
    - `false` disallows newlines to be treated as "whitespace"
    - `true` allows newlines to be treated as "whitespace"

Example:
```json5
{
  "@betsys-eslint/angular-template-spacing/interpolation": ["error", "always", { "allowNewlines": false }] 
}
```

#### @betsys-eslint/angular-template-spacing/pipe
We follow common ESLint configuration practices:
- First parameter is [`ESLint severity level`](https://eslint.org/docs/latest/user-guide/configuring/rules)
- Second parameter
  - `always` requires whitespace between `|` (pipe) character
  - `never` disallows whitespace between `|` (pipe) character

Example:
```json5
{
  "@betsys-eslint/angular-template-spacing/pipe": ["error", "always"] 
}
```

## Included configurations
Instead of configuring the rules yourself, you can use one of our included configurations listed below.

#### Recommended (@betsys-eslint/angular-template-spacing/recommended)
```json5
{
    "@betsys-eslint/angular-template-spacing/interpolation": ["error", "always", { "allowNewlines": false }],
    "@betsys-eslint/angular-template-spacing/pipe": ["error", "always"]
}
```
