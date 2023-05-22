import { sourceOptions } from '../../types.ts'

export type PeerTubeRawItem = {
  id:                    number;
  uuid:                  string;
  shortUUID:             string;
  url:                   string;
  name:                  string;
  category:              Category;
  licence:               Category;
  language:              Category;
  privacy:               Category;
  nsfw:                  boolean;
  truncatedDescription:  string;
  description:           string;
  isLocal:               boolean;
  duration:              number;
  views:                 number;
  viewers:               number;
  likes:                 number;
  dislikes:              number;
  thumbnailPath:         string;
  previewPath:           string;
  embedPath:             string;
  createdAt:             Date;
  updatedAt:             Date;
  publishedAt:           Date;
  originallyPublishedAt: Date;
  isLive:                boolean;
  account:               Account;
  channel:               Account;
}

export type Account = {
  id:          number;
  displayName: string;
  name:        string;
  url:         string;
  host:        string;
  avatars:     Avatar[];
  avatar?:     Avatar;
}

export type Avatar = {
  width:     number;
  path:      string;
  createdAt: Date;
  updatedAt: Date;
}

export type Category = {
  id:    number | null | string;
  label: string;
}


export type PeerTubeOptions = sourceOptions & {
  label: string,
  playlist: string,
  url: string,
}
