export type TurnStartTime = number

export type PersistedFile = {
  filename: string
  file_id: string
}

export type FailedPersistence = {
  filename: string
  error: string
}

export type FilesPersistedEventData = {
  files: PersistedFile[]
  failed: FailedPersistence[]
}

// BYOC outputs are stored under {cwd}/{sessionId}/outputs
export const OUTPUTS_SUBDIR = 'outputs'

// Soft safety limits for end-of-turn upload fanout
export const FILE_COUNT_LIMIT = 500
export const DEFAULT_UPLOAD_CONCURRENCY = 6
