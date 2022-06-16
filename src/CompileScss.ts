import sass from 'https://deno.land/x/denosass@1.0.4/mod.ts'
const watcher = Deno.watchFs('./scss')

for await (const event of watcher) {
  if (event.kind === 'modify') {
    const compile = sass('./scss/styles.scss')
    const css = compile.to_string()
    if (typeof css === 'string') Deno.writeTextFileSync('./src/Public/style.css', css)
    console.info('Compiled the css')  
  }
}