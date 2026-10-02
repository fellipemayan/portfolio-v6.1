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
  name: 'educationEntry',
  title: 'Formação acadêmica',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    localizedString('title', 'Curso ou formação', true),
    localizedString('institution', 'Instituição', true),
    defineField({
      name: 'startDate',
      title: 'Data de início',
      type: 'date',
      options: {dateFormat: 'MM/YYYY'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Data de término',
      type: 'date',
      options: {dateFormat: 'MM/YYYY'},
      hidden: ({document}) => document?.isCurrent === true,
    }),
    defineField({
      name: 'isCurrent',
      title: 'Formação atual',
      type: 'boolean',
      initialValue: false,
    }),
    localizedText('description', 'Descrição'),
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
      subtitle: 'institution.pt',
    },
  },
})
