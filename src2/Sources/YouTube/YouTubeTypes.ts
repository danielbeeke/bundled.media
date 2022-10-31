export type YouTubeOptions = {
  channel: string,
  key: string
}

type YouTubeImage = { url: string, width: number, height: number }

export type RawYouTubeItem = {
  kind: string,
  etag: string,
  defaultAudioLanguage: string,
  defaultLanguage: string,
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
    defaultAudioLanguage: string,
    defaultLanguage: string
  }
}