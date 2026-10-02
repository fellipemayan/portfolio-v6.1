const queries = {
  currentFocus: '*[_type == "currentFocus" && isVisible != false] | order(order asc, _createdAt asc){title}',
  experiences: '*[_type == "professionalExperience" && isVisible != false] | order(order asc, startDate desc){title, company, employmentType, location, startDate, endDate, isCurrent, description, "logoUrl": logo.asset->url, "logoAlt": logo.alt}',
  education: '*[_type == "educationEntry" && isVisible != false] | order(order asc, startDate desc){title, institution, startDate, endDate, isCurrent, description}',
  research: '*[_type == "researchEntry" && isVisible != false] | order(order asc, publicationYear desc){title, event, location, publicationYear, description, publicationUrl}',
  clients: '*[_type == "clientEntry" && isVisible != false] | order(name.pt asc){name}',
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const endpoint = `https://${config.sanityProjectId}.api.sanity.io/v${config.sanityApiVersion}/data/query/${config.sanityDataset}`
  const querySanity = async (query: string) => {
    const url = new URL(endpoint)
    url.searchParams.set('query', query)

    const response = await $fetch<{result: unknown}>(url.toString(), {
      headers: config.sanityApiReadToken
        ? {Authorization: `Bearer ${config.sanityApiReadToken}`}
        : undefined,
    })

    return response.result
  }

  const [currentFocus, experiences, education, research, clients] = await Promise.all([
    querySanity(queries.currentFocus),
    querySanity(queries.experiences),
    querySanity(queries.education),
    querySanity(queries.research),
    querySanity(queries.clients),
  ])

  return {currentFocus, experiences, education, research, clients}
})
