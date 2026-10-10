const homeQuery = `{
  "homePage": *[_type == "homePage"][0] {
    hero,
    roles,
    "resumePt": resume.pt.asset->url,
    "resumeEn": resume.en.asset->url
  },
  "projects": *[_type == "project"] | order(featuredOrder asc) {
    _id,
    title,
    slug,
    description,
    category,
    tags,
    externalLinks,
    thumbnailImage {
      horizontal { 
        asset-> {
          url,
          metadata { palette }
        } 
      },
      vertical { 
        asset-> {
          url,
          metadata { palette }
        } 
      },
      alt
    }
  }
}`

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const endpoint = `https://${config.sanityProjectId}.api.sanity.io/v${config.sanityApiVersion}/data/query/${config.sanityDataset}`
  const url = new URL(endpoint)
  url.searchParams.set('query', homeQuery)

  const response = await $fetch<{result: {homePage?: unknown; projects?: unknown[]}}>(url.toString(), {
    headers: config.sanityApiReadToken
      ? {Authorization: `Bearer ${config.sanityApiReadToken}`}
      : undefined,
  })

  return response.result
})
