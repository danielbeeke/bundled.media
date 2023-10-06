import { FetchAll } from "../../Fetchers/FetchAll.ts"
import { FetcherInterface, SourceInterface, AbstractQuery, LocalMechanismsInterface } from '../../types.ts'
import { AngelStudiosRawItem, AngelStudiosOptions } from './AngelStudiosTypes.ts'
import { cache } from '../../Helpers/CacheDecorator.ts'
import { slugify } from "https://deno.land/x/slugify/mod.ts"

export class AngelStudios implements SourceInterface<AngelStudiosRawItem> {

  options: AngelStudiosOptions

  public whitelistedDomains: Array<string> = [
    'api.angelstudios.com'
  ]

  public fetcher: FetcherInterface

  constructor (options: AngelStudiosOptions) {
    this.options = options

    const localMechanisms: LocalMechanismsInterface = {
      fulltextSearch: true,
      languageFilter: true
    }

    this.fetcher = new FetchAll(
      this.fetch.bind(this), 
      (item) => item,
      localMechanisms,
    )
  }

  get label () {
    return 'Angel Studios'
  }

  get identifier () {
    return `angelstudios`
  }

  /**
   * The main fetch method. Grabs every thing in one fetch, but it does filter.
   */
  @cache
  async fetch (fetched: typeof globalThis.fetch, _query: AbstractQuery) {
    const graphqlQuery = `
      query Episodes {
        projects {
          name
          seasons {
            name      
            episodes {
              name
              poster       
              subtitle
              description
              posterCloudinaryPath
              episodeNumber
              source {
                url
              }
            }
      
          }
        }
      }    
    `

    const response = await fetched('https://api.angelstudios.com/graphql', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        operationName: 'Episodes',
        query: graphqlQuery,
        variables: {}
      })
    })

    const results = await response.json()

    const cloudinaryPrefix = 'https://images.angelstudios.com/image/upload/f_auto,c_limit,w_3840,q_auto/c_fill,q_auto,ar_16:9,g_north/'

    const items = results.data.projects
    .flatMap((project: any) => {
      return project.seasons.flatMap((season: any) => {
        return season.episodes.map((episode: any) => {
          return episode?.source?.url ? {
            '@type': 'VideoObject',
            '@id': 'https://angelstudios.com/' + slugify(`${project.name} ${season.name} ${episode.name}`),
            name: `${project.name} ${season.name} ${episode.name}`,
            url: episode?.source?.url,
            description: episode.description,
            inLanguage: 'en',
            thumbnail: [{
              url: {
                '@value': episode.poster?.replace('.tiff', '.jpeg') ?? (episode.posterCloudinaryPath ? `${cloudinaryPrefix}${episode.posterCloudinaryPath.replace('.tiff', '.jpeg')}` : null)
              }
            }]
          } : null
        }).filter(Boolean)
      })
    })

    return { items }
  }

  /**
   * Used for static filtering
   */
  types () {
    return ['VideoObject']
  }
}