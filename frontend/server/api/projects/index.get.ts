const projectsQuery = '*[_type == "project" && isVisible != false] | order(projectDate desc, _createdAt desc){slug, title, category, description, isComingSoon, isVisible, tags[]{_key, title}, externalLinks[]{label, url}, "thumbnailHorizontalUrl": thumbnailImage.horizontal.asset->url, "thumbnailVerticalUrl": thumbnailImage.vertical.asset->url, "thumbnailAlt": thumbnailImage.alt}'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const endpoint = `https://${config.sanityProjectId}.api.sanity.io/v${config.sanityApiVersion}/data/query/${config.sanityDataset}`
  const url = new URL(endpoint)
  url.searchParams.set('query', projectsQuery)

  const response = await $fetch<{result: unknown[]}>(url.toString(), {
    headers: config.sanityApiReadToken
      ? {Authorization: `Bearer ${config.sanityApiReadToken}`}
      : undefined,
  })

  return response.result
})
