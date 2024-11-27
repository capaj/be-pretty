import { spawn, SpawnOptions } from 'child_process'

// poor man's execa
export function executeCommand(
  command: string,
  args: string[],
  spawnParams: SpawnOptions = { stdio: 'ignore' }
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, spawnParams)
    child.on('exit', (code) => {
      if (code === 0) resolve(code)
      else reject(new Error(`Command failed with exit code ${code}`))
    })
    child.on('error', reject)
  })
}
