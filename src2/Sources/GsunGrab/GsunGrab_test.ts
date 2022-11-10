import { doMultipleRequests } from '../../Helpers/doMultipleRequests.ts'
import './GsunGrabStubs.ts'
import { gsunGrabSource } from './GsunGrabTestSource.ts'

Deno.test('Fetching data', async () => {
  await doMultipleRequests({ limit: 20 }, gsunGrabSource.fetcher, 2, 3)
  await doMultipleRequests({ limit: 10 }, gsunGrabSource.fetcher, 3, 3)
  await doMultipleRequests({ limit: 70 }, gsunGrabSource.fetcher, 1, 23)
})