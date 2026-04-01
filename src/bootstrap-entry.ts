import { ensureBootstrapMacro } from './bootstrapMacro'
import { registerProcessOutputErrorHandlers } from './utils/process.js'

ensureBootstrapMacro()
registerProcessOutputErrorHandlers()

try {
  await import('./entrypoints/cli.tsx')
} catch (err) {
  const message =
    err instanceof Error ? err.stack ?? err.message : String(err)
  // biome-ignore lint/suspicious/noConsole:: fatal bootstrap failure
  console.error(`Failed to start CLI: ${message}`)
  // eslint-disable-next-line custom-rules/no-process-exit
  process.exit(1)
}
