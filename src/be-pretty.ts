#!/usr/bin/env node

import {
  writeJSON,
  readJSON,
  existsSync,
  writeJSONSync,
  copyFileSync
} from 'fs-extra'
import execa from 'execa'
import Listr from 'listr'
import yargs from 'yargs'
import path from 'path'
const pathToDefaultPrettierrc = path.resolve(__dirname, '../.defaultPrettierrc')

const { argv } = yargs
  .alias('s', 'skipFormatting')
  .describe('s', 'pass when you do not want to format your code')
  .command(
    'setDefault',
    'sets a .prettierrc file as your default, if ommited will look for the .prettierrc file in CWD',
    {
      path: {
        alias: 'p',
        default: './.prettierrc'
      }
    },
    ({ path: prettierrcFilePath }) => {
      copyFileSync(prettierrcFilePath, pathToDefaultPrettierrc)
    }
  )
  .command(
    ['run', '$0'],
    'run the series of commands to make a codebase pretty',
    {},
    () => {
      const hasCustomDefault = existsSync(pathToDefaultPrettierrc)

      const tasks = new Listr([
        {
          title: 'Installing prettier husky lint-staged',
          task: () => {
            const hasYarnLock = existsSync('./yarn.lock')

            if (hasYarnLock) {
              return execa('yarn', ['add', '-D', 'prettier husky pretty-quick'])
            } else {
              return execa('npm', [
                'install',
                '-D',
                'prettier',
                'husky',
                'pretty-quick'
              ])
            }
          }
        },
        {
          title: hasCustomDefault
            ? 'copying custom .prettierrc'
            : 'creating .prettierrc using the default',
          task: () => {
            const localPrettierrc = './.prettierrc'

            if (hasCustomDefault) {
              copyFileSync(pathToDefaultPrettierrc, localPrettierrc)
            } else {
              writeJSONSync(localPrettierrc, {
                arrowParens: 'always',
                singleQuote: true
              })
            }
          }
        },
        {
          title: 'Updating package.json',
          task: async () => {
            const packageJSON = await readJSON('package.json')
            packageJSON.husky = {
              hooks: {
                'pre-commit': 'pretty-quick --staged'
              }
            }
            if (!packageJSON.scripts) {
              packageJSON.scripts = {}
            }
            packageJSON.scripts.formatAll = `prettier "{,!(node_modules)/**/}*.{js,jsx,mjs,json,css,ts,tsx,sass,less,html}" --write`

            await writeJSON('package.json', packageJSON, {
              spaces: 2
            })
          }
        },
        {
          title: 'formatting existing codebase',
          task: () => execa('npm', ['run', 'formatAll']),
          skip: () => argv.skipFormatting
        }
      ])

      tasks.run().catch((err) => {
        throw err
      })
    }
  )
  .help()
