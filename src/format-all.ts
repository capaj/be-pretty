import path from 'path'
import execa from 'execa'

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

export const formatAll = () => {
  const prettier = require(path.resolve(
    process.cwd(),
    'node_modules/prettier/index.js'
  ))
  const allExtensionsComaSeparated = getSupportedExtensions(prettier)
    .map((ext: string) => ext.substring(1))
    .join(',')

  return execa(
    'npx',
    [
      'prettier',
      `{,!(node_modules)/**/}*.{${allExtensionsComaSeparated}}`,
      '--write',
    ],
    {
      env: {
        NODE_OPTIONS: '--max_old_space_size=8192', // on large repos this becomes a problem
      },
    }
  )
}
