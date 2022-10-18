export default ({ title, body, preloadModules }: { title: string, body: string, preloadModules: Array<string> }) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>

      ${preloadModules.map((module: string) => `<link rel="modulepreload" as="script" href="${module}">`).join('\n')}

      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" defer rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
      <link href="/styles.css" rel="stylesheet" defer>
    </head>
  <body>
    <div class="p-3 mx-auto">
      <h3 class="mb-4"><a href="/">${title}</a></h3>
      <div id="app">
        ${body}
      </div>
    </div>
  </body>
  </html>
`