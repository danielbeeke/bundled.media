# bundled.media

## Introduction

What if we could bundle most of the Christian media together for ministries to find media for their audiences?
I believe we can do this together.

## How to run

- Install Deno: https://deno.land/
- Copy .env.default.ts to .env.ts and configure it
- deno run --allow-run --allow-env run.ts --watch

## Technical idea

Imagine a piece of open source software that people can install on their servers and use that as an API to search all the Christian media. This system will search all media publishers at once and pass through the data. It will be lightweight in that there is not database and not much state in it. The main gist is that it generates links to use for pagination, meaning you can first fetch the first 40 items and then get the next 40. These items will be mixed from the different sources. This involves so complexity.

Every media publisher can write code to get their source integrated. This requires a very good abstraction that has few methods to implement to get this going.

### Installation / updating
- Every consumer needs to install their own instance
  - Needs a CORS (https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) whitelist so we can limit or allow use.
  - A centralized open one could be made in the future.
- We advice to run the Deno script with --reload and a linux daemon service that restarts it every couple of days
  - If we really go for such a crude way we need DTAP (development / testing / acceptance / production) streets.
  - We could also have an update button in a UI that is behind a password set in the .env
- It must be possible to enable/disable publishers in .env.

### Underlaying ideas
- No file sharing, only hotlinking to source media, so it is purely metadata.
- No database (but we do want a cache such as Redis, or a file cache, it might be Denos tmp cache mechanism in scoped folder)
  - Pros: decentralized costs of running, but centralized functionality via a shared codebase on GitHub.
  - Single source of truth, we fetch right from the source.
    - What to do when publishers have no API? We can build a seperate API / platform for that and add that DataSource in the future
    - Publishers should create an API anyways to be flexible in the future for their own apps, so it might be an incentive too.
- Deno for supply chain attacks, meaning we must whitelist all used web domains
- People can add their own API implemented in a DataSource by a GitHub pull request
- Will we support an authenticated part where publishers have more grip on what is used?
- Publishers that require a valid API access key can be done via .env
- Would it be possible to run this in cloud workers? Lambda etc? Probably not in free CloudFlare because of time.

### Documentation
- We need documentation for different levels of technical understanding so that we will have adoptation of media publishers with license challenges but also so that technical people will implement their own DataSource.
- Documentation is a direct reflection of the code, also for logos of media publishers etc
- API hints should be inside the response, people might learn of this by opening endpoints in the console
- We could offer consultancy for implementers with challenges working out how to implement DataSource correctly.
- GitHub pages for the documentation
- Levels of documentation
  - Installation on a production server
  - Installation for local development
  - Usage of the endpoints
  - Requirements for an integration / Developing an integration
  - Scope of project, who is allowed to join, what kind of requirements do we have?
  - Which organization back this product?
  - Quality assurance

### Core implementation
- The URL query should be transformed to an abstract Query which is then used to call the DataSource
- We can override the maximum time of cache.
- We need an abstract class such as DataSource
- Should language(s) be a required URL argument?
- Fetches of data or DataSources in general should have a timeout. When nothing is returned this indicates that the source is done.
- What if it kind of works like hypermedia in a way that if you open an endpoint in the browser it shows a UI and when you do a fetch with headers that it returns JSON?
- We can use Web Workers for multi threading

### UI usage
- We can have support for streaming results (also add resorting of data)
  - In the UI people could either unwind the data (meaning fetching the given next url untill none is given) or show a streaming interface with a search button that starts / pauses the stream.
- Pagination could put state of each source into the next url that could be returned as metadata of the response (similar to JSONAPI)
  - Downside, this will give ugly URLs
  - The good is though that with this me might have less state in the application, and possible less memory usage
  - Somehow a DataSource needs to comunicate back which items it has used when we do sorting. Suppose we would fetch 2 or 3 times more data than needed for pragmatic sorting, and then mix all sources, hopefully have a sorted source API and pointer in the next URL where to start in the data set.
- The UI should make sure requests are canceled when not needed and only do requests when the user is totally sure it wants to request something.
  - Queryies might run a whole minute on the server streaming results.. so we need as little initiated requests as possible for a given search task.
- We can have different strategies for sorting such as pragmatic, none and full. Buffered sorting?
  - Pragmatic sorts everything as new items return
  - None does not sort
  - Full awaits everything and then sorts
- I would like to have a demo instance running on bundled.media with configured CORS settings.

### Quality
- It must be tested very well with the standard Deno test framework
- We can use GitHub actions for CI etc.
- We can create tests that use stubs of the real data.

### Data
- It should be possible to filter on type beforehand. Types such as video / ebook etc.
- All language identifiers must be normalized to bcp47
- Outputs: RDF, JSON-ld, JSON, HTML?
- All the data should be normalized by their DataSource
- What is the smallest data set per media item that we must have?
  - file URL
  - Publisher information > DataSource
  - Venacular title
  - Broader used language title and its bcp47
  - Language in bcp47
  - Type of the media normalized to schema.org
- Optional properties to support:
  - Publication date
  ...
- What is the smallest data set we need of a publisher?
  - contact information
  - URL
  - Description
  - Name
  - Logo
  - Fallback license > We do NOT want licensing issues.

### Envisioned endpoints
- /search?langcodes=nl_NL,de-AT&title=*The search text*
- /data/[startsWith:bcp47]/[publisher_short_code]/[the_given_id]/~[the_given_title]/~[hash_of_filename]
  - ~ denotes that if this value is not given or when it is not found it will be ignored when filtering.
  - When ~ is not given it will be redirected to it
- /redirect/[startsWith:bcp47]/[publisher_short_code]/[the_given_id]
- Future when a common taxonomy is made: /data/[startsWith:bcp47]/[category_slug]/[publisher_short_code:the_given_id]/~[the_given_title]/~[hash_of_filename]
- Future /sparql
  - If this is possible that would be awesome. Might be complex and we can only support a subset of query commands.

## Challenges

- When is the response too slow? 3 seconds? 10 seconds? 30 seconds?
- Unique identifiers
  - The publishers have different skillsets so a variation of stableness can be expected.
  - We can do something with the filename, the given ID and mash that together like in the section: _Envisioned endpoints_
    - Taking off parts of this URL reveals a broader set of data. When something is lost that might be a way of finding it back (when the publisher has changed it drastically).
- Changing data source URLs
  - Like described in the above item we would have own identifiers consisting of multiple factors from the source. With these we can possible setup something like purl.org for Christian media. Purl.org is a redirect repository for URLs that should outlive domain changes. 
- Statistics, how to send back usage information?
  - We could give an extra URL that could be used instead of the original media / video URL. When that URL is called this software does a redirect but also triggers an event on the DataSource so that a method in YourDataSource can do a call to some publisher specific statistics server.
- Deduplication of media, multiple source may have the same media.
  - We could have a method inside DataSource that claims certain names with a RegEx such as JesusFilm.
- Cache invalidation
- Should we allow a people-group inside the bcp47?
- Data validation with SHACL?
- What are we going to do with invalid bcp47 codes? Invalidated data? Just skip them? Inform the publishers, how to do that centralized?

## Future ideas

- Statistics of usage to a timeseries database system such as InfluxDB. This might be easpecially interesting for a centralized one. It should not be a requirement to use this component.

## Deno (libraries) that might be interesting

- https://github.com/rafaelmotaalves/better_permissions
- https://deno.land/manual/node/import_maps
- https://deno.land/x/cache@0.2.13
- https://deno.land/x/validify@v0.2.0