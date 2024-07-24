# be-pretty

![fabolous](https://media.giphy.com/media/XmiTYLQ5qXTqM/giphy.gif)

:lipstick: adds prettier to an existing project with all bells and whistles-including husky and pretty-quick.
Have you ever been bothered by all the steps you need to do in a legacy codebase to get prettier all set up? Well now you don't have to.

## Usage

When you are in an old codebase which needs to be pretty now, and stay pretty forever and ever execute `npx be-pretty`. An output looks like this:

```
be-pretty
  ✔ Installing prettier husky pretty-quick
  ✔ Copying custom .prettierrc
  ✔ Adding pretty-quick pre-commit to package.json
  ✔ Formatting whole repo
```

Now you should have everything ready to just commit&push.

You may skip formatting step with a flag `--skipFormatting`

## Install(optional)

```
npm i be-pretty -g
```

Requires that you have npm/yarn and `npx` globally available. be pretty defaults to running npm, but if there is `yarn.lock` file it will use `yarn`.

## Customize .prettierrc

by default, be-pretty creates this prettier config.

```js
{
  "arrowParens": "always", // good for typescript/flow when you want to type your function arguments
  "singleQuote": true // IMHO better readability
}
```

if you want to customize this, just run `be-pretty setDefault -p="/path/to/your/defaultPrettierRc"`. You can omit the path and if there is a prettierc file in the current working directory it will be used.
be-pretty will use this as default from now on.

## Format all

if you just want to reformat everything, you can call `be-pretty formatAll`

## All Commands

```
  be-pretty setDefault  sets a .prettierrc file as your default, if ommited
                           will look for the .prettierrc file in CWD[aliases: d]
  be-pretty formatAll   formats everything excluding node_modules[aliases: f]
  be-pretty run         run the series of commands to make a codebase pretty
                                                                       [default]
```

## FAQ

### Will this work for a newly added languages as well?

Yes, the list of supported file extensions is not hardcoded anywhere-format all just invokes prettier in the current folder and let's it format all supported extensions.
