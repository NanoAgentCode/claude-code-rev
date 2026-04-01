import type { QuerySource } from '../constants/querySource.js'

export type QuerySourceFlags = {
  isAgentQuerySource: boolean
  isReplMainThreadSource: boolean
  isSdkQuerySource: boolean
  isMainThreadSource: boolean
}

export function getQuerySourceFlags(querySource: QuerySource): QuerySourceFlags {
  const isAgentQuerySource = querySource.startsWith('agent:')
  const isReplMainThreadSource = querySource.startsWith('repl_main_thread')
  const isSdkQuerySource = querySource === 'sdk'

  return {
    isAgentQuerySource,
    isReplMainThreadSource,
    isSdkQuerySource,
    isMainThreadSource: isReplMainThreadSource || isSdkQuerySource,
  }
}
