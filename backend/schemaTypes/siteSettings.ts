import {CogIcon} from '@sanity/icons/Cog'
import {LinkIcon} from '@sanity/icons/Link'
import {defineArrayMember, defineField, defineType} from 'sanity'

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'pt',
        title: 'Português',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'en',
        title: 'English',
        type: 'string',
      }),
    ],
  })

export default defineType({
  name: 'siteSettings',
  title: 'Configurações do site',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'version',
      title: 'Número da versão',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Data da última atualização',
      type: 'date',
      options: {dateFormat: 'DD/MM/YYYY'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Links de redes sociais',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'socialLink',
          title: 'Link de rede social',
          type: 'object',
          icon: LinkIcon,
          fields: [
            localizedString('name', 'Nome'),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
            }),
            defineField({
              name: 'order',
              title: 'Ordem',
              type: 'number',
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
            select: {
              title: 'name.pt',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'version',
      subtitle: 'lastUpdated',
    },
    prepare({title, subtitle}: {title?: string; subtitle?: string}) {
      return {
        title: title ? `Versão ${title}` : 'Configurações do site',
        subtitle,
      }
    },
  },
})
