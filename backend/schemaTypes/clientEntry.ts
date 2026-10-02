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

export default defineType({
  name: 'clientEntry',
  title: 'Cliente',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    localizedString('name', 'Nome', true),
    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name.pt',
    },
  },
})
