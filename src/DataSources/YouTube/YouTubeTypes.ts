import { Thing } from '../../schema.org.ts';

type YouTubeImage = { url: string, width: number, height: number }

export type YouTubeRawItem = {
  kind: string,
  etag: string,
  snippet: {
    resourceId: { kind: string, videoId?: string, playlistId?: string },
    publishedAt: string,
    channelId: string,
    title: string,
    description: string,
    thumbnails: {
      default: YouTubeImage,
      medium: YouTubeImage,
      high: YouTubeImage
    },
    channelTitle: string,
    liveBroadcastContent: string,
    publishTime: string
  }
}

export type YouTubeOptions = {
  langCode: string | ((item: Thing) => string),
  key: string,
  channel: string
}
