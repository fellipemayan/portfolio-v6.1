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

const localizedText = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'pt',
        title: 'Português',
        type: 'text',
        rows: 3,
        validation: (rule) => (required ? rule.required() : rule),
      }),
      defineField({
        name: 'en',
        title: 'English',
        type: 'text',
        rows: 3,
      }),
    ],
  })

const localizedImageFields = [
  defineField({
    name: 'alt',
    title: 'Texto alternativo',
    type: 'object',
    fields: [
      defineField({name: 'pt', title: 'Português', type: 'string'}),
      defineField({name: 'en', title: 'English', type: 'string'}),
    ],
  }),
]

const portableTextBlocks = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'Heading 2', value: 'h2'},
      {title: 'Heading 3', value: 'h3'},
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
  defineArrayMember({
    name: 'contentImage',
    title: 'Imagem',
    type: 'image',
    options: {hotspot: true},
    fields: localizedImageFields,
  }),
  defineArrayMember({
    name: 'embeddedMedia',
    title: 'Mídia incorporada',
    type: 'object',
    fields: [
      defineField({
        name: 'url',
        title: 'URL de incorporação',
        type: 'url',
        description: 'Use uma URL de embed do YouTube ou Vimeo.',
        validation: (rule) =>
          rule.required().custom((value) => {
            if (!value) return true

            try {
              const hostname = new URL(value).hostname.replace(/^www\./, '')
              return ['youtube.com', 'youtu.be', 'vimeo.com', 'player.vimeo.com'].includes(hostname)
                ? true
                : 'Use uma URL do YouTube ou Vimeo.'
            } catch {
              return 'Informe uma URL válida.'
            }
          }),
      }),
      localizedString('caption', 'Legenda'),
    ],
    preview: {
      select: {title: 'caption.pt', subtitle: 'url'},
      prepare({title, subtitle}: {title?: string; subtitle?: string}) {
        return {title: title || 'Vídeo incorporado', subtitle}
      },
    },
  }),
]

export default defineType({
  name: 'project',
  title: 'Projeto',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    localizedString('title', 'Título', true),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.pt', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    localizedText('description', 'Descrição', true),
    localizedString('category', 'Categoria'),
    defineField({name: 'year', title: 'Ano', type: 'number', validation: (rule) => rule.integer()}),
    defineField({
      name: 'projectDate',
      title: 'Data do projeto',
      type: 'date',
      options: {dateFormat: 'DD/MM/YYYY'},
    }),
    defineField({
      name: 'isFeatured',
      title: 'Exibir na Home',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Ordem do destaque',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.integer().min(0),
      description: 'Usada apenas para ordenar os projetos exibidos na Home.',
      hidden: ({document}) => document?.isFeatured !== true,
    }),
    defineField({
      name: 'isPasswordProtected',
      title: 'Proteger com senha',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'accessPassword',
      title: 'Senha de acesso',
      type: 'string',
      description: 'A senha será validada no servidor antes de liberar o conteúdo do projeto.',
      hidden: ({document}) => document?.isPasswordProtected !== true,
      validation: (rule) =>
        rule.custom((value, context) => {
          const isProtected = (context.document as {isPasswordProtected?: boolean} | undefined)?.isPasswordProtected
          return isProtected && !value ? 'Informe uma senha para este projeto.' : true
        }),
    }),
    localizedString('duration', 'Duração'),
    defineField({
      name: 'role',
      title: 'Papéis',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [localizedString('title', 'Papel', true)],
          preview: {select: {title: 'title.pt'}},
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [localizedString('title', 'Nome', true)],
          preview: {select: {title: 'title.pt'}},
        }),
      ],
    }),
    defineField({
      name: 'toolsAndskills',
      title: 'Ferramentas e habilidades',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [localizedString('title', 'Nome', true)],
          preview: {select: {title: 'title.pt'}},
        }),
      ],
    }),
    defineField({
      name: 'externalLinks',
      title: 'Links externos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            localizedString('label', 'Label', true),
            defineField({name: 'url', title: 'URL', type: 'url', validation: (rule) => rule.required()}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'thumbnailImage',
      title: 'Imagem principal',
      type: 'object',
      fields: [
        defineField({name: 'horizontal', title: 'Horizontal', type: 'image', options: {hotspot: true}}),
        defineField({name: 'vertical', title: 'Vertical', type: 'image', options: {hotspot: true}}),
        ...localizedImageFields,
      ],
    }),
    defineField({
      name: 'content',
      title: 'Conteúdo',
      type: 'object',
      fields: [
        defineField({name: 'pt', title: 'Português', type: 'array', of: portableTextBlocks}),
        defineField({name: 'en', title: 'English', type: 'array', of: portableTextBlocks}),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: localizedImageFields,
        }),
      ],
    }),
    defineField({name: 'isComingSoon', title: 'Em breve', type: 'boolean', initialValue: false}),
    defineField({name: 'isVisible', title: 'Visível', type: 'boolean', initialValue: true}),
    defineField({
      name: 'order',
      title: 'Ordem legada',
      type: 'number',
      initialValue: 0,
      hidden: true,
      description: 'Mantido para compatibilidade com projetos cadastrados anteriormente.',
    }),
  ],
  preview: {
    select: {title: 'title.pt', subtitle: 'slug.current', media: 'thumbnailImage.horizontal'},
  },
})
