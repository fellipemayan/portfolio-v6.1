const homeQuery = '{"homePage": *[_type == "homePage"][0]{hero, "resumePt": resume.pt.asset->url, "resumeEn": resume.en.asset->url}, "projects": *[_type == "project" && isVisible != false && isFeatured == true] | order(featuredOrder asc, _createdAt desc)[0...6]{slug, title, category, description, tags[]{_key, title}, "thumbnailHorizontalUrl": thumbnailImage.horizontal.asset->url, "thumbnailAlt": thumbnailImage.alt}}'

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
