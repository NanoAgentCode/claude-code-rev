#!/usr/bin/env node

const { spawnSync } = require('node:child_process')
const path = require('node:path')

const entry = path.join(__dirname, '..', 'src', 'bootstrap-entry.ts')
const args = process.argv.slice(2)

const result = spawnSync('bun', ['run', entry, ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.error) {
  console.error(
    `Failed to launch bun. Ensure Bun >= 1.3.5 is installed. ${result.error.message}`,
  )
  process.exit(1)
}

process.exit(result.status ?? 1)
