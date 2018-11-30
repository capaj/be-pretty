#!/usr/bin/env node

import { writeJSON, readJSON, existsSync, writeJSONSync } from 'fs-extra'
import execa from 'execa'
import Listr from 'listr'
import yargs from 'yargs'
import path from 'path'

const { argv } = yargs.boolean('eslint').default('eslint', true)

// const yarnPath = path.resolve(__dirname, 'node_modules/yarn/bin/yarn')

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
    title: 'creating .prettierrc',
    task: () => {
      writeJSONSync('./prettierrc', {
        arrowParens: 'always',
        singleQuote: true
      })
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
      packageJSON.scripts.format = `prettier "{,!(node_modules)/**/}*.{js,jsx,mjs,json,css,ts,tsx,sass,less,html}" --write`
      await writeJSON('package.json', packageJSON, {
        spaces: 2
      })
    }
  },
  {
    title: 'formatting existing codebase',
    task: () => execa('npm', ['run', 'format']),
    skip: () => !argv.skipFormatting
  }
])

tasks.run().catch((err) => {
  throw err
})
