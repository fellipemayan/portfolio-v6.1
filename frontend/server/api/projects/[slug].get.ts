type ProjectRecord = Record<string, unknown>

const metadataProjection = `{
  title,
  description,
  year,
  projectDate,
  duration,
  role,
  tags[] { _key, title },
  toolsAndskills[] { _key, title },
  externalLinks[] { label, url },
  isComingSoon,
  isPasswordProtected,
  thumbnailImage {
    "horizontal": { "asset": { "url": horizontal.asset->url } },
    "vertical": { "asset": { "url": vertical.asset->url } },
    alt
  }
}`

const fullProjectProjection = `{
  ...,
  thumbnailImage {
    "horizontal": { "asset": { "url": horizontal.asset->url } },
    "vertical": { "asset": { "url": vertical.asset->url } },
    alt
  },
  content {
    pt[] {
      ...,
      _type == "contentImage" => { ..., "asset": { "url": asset->url } }
    },
    en[] {
      ...,
      _type == "contentImage" => { ..., "asset": { "url": asset->url } }
    }
  },
  gallery[] { "asset": { "url": asset->url }, alt, caption }
}`

const querySanity = async <T>(event: Parameters<typeof useRuntimeConfig>[0], query: string, slug: string) => {
  const config = useRuntimeConfig(event)
  const endpoint = `https://${config.sanityProjectId}.api.sanity.io/v${config.sanityApiVersion}/data/query/${config.sanityDataset}`
  const url = new URL(endpoint)

  url.searchParams.set('query', query)
  url.searchParams.set('$slug', JSON.stringify(slug))

  const response = await $fetch<{result: T}>(url.toString(), {
    headers: config.sanityApiReadToken
      ? {Authorization: `Bearer ${config.sanityApiReadToken}`}
      : undefined,
  })

  return response.result
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({statusCode: 400, statusMessage: 'Slug do projeto ausente.'})
  }

  const project = await querySanity<ProjectRecord | null>(
    event,
    `*[_type == "project" && slug.current == $slug][0] ${metadataProjection}`,
    slug,
  )

  if (!project) {
    throw createError({statusCode: 404, statusMessage: 'Projeto não encontrado.'})
  }

  if (project.isPasswordProtected === true) {
    return {project, requiresPassword: true}
  }

  const fullProject = await querySanity<ProjectRecord | null>(
    event,
    `*[_type == "project" && slug.current == $slug][0] ${fullProjectProjection}`,
    slug,
  )

  return {project: fullProject || project, requiresPassword: false}
})
