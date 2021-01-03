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
  const prettier = require('prettier')
  if (prettier.version[0] > 1) {
    throw new Error(
      `Only prettier 2 and up are supported, your version is ${prettier.version}`
    )
  }

  return execa('npx', ['prettier', `.`, '--write'], {
    env: {
      NODE_OPTIONS: '--max_old_space_size=8192' // on large repos this becomes a problem
    }
  })
}
