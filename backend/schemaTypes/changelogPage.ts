import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

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

const portableTextBlocks = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'Título 2', value: 'h2'},
      {title: 'Título 3', value: 'h3'},
      {title: 'Citação', value: 'blockquote'},
    ],
    marks: {
      annotations: [
        defineArrayMember({
          name: 'link',
          title: 'Link',
          type: 'object',
          fields: [defineField({name: 'href', title: 'URL', type: 'url', validation: (rule) => rule.required()})],
        }),
      ],
    },
  }),
]

export default defineType({
  name: 'changelogPage',
  title: 'Página de changelog',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    localizedString('title', 'Título', true),
    defineField({
      name: 'content',
      title: 'Conteúdo',
      type: 'object',
      fields: [
        defineField({name: 'pt', title: 'Português', type: 'array', of: portableTextBlocks}),
        defineField({name: 'en', title: 'English', type: 'array', of: portableTextBlocks}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.pt',
    },
  },
})
