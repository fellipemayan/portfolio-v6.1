import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

const portableTextBlocks = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Título 1', value: 'h1'},
      {title: 'Título 2', value: 'h2'},
      {title: 'Normal', value: 'normal'},
    ],
    marks: {
      decorators: [
        {title: 'Itálico', value: 'em'},
      ],
      annotations: [
        defineArrayMember({
          name: 'spanId',
          title: 'Span com ID',
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'ID',
              type: 'string',
              validation: (rule) => rule.required().regex(/^[A-Za-z][A-Za-z0-9_-]*$/),
            }),
          ],
        }),
      ],
    },
  }),
]

const localizedPortableText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({name: 'pt', title: 'Português', type: 'array', of: portableTextBlocks}),
      defineField({name: 'en', title: 'English', type: 'array', of: portableTextBlocks}),
    ],
  })

const localizedResume = defineField({
  name: 'resume',
  title: 'Currículo',
  type: 'object',
  fields: [
    defineField({
      name: 'pt',
      title: 'Português',
      type: 'file',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'file',
      options: {accept: 'application/pdf'},
    }),
  ],
})

export default defineType({
  name: 'homePage',
  title: 'Página inicial',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    localizedPortableText('hero', 'Texto do hero'),
    localizedResume,
  ],
  preview: {
    prepare() {
      return {title: 'Página inicial'}
    },
  },
})
