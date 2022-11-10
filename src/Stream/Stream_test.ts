import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'
import { serve } from 'https://deno.land/std@0.163.0/http/server.ts'

import { Stream } from './Stream.ts'
import { excelSource } from '../Sources/Excel/ExcelTestSource.ts'
import { apiBibleSource } from '../Sources/ApiBible/ApiBibleTestSource.ts'
import { gsunGrabSource } from '../Sources/GsunGrab/GsunGrabTestSource.ts'
import { jesusFilmSource } from '../Sources/JesusFilm/JesusFilmTestSource.ts'
import { lightNetSource } from '../Sources/LightNet/LightNetTestSource.ts'
import { youTubeSource } from '../Sources/YouTube/YouTubeTestSource.ts'

import '../Sources/ApiBible/ApiBibleStubs.ts'
import '../Sources/GsunGrab/GsunGrabStubs.ts'
import '../Sources/JesusFilm/JesusFilmStubs.ts'
import '../Sources/LightNet/LightNetStubs.ts'
import '../Sources/YouTube/YouTubeStubs.ts'

Deno.test('Fetching data', async () => {
  const query = {
    limit: 20,
    // fulltextSearch: 'Dorie'
  }

  const sources = [
    excelSource,
    apiBibleSource,
    gsunGrabSource,
    jesusFilmSource,
    lightNetSource,
    youTubeSource
  ]

  const searcher = new Stream(sources)

  const port = 8080;

  const handler = (request: Request): Response => {
    const stream = searcher.execute(query)
    return new Response(stream, { 
      status: 200,
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
     })
  }
  
  const servePromise = serve(handler, { port })

  await servePromise
})