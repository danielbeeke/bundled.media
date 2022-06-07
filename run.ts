import { generatePermisions, PermissionOptions } from 'https://raw.githubusercontent.com/danielbeeke/better_permissions/master/mod.ts' // Audited
import { dataSources } from './.env.ts'

const urls = dataSources().map(source => {
  const url = new URL(source.url)
  return url.hostname
}).filter(Boolean)

console.log(urls)

const options: PermissionOptions = {
  env: true,
  net: [
    '0.0.0.0:8080',
    ...urls
  ],
  read: [
    './env',
    './src/Public/index.html',
    './src/Public/api.js',
    './src/Public/favicon.ico',
  ],
  write: ['/tmp'],
  hrtime: false,
  run: false,
  watch: Deno.args.includes('--watch')
}

const flags = generatePermisions(options)
const p = Deno.run({ cmd: ['deno', 'run', ...flags, 'src/Index.ts']})
await p.status()