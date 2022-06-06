import { generatePermisions, PermissionOptions } from 'https://raw.githubusercontent.com/danielbeeke/better_permissions/master/mod.ts' // Audited

const options: PermissionOptions = {
  env: true,
  net: ['0.0.0.0:8080'],
  read: [
    './env',
    './src/Public/index.html'
  ],
  write: ['/tmp'],
  hrtime: false,
  run: false,
  watch: Deno.args.includes('--watch')
}

const flags = generatePermisions(options)
const p = Deno.run({ cmd: ['deno', 'run', ...flags, 'src/Index.ts']})
await p.status()