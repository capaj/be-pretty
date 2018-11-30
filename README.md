# be-pretty

:lipstick: adds prettier to an existing project with all bells and whistles-including husky, lint-staged

## Install

```
npm i be-pretty -g
```

## Usage

When you are in an old codebase which needs to be pretty now, and stay pretty forever and ever execute

```
be-pretty
``

if your codebase is already pretty, but needs help in the future you may skip formatting with a flag `--skipFormatting`
```

## Customize .prettierrc

by default, be-pretty creates this prettier config.

```js
{
  "semi": false,
  "arrowParens": "always",
  "singleQuote": true
}
```

if you want to customize this, just run `be-pretty setDefault "/path/to/your/defaultPrettierRc"`.
be-pretty will use this as default from now on.
