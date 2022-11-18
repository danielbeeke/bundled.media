import { sourceOptions } from '../../types.ts'

interface Live {
    streaming: boolean;
    archived: boolean;
}

interface StaffPick {
    normal: boolean;
    best_of_the_month: boolean;
    best_of_the_year: boolean;
    premiere: boolean;
}

interface Badges {
    hdr: boolean;
    live: Live;
    staff_pick: StaffPick;
    vod: boolean;
    weekend_challenge: boolean;
}

interface Embed {
    html: string;
    badges: Badges;
}

interface Privacy {
    view: string;
    embed: string;
    download: boolean;
    add: boolean;
    comments: string;
}

interface Size {
    width: number;
    height: number;
    link: string;
    link_with_play_button: string;
}

interface Pictures {
    uri: string;
    active: boolean;
    type: string;
    base_link: string;
    sizes: Size[];
    resource_key: string;
    default_picture: boolean;
}

interface Stats {
    plays?: any;
}

interface Size2 {
    width: number;
    height: number;
    link: string;
}

interface Pictures2 {
    uri: string;
    active: boolean;
    type: string;
    base_link: string;
    sizes: Size2[];
    resource_key: string;
    default_picture: boolean;
}

interface Uploader {
    pictures: Pictures2;
}

interface Comments {
    uri: string;
    options: string[];
    total: number;
}

interface Credits {
    uri: string;
    options: string[];
    total: number;
}

interface Likes {
    uri: string;
    options: string[];
    total: number;
}

interface Pictures3 {
    uri: string;
    options: string[];
    total: number;
}

interface Texttracks {
    uri: string;
    options: string[];
    total: number;
}

interface Related {
    uri: string;
    options: string[];
}

interface Recommendations {
    uri: string;
    options: string[];
}

interface Connections {
    comments: Comments;
    credits: Credits;
    likes: Likes;
    pictures: Pictures3;
    texttracks: Texttracks;
    related: Related;
    recommendations: Recommendations;
}

interface Report {
    uri: string;
    options: string[];
    reason: string[];
}

interface Interactions {
    report: Report;
}

interface Metadata {
    connections: Connections;
    interactions: Interactions;
    is_vimeo_create: boolean;
    is_screen_record: boolean;
}

interface Capabilities {
    hasLiveSubscription: boolean;
    hasEnterpriseLihp: boolean;
    hasSvvTimecodedComments: boolean;
}

interface Size3 {
    width: number;
    height: number;
    link: string;
}

interface Pictures4 {
    uri: string;
    active: boolean;
    type: string;
    base_link: string;
    sizes: Size3[];
    resource_key: string;
    default_picture: boolean;
}

interface Website {
    uri: string;
    name: string;
    link: string;
    type: string;
    description: string;
}

interface Albums {
    uri: string;
    options: string[];
    total: number;
}

interface Appearances {
    uri: string;
    options: string[];
    total: number;
}

interface Channels {
    uri: string;
    options: string[];
    total: number;
}

interface Feed {
    uri: string;
    options: string[];
}

interface Followers {
    uri: string;
    options: string[];
    total: number;
}

interface Following {
    uri: string;
    options: string[];
    total: number;
}

interface Groups {
    uri: string;
    options: string[];
    total: number;
}

interface Likes2 {
    uri: string;
    options: string[];
    total: number;
}

interface Membership {
    uri: string;
    options: string[];
}

interface ModeratedChannels {
    uri: string;
    options: string[];
    total: number;
}

interface Portfolios {
    uri: string;
    options: string[];
    total: number;
}

interface Videos {
    uri: string;
    options: string[];
    total: number;
}

interface Shared {
    uri: string;
    options: string[];
    total: number;
}

interface Pictures5 {
    uri: string;
    options: string[];
    total: number;
}

interface FoldersRoot {
    uri: string;
    options: string[];
}

interface Teams {
    uri: string;
    options: string[];
    total: number;
}

interface Connections2 {
    albums: Albums;
    appearances: Appearances;
    channels: Channels;
    feed: Feed;
    followers: Followers;
    following: Following;
    groups: Groups;
    likes: Likes2;
    membership: Membership;
    moderated_channels: ModeratedChannels;
    portfolios: Portfolios;
    videos: Videos;
    shared: Shared;
    pictures: Pictures5;
    folders_root: FoldersRoot;
    teams: Teams;
}

interface Metadata2 {
    connections: Connections2;
}

interface LocationDetails {
    formatted_address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    neighborhood?: any;
    sub_locality?: any;
    state_iso_code: string;
    country: string;
    country_iso_code: string;
}

interface User {
    uri: string;
    name: string;
    link: string;
    capabilities: Capabilities;
    location: string;
    gender: string;
    bio?: any;
    short_bio: string;
    created_time: Date;
    pictures: Pictures4;
    websites: Website[];
    metadata: Metadata2;
    location_details: LocationDetails;
    skills: any[];
    available_for_hire: boolean;
    can_work_remotely: boolean;
    resource_key: string;
    account: string;
}

interface Play {
    status: string;
}

interface App {
    name: string;
    uri: string;
}

export type VimeoRawItem = {
    uri: string;
    name: string;
    description: string;
    type: string;
    link: string;
    player_embed_url: string;
    duration: number;
    width: number;
    language: string;
    height: number;
    embed: Embed;
    created_time: Date;
    modified_time: Date;
    release_time: Date;
    content_rating: string[];
    content_rating_class: string;
    rating_mod_locked: boolean;
    license?: any;
    privacy: Privacy;
    pictures: Pictures;
    tags: any[];
    stats: Stats;
    categories: any[];
    uploader: Uploader;
    metadata: Metadata;
    user: User;
    play: Play;
    app: App;
    status: string;
    resource_key: string;
    upload?: any;
    transcode?: any;
    is_playable: boolean;
    has_audio: boolean;
}

export type VimeoOptions = sourceOptions & {
  clientId: string,
  clientSecret: string,
  channel: string,
}
