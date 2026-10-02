type ProjectAccessRecord = {
  accessPassword?: string
  isPasswordProtected?: boolean
}

type ProjectRecord = Record<string, unknown>

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
  const body = await readBody<{password?: string}>(event)
  const password = body?.password?.trim()
  const config = useRuntimeConfig(event)

  if (!slug || !password) {
    throw createError({statusCode: 400, statusMessage: 'Informe a senha do projeto.'})
  }

  const access = await querySanity<ProjectAccessRecord | null>(
    event,
    `*[_type == "project" && slug.current == $slug][0]{isPasswordProtected, accessPassword}`,
    slug,
  )

  if (!access || access.isPasswordProtected !== true) {
    throw createError({statusCode: 404, statusMessage: 'Projeto não encontrado.'})
  }

  if (password !== access.accessPassword) {
    throw createError({statusCode: 401, statusMessage: 'Senha incorreta.'})
  }

  const project = await querySanity<ProjectRecord | null>(
    event,
    `*[_type == "project" && slug.current == $slug][0] ${fullProjectProjection}`,
    slug,
  )

  if (!project) {
    throw createError({statusCode: 404, statusMessage: 'Projeto não encontrado.'})
  }

  return {project}
})
