import { FetchByToken } from 'pagination/FetchByToken'

class YoutubeSource implements Source {

  constructor () {
    this.fetcher = new FetchByToken((abstractQuery, token) => {
      const rawItems = fetch(`https://example.com/books?langCode=${abstractQuery.langCode}&search=${abstractQuery.search}&token=${token}`)

      return {
        items: rawItems,
        nextToken: nextToken
      }
    }, {
      supportsFulltextSearch: true,
      supportsLangcodeSearch: true,
    })
  }

  normalize (item: RawYouTubeItem): SchemaThing {
    return {
      name: item.title
      ...
    }
  }
  
}

const bibleProjectNl = new YoutubeSource('bibleprojectnl', youtubekey)


// abstractQuery wordt een type
// Andre is voor streaming
// Het is wel complexer, misschien Rxjs

const things = await bibleProjectNl.fetch({
  search: 'Dorie',
  limit: 20,
  page: 7,
  bcp47: 'en-US-Cyrl',

})










DataSource {

  fetchByPage () {}
  fetchByOffsetAndLimit () {}
  fetchByToken () {}
  fetchAll () {}
  
  final PageExtractor
  final OffsetAndLimitExtractor
  
  // rest
  // graphql
  // anything
  }
  
  
  import { FetchByToken } from 'pagination/FetchByToken'
  
  class YoutubeSource extends Source {
  
    constructor () {
      this.fetch = new FetchByToken((abstractQuery, token) => {
    
      })
    }
    
    fetch (abstractQuery) {}
    
  }
  
  
  const fetchByToken = (callback: () => { items: Thing[], nextToken: string | null }) => {
  