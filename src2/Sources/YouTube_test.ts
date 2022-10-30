import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'
import { AbstractQuery, Thing } from '../types.ts'
import { YouTube } from './YouTube.ts'
import './YouTubeStubs.ts'

const key = Deno.env.get('YOUTUBE_KEY')
if (!key) throw new Error('Missing YouTube API key')
const testSource = new YouTube({ channel: 'BibleProjectDutch', key: 'stubbed' })

const ensureNoDuplicates = (...items: Array<Array<Thing>>) => {
  const all = items.flatMap(nestedItems => nestedItems.map(item => item['@id']))
  const ids = new Set(all)
  assertEquals(all.length, ids.size)
}

// I have got this from: https://www.youtube.com/c/BibleProjectDutch/videos
// JSON.stringify([...document.querySelectorAll('#video-title')].map(item => item.innerText.includes()))
const titles = ["Overzicht 1-3 Johannes","Overzicht: 2 Petrus","Overzicht: 1 Petrus","Overzicht: Jakobus","Overzicht: Hebreeën","Overzicht: Filemon","Overzicht: Titus","Overzicht: 2 Timoteüs","Overzicht: 1 Timoteüs","Overzicht: 2 Tessalonicenzen","Overzicht: 1 Tessalonicenzen","Overzicht: Kolossenzen","Overzicht: Filippenzen","Overzicht: Efeziërs","Overzicht: Galaten","Overzicht: 2 Korintiërs","Overzicht: 1 Korintiërs","Overzicht: Romeinen 5-16","Overzicht: Romeinen 1-4","Overzicht: Handelingen 13-28","Overzicht: Handelingen 1-12","Overzicht: Lucas 10-24","Overzicht: Lucas 1-9","Overzicht: Johannes 13-21","Overzicht: Johannes 1-12","Overzicht: Marcus","Overzicht: Matteüs 14-28","Overzicht: Matteüs 1-13","Overzicht: Nieuwe Testament","Overzicht: 1-2 Kronieken","Overzicht: Daniël","Overzicht: Klaagliederen","Overzicht: Maleachi","Overzicht: Zacharia","Overzicht: Haggai","Overzicht: Sefanja","Overzicht: Habakuk","Overzicht: Nahum","Overzicht: Micha","Overzicht: Jona","Overzicht: Obadja","Overzicht: Amos","Overzicht: Joël","Overzicht: Hosea","Overzicht: Ezechiël 34-48","Overzicht: Ezechiël 1-33","Overzicht: Jeremia","Overzicht: Jesaja 40-66","Agape — Liefde","Vreugde","Sjalom — Vrede","Hoop","Overzicht: Jesaja 1-39","Overzicht: Hooglied","Overzicht: Prediker","Overzicht: Spreuken","Overzicht: Psalmen","Overzicht: Job","Overzicht: Ester","Overzicht: Ezra-Nehemia","Overzicht: 1-2 Koningen","Overzicht: 1 Samuel","Overzicht: Ruth","Overzicht: Rechters","Overzicht: 2 Samuel","Overzicht: Jozua","Overzicht: Deuteronomium","Overzicht: Numeri","Overzicht: Leviticus","Overzicht: Exodus 19-40","Overzicht: Exodus 1-18","Overzicht: Genesis 12-50","Overzicht: Genesis 1-11","Overzicht: Oude Testament / TeNaCh","Handelingen, hoofdstuk 21-28","Handelingen, hoofdstuk 13-20","Handelingen, hoofdstuk 8-12","Handelingen, hoofdstuk 1-7","Lucas, hoofdstuk 24","Het Lucasevangelie, hoofdstuk 19-23","Het Lucasevangelie, hoofdstuk 9-19","Het Lucasevangelie, hoofdstuk 3-9","De Geboorte van Jezus - het Lucasevangelie, hoofdstuk 1-2"]

Deno.test('Fetching data', async () => {
  const itemsPerRequest = 20

  const query: AbstractQuery = {
    limit: itemsPerRequest,
    offset: 0,
    fulltextSearch: 'Overzicht'
  }

  const results1 = await testSource.fetcher.execute(query)
  assertEquals(results1.items.length, itemsPerRequest)
  assertEquals(results1.done, false)
  ensureNoDuplicates(results1.items)

  const results2 = await testSource.fetcher.execute(query, results1.pagination)
  assertEquals(results2.items.length, itemsPerRequest)
  assertEquals(results2.done, false)
  ensureNoDuplicates(results1.items, results2.items)

  const results3 = await testSource.fetcher.execute(query, results2.pagination)
  assertEquals(results3.items.length, itemsPerRequest)
  assertEquals(results3.done, false)
  ensureNoDuplicates(results1.items, results2.items, results3.items)

  const results4 = await testSource.fetcher.execute(query, results3.pagination)
  assertEquals(results4.items.length, 10)
  assertEquals(results4.done, true)
  ensureNoDuplicates(results1.items, results2.items, results3.items, results4.items)

  const totalItems = [
    ...results1.items, 
    ...results2.items, 
    ...results3.items, 
    ...results4.items
  ]

  const overzichtTitles = titles.filter(title => title.toLocaleLowerCase().includes('overzicht'))
  assertEquals(totalItems.length, overzichtTitles.length)
})