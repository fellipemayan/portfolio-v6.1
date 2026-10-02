import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'

const localizedString = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'pt',
        title: 'Português',
        type: 'string',
        validation: (rule) => (required ? rule.required() : rule),
      }),
      defineField({
        name: 'en',
        title: 'English',
        type: 'string',
      }),
    ],
  })

const localizedText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({name: 'pt', title: 'Português', type: 'text', rows: 4}),
      defineField({name: 'en', title: 'English', type: 'text', rows: 4}),
    ],
  })

export default defineType({
  name: 'researchEntry',
  title: 'Pesquisa',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    localizedString('title', 'Título', true),
    localizedString('event', 'Evento ou contexto'),
    localizedString('location', 'Localização'),
    defineField({
      name: 'publicationYear',
      title: 'Ano de publicação',
      type: 'number',
      validation: (rule) => rule.integer().min(1900).max(2200),
    }),
    localizedText('description', 'Descrição'),
    defineField({
      name: 'publicationUrl',
      title: 'URL da publicação',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Ordem',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title.pt',
      subtitle: 'event.pt',
    },
  },
})
