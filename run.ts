/**
 * When running bundled.media with this wrapper script it makes sure it can only fetch from the APIs that are attached.
 * It will also limit read and  write access.
 * This is done to prevent supply chain attacks.
 */
import { generatePermisions, PermissionOptions } from 'https://raw.githubusercontent.com/danielbeeke/better_permissions/master/mod.ts' // Audited
import { dataSources } from './.env.ts'
import { cachedir } from 'https://deno.land/x/cache@0.2.13/directories.ts'

// Grabs the URLs from all the APIs
const urls = dataSources().map(source => {
  const url = new URL(source.url)
  return url.hostname
}).filter(Boolean)

const options: PermissionOptions = {
  env: true,
  net: [
    '0.0.0.0:8080',
    ...urls,
  ],
  read: [
    './env',
    './src/Public/index.html',
    './src/Public/api.js',
    './src/Public/favicon.ico',
    '/home/daniel/.cache/deno',
    cachedir()
  ],
  write: [
    cachedir()
  ],
  hrtime: false,
  run: false,
  watch: Deno.args.includes('--watch')
}

const flags = generatePermisions(options)
const p = Deno.run({ cmd: ['deno', 'run', ...flags, 'src/Index.ts']})
await p.status()