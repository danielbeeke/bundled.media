import { BaseDataSource } from '../BaseDataSource.ts'
import { AbstractQuery } from '../../Core/AbstractQuery.ts'
import { Thing } from '../../schema.org.ts';
import { AngelStudiosOptions, AngelStudiosRawItem } from './AngelStudiosTypes.ts'
import { fetched } from '../../Helpers/fetched.ts'

export class AngelStudiosDataSource extends BaseDataSource<AngelStudiosOptions, AngelStudiosRawItem, Thing> {

  public label = 'Angel Studios'

  public url = new URL('https://api.angelstudios.com')

  public nativelySupports = {
    text: false,
    langCode: false,
    types: false,
    multilingualItems: false,
  }

  async fetch (query: AbstractQuery, page = 0, offset = 0) {

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
          return ({
            '@type': 'VideoObject',
            name: `${project.name} ${season.name} ${episode.name}`,
            url: episode.source.url,
            description: episode.description,
            inLanguage: 'en',
            ['http://schema.org/thumbnail']: [{
              ['http://schema.org/url']: {
                '@value': episode.poster?.replace('.tiff', '.jpeg') ?? (episode.posterCloudinaryPath ? `${cloudinaryPrefix}${episode.posterCloudinaryPath.replace('.tiff', '.jpeg')}` : null)
              }
            }]
          })
        })
      })
    })

    const calculatedOffset = (page * query.size) + offset
    const slicedRows = await items.slice(calculatedOffset, calculatedOffset + query.size)

    if (slicedRows.length < query.size) this.done = true

    return slicedRows
  }

  types () {
    return ['http://schema.org/VideoObject']
  }

}


