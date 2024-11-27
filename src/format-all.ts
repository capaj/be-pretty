import path from 'path'
import { executeCommand } from './executeCommand'
const getSupportedExtensions = (prettier: {
  getSupportInfo: () => { languages: any[] }
}) => {
  const supportedExtensions = prettier
    .getSupportInfo()
    .languages.reduce(
      (prev: string[], language: { extensions: string }) =>
        prev.concat(language.extensions || []),
      []
    )
  return supportedExtensions
}

export const formatAll = async () => {
  let prettier
  try {
    prettier = require(path.join(
      process.cwd(),
      `node_modules${path.sep}prettier`
    ))
  } catch (err) {
    console.warn(
      'Prettier not found in node_modules. Using global installed one.'
    )
    prettier = require('prettier')
  }
  if (prettier.version[0] < 2) {
    throw new Error(
      `Only prettier 2 and up are supported, your version is ${prettier.version}`
    )
  }

  const output = await executeCommand('npx', ['prettier', `.`, '--write'], {
    stdio: 'inherit',
    env: {
      NODE_OPTIONS: '--max_old_space_size=8192'
    }
  })
  console.log(`Formatted all files`)
}
