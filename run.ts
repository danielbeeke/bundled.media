/**
 * When running bundled.media with this wrapper script it makes sure it can only fetch from the APIs that are attached.
 * It will also limit read and  write access.
 * This is done to prevent supply chain attacks.
 */
import { generatePermisions, PermissionOptions } from 'https://raw.githubusercontent.com/danielbeeke/better_permissions/master/mod.ts' // Audited
import { dataSources } from './.env.ts'
import { cachedir } from 'https://deno.land/x/cache@0.2.13/directories.ts'
import { importMapToPreload } from './src/Helpers/importMapToPreload.ts'
import * as fs from "https://deno.land/std/fs/mod.ts";
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
    'unpkg.com',
    'cdn.jsdelivr.net',
    ...urls,
  ],
  read: true,
  write: [
    cache,
    './public/'
  ],
  hrtime: false,
  run: false,
  watch: Deno.args.includes('--watch')
}

try {
  await fs.emptyDir('./public/vendor');
  Deno.removeSync('./public/vendor')
}
catch (exception) {
  console.error(exception)
}

const vendor = Deno.run({ cmd: 'deno vendor public/search.ts --output public/vendor'.split(' ')})
await vendor.status()

const preloadModules = importMapToPreload()

try {
  await fs.emptyDir('./public/vendor');
  Deno.removeSync('./public/vendor')
}
catch (exception) {
  console.error(exception)
}

Deno.writeTextFileSync('./public/preloadmodules.json', JSON.stringify(preloadModules, null, 2))

const flags = generatePermisions(options)
const p = Deno.run({ cmd: ['deno', 'run', '--unstable', ...flags, 'src/App.ts']})
await p.status()