export default ({ title, body }: { title: string, body: string }) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
      <link href="/style.css" rel="stylesheet">
    </head>
  <body>
    <div class="container m-5 mx-auto">
      <h1 class="mb-4"><a href="/">${title}</a></h1>
      <div id="app">
        ${body}
      </div>
    </div>
  </body>
  </html>
`