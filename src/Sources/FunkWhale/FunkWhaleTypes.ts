import { sourceOptions } from '../../types.ts'

export type FunkWhaleRawItem = {
  cover:           Cover;
  album:           Album;
  uploads:         Upload[];
  listen_url:      string;
  tags:            string[];
  attributed_to:   AttributedTo;
  id:              number;
  fid:             string;
  mbid:            null;
  title:           string;
  artist:          Artist;
  creation_date:   Date;
  is_local:        boolean;
  position:        number;
  disc_number:     null;
  downloads_count: number;
  copyright:       null;
  license:         string;
  is_playable:     boolean;
}

export type Album = {
  id:            number;
  fid:           string;
  mbid:          null;
  title:         string;
  artist:        Artist;
  release_date:  Date;
  cover:         Cover;
  creation_date: Date;
  is_local:      boolean;
  tracks_count:  number;
}

export type Artist = {
  id:                number;
  fid:               string;
  mbid:              string;
  name:              string;
  creation_date:     Date;
  modification_date: Date;
  is_local:          boolean;
  content_category:  string;
}

export type Cover = {
  uuid:          string;
  size:          number;
  mimetype:      string;
  creation_date: Date;
  urls:          Urls;
}

export type Urls = {
  source:             null;
  original:           string;
  medium_square_crop: string;
  large_square_crop:  string;
}

export type AttributedTo = {
  fid:                         string;
  url:                         null;
  creation_date:               Date;
  summary:                     null;
  preferred_username:          string;
  name:                        string;
  last_fetch_date:             Date;
  domain:                      string;
  type:                        string;
  manually_approves_followers: boolean;
  full_username:               string;
  is_local:                    boolean;
}

export type Upload = {
  uuid:       string;
  listen_url: string;
  size:       number;
  duration:   number;
  bitrate:    number;
  mimetype:   string;
  extension:  string;
  is_local:   boolean;
}


export type FunkWhaleOptions = sourceOptions & {
  label: string,
  url: string,
  channel: string
}
