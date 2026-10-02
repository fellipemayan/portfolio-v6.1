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
  name: 'currentFocus',
  title: 'Foco atual',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    localizedString('title', 'Título', true),
    defineField({
      name: 'order',
      title: 'Ordem',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title.pt', order: 'order'},
    prepare({title, order}: {title?: string; order?: number}) {
      return {
        title: title || 'Foco atual',
        subtitle: `Ordem: ${order ?? 0}`,
      }
    },
  },
})
