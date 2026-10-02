import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

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
