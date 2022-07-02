# What is bundled.media?

See a demo at [bundled.media](https://bundled.media)

<details open>
<summary><strong>Gateway to Christian media</strong></summary>
<br>

Bundled.media is a software product that is (in time) a gateway / API to the vast landscape of Christian media. 

It aggregates and normalizes the media meta data. It makes it possible to filter by language code (bcp47), a search term, media type and hopefully in the future by category.

The media itself such as the video or audio files are not touched, this product is only about meta data (so it _does_ contain a link to the source media).

The idea is a that each media consumer installs the product for their own usage. With this decentralization consumers are able to add credentials for protected sources. Also when there is heavy usage of it, the consumer pays for the computational costs.

</details>

<details>
<summary><strong>Unique identifiers</strong></summary>
<br>

To allow for a unified global gateway to Christian media, we need unique identifiers. One of the world its standards for this are URIs / URLs. An URI (uniform resource identifier) is very similar to an URL. A URL is also known as a link. Example link: https://example.com/hello-world. The main difference is that a URI does not need to resolve to a resource. Our ideal is to have resolvable identifiers so URLs are better, but URIs are allowed. 

YouTube URLs can be used as unique identifiers. Some media publishers, publish the same video to YouTube and also to Vimeo, so how will we deal with that? We could have a file inside this repository containing data that tells that one YouTube link is the same as one Vimeo link. The RDF technology allows for such use cases. We would need to have a canonical URL, the primary one. Other URLs can resolve to the same video / media item. This way we would have unique identifiers. 

We can have fallbacks to aliasses if the YouTube one is not available anymore. Media publishers should take the responsiblity to have their unique identifiers as stable as they can provide, but sometimes things might happen, that are hard to prevent or it might even be out of the control of the media publisher. Hence the need for a way of aliassing.

</details>

<details>
<summary><strong>Usage statistics for media publishers</strong></summary>
<br>

When media is used, we want to send back usage statistics to the media publisher. One way of implementing this is by having media publisher specific functionality when a certain URL is called. This would require media consumers who want to use media offline, to call this specific URL when the device is back online. The main target audience for this are the wifi boxes such as ConnectBox and others.

This would require usage of special crafted URLs. We do not make the consumers very dependent on bundled.media, we would prefer a better way. One option would be to have the special URL also contain the source URL. 

Example: `https://organization-c-bundled.media/open/https://www.youtube.com/watch?v=5mZFXfYEYRY`

This would be good when a consumer decides to no longer use bundled.media. It would even allow for storing the target source URL in the database and when calling that, prefix it with the URL of their bundled.media instance. A similar trick is used for image resizing services such as images.weserve.nl.

Intergration into existing systems is peanuts because only this URL needs to be added in the templating layer. When the URL is not known / not claimed by a DataSource a redirect does happen.

</details>

<details>
<summary><strong>Usage statistics for media consumers</strong></summary>
<br>

What if consumers could see what media is often used? We want to create a way to have insight into the statistics. It might be an option to opt in for world wide media statistics, and when that mode is used, and consumers do use a specific URL that first calls this product and then redirects to the source URL, that it would send statistics to an aggregating place, a time series database that keeps track of usage. This URL is described in 'Usage statistics for media publishers'.

</details>

<details>
<summary><strong>A global taxonomy to categorize media</strong></summary>
<br>

With unique identifiers in place we also create categories for an identifier. Imagine searching through the vast landscape of Christian media with categories. The great thing with the proposed solution is that categorization does not need to happen at the media publisher. Initiatives could be created where a taxonomy is created for the top 600 media items from the Christian media landscape. 

Imagine a taxonomy of categories, another taxonomy for keywords, one for target audience, one with ministry categories or a taxonomy that targets the audience where they are in their journey with Christ (see the gray matrix). These taxonomies can al be different initiatives started by different organizations or working groups. At some stage we would only need to support them here in bundled.media.

We hope to bootstrap a taxonomy of categories. We hope to create one that will become the standard taxonomy for christian media. The scope of this product is not fully described here. We will start with English but hope to translate into many languages. We will begin small with a small set of categories and will put effort into create logical categorization similar to library systems.

This taxonomy will make it possible for ministries to have systems where they search for media, curate media, apply that media to their website, and have their audience filter media in a very good way.

</details>

<details>
<summary><strong>Notifications for new media</strong></summary>
<br>

Would it be possible to subscribe to a search query, so that when new content is found you can get a notification? This would be awesome and ministries / media consumers could subscribe to media that would perfectly fit their audience. This might be a sub product that periodically calls bundled.media.  

</details>

<br>

# Technical details

## Stack for bundled.media core
- Deno TypeScript
- Cache on the hard disk (might be using Redis in the future)
- images.weserve.nl for image thumbnails

## Technical ideas

- Decentralization of instances, centralization of code
- The source APIs remain the source of truth so we have no database
- Identifiers that come from the source in the form of URLs
- Fully protected agains supply chain attacks via a run wrapper that only allows whitelisted domains

## Installation

- Install Deno: https://deno.land/
- Copy .env.default.ts to .env.ts and configure it
- deno run --allow-run --allow-env run.ts --watch

# Problems and solutions

<details>
<summary><strong>A YouTube video is uploaded, used and then taken offline and reuploaded</strong></summary>
<br>

When using the URL scheme as described at 'Usage statistics for media publishers' a failing URL is notices by the statistics component. Technically we would be able to create a component where people could subscribe to a failing URL. When this URL would be propagated qnot by YouTube itself but by an API of a Media Publisher it is even possible to notify the publisher that media consumers are using their broken URL.

The next step would be to add the broken URL to the list of URL aliasses in the media.bundled repository (not yet existing). That file would be read each time a URL is used that is returning a 404. A challenge there is partitioning. It should be a design requirement that the memory of bundled.media is emptied after each request. We should not have too much memory in use while idle because that would not scale very well. This means that the current solution is only a direction and not a full idea for a solution yet.

The reason for this is: A YouTube URL may be from any Media Publisher. To make the link between these two we could have a map but loading maps of hundredth of thousands of links is not good for the memory. A possible solution is to make these on the hard disk in a way that we can easily resolve. We could base64 encode them and see if the file exists for example.

</details>

