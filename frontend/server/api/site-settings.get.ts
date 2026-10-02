const siteSettingsQuery = '*[_type == "siteSettings"][0]{version, lastUpdated}'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const endpoint = `https://${config.sanityProjectId}.api.sanity.io/v${config.sanityApiVersion}/data/query/${config.sanityDataset}`
  const url = new URL(endpoint)
  url.searchParams.set('query', siteSettingsQuery)

  const response = await $fetch<{result: unknown}>(url.toString(), {
    headers: config.sanityApiReadToken
      ? {Authorization: `Bearer ${config.sanityApiReadToken}`}
      : undefined,
  })

  return response.result
})
