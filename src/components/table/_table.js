import TableColumn from '../table-column/_table-column.js'

Vue.component('au-table', {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    }
  },
  render (h) {
    const heads = this.columns.map((column) => {
      const label = typeof column.label === 'function' ? column.label.call(column, h) : column.label
      label = Array.isArray(label) ? label : [label]

      return h('th', {
        style: column.style || null
      }, label)
    })

    const $slot = this.$slots.default

    if ($slot) {
      $slot.forEach((vnode) => {
        if (vnode.componentOptions.Ctor === TableColumn) {
          heads.push('th', {

          })
        }
      })
    }

    const rows = this.data.map((row) => {
      const tds = this.columns.map((column) => {
        if (column.content != null) {
          const content = column.content(h, row)
          content = Array.isArray(content) ? content: [content]
          return h(
            'td',
            {
              style: column.style || null
            },
            content
          )
        }
        return h(
          'td',
          {
            style: column.style || null
          },
          row[column.key]
        )
      })

      return h('tr', [
        tds
      ])
    })

    return h(
      'table',
      {
        'class': 'au-table'
      },
      [
        h('thead', [
          h('tr',
            heads
          )
        ]),
        h('tbody', [
          rows
        ])
      ]
    )
  }
})
