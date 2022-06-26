/**
 * When running bundled.media with this wrapper script it makes sure it can only fetch from the APIs that are attached.
 * It will also limit read and  write access.
 * This is done to prevent supply chain attacks.
 */
import { generatePermisions, PermissionOptions } from 'https://raw.githubusercontent.com/danielbeeke/better_permissions/master/mod.ts' // Audited
import { dataSources } from './.env.ts'
import { cachedir } from 'https://deno.land/x/cache@0.2.13/directories.ts'

// Grabs the URLs from all the APIs
const urls = dataSources().map(source => source.url.hostname).filter(Boolean)

const cache = cachedir()

const options: PermissionOptions = {
  env: true,
  net: [
    '0.0.0.0:8080',
    'deno.land',
    'www.googleapis.com',
    'yt.lemnoslife.com',
    ...urls,
  ],
  read: [
    cache,
    './',
    './scss',
    './env',
    './src/Public/api.js',
    './src/Public/favicon.ico',
  ],
  write: [
    cache,
    './src/Public/style.css'
  ],
  hrtime: false,
  run: false,
  watch: Deno.args.includes('--watch')
}

const flags = generatePermisions(options)
const p = Deno.run({ cmd: ['deno', 'run', ...flags, 'src/App.ts']})
await p.status()