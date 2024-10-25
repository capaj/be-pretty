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
import lodashMerge from 'lodash.merge'
import { formatAll } from './format-all'

const pathToDefaultPrettierrc = path.resolve(__dirname, '../.defaultPrettierrc')

export const listrTasks = () => {
  const hasCustomDefault = existsSync(pathToDefaultPrettierrc)

  const listrTasks: ReadonlyArray<Listr.ListrTask> = [
    {
      title: 'Installing prettier husky pretty-quick',
      task: () => {
        const hasYarnLock = existsSync('./yarn.lock')
        const hasPnpmLock = existsSync('./pnpm-lock.yaml')
        const hasBunLock = existsSync('./bun.lockb')
        const packageDependencies = [
          'add',
          '-D',
          'prettier',
          'husky',
          'pretty-quick'
        ]
        if (hasPnpmLock) {
          return execa('pnpm', packageDependencies)
        } else if (hasYarnLock) {
          return execa('yarn', packageDependencies)
        } else if (hasBunLock) {
          return execa('bun', packageDependencies)
        } else {
          return execa('npm', packageDependencies)
        }
      }
    },
    {
      title: hasCustomDefault
        ? 'Copying custom .prettierrc'
        : 'Creating .prettierrc using the default .prettierrc',
      task: () => {
        const localPrettierrc = './.prettierrc'
        if (hasCustomDefault) {
          copyFileSync(pathToDefaultPrettierrc, localPrettierrc)
        } else {
          writeJSONSync(
            localPrettierrc,
            {
              arrowParens: 'always',
              singleQuote: true
            },
            { spaces: 2 }
          )
        }
      }
    },
    {
      title: 'Adding lint-staged pre-commit to package.json',
      task: async () => {
        await execa('npx', ['mrm@2', 'lint-staged'])
        const packageJSON = await readJSON('package.json')
        lodashMerge(packageJSON, {
          'lint-staged': {
            '*': 'prettier --ignore-unknown --write'
          }
        })
        await writeJSON('package.json', packageJSON, {
          spaces: 2
        })
      }
    },
    {
      title: `Formatting whole repo`,
      task: formatAll,
      skip: () => {
        // @ts-expect-error
        return Boolean(parser.skipFormatting)
      }
    }
  ]
  const tasks = new Listr(listrTasks)

  tasks.run().catch((err: Error) => {
    throw err
  })
}
export const parser = yargs
  .alias('s', 'skipFormatting')
  .describe('s', 'pass when you do not want to format your code')
  .command(
    ['setDefault', 'd'],
    'sets a .prettierrc file as your default, if omitted will look for the .prettierrc file in CWD',
    {
      path: {
        alias: 'p',
        default: './.prettierrc'
      }
    },
    ({ path: prettierrcFilePath }) => {
      copyFileSync(prettierrcFilePath, pathToDefaultPrettierrc)
      console.log(path.resolve(prettierrcFilePath), 'is now set as default')
    }
  )
  .command(['version', 'v'], 'prints the version', {}, () => {
    console.log(require('../package.json').version)
  })
  .command(
    ['formatAll', 'f'],
    'formats everything excluding node_modules',
    {},
    formatAll
  )
  .command(
    ['run', '$0'],
    'run the series of commands to make a codebase pretty',
    {},
    listrTasks
  )
  .help().argv
