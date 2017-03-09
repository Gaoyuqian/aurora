import TableColumn from '../table-column/_table-column.js'
const TD_PADDING = 20

Vue.component('au-table', {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    noHeader: Boolean
  },
  data () {
    return {
      columns: []
    }
  },
  mounted () {
    this.columns = this.$slots.default.filter((slot) => { return slot.tag }).map((slot) => {
      return slot.componentInstance
    })
  },
  render (h) {
    const rows = this.data.map((row, index) => {
      return h('tr', this.columns.map((column, columnIndex) => {
        const Ctor = column.$scopedSlots.default
        const data = column.$vnode.data
        const style = data.staticStyle || data.style || {}

        if (Ctor) {
          content = Ctor({
            data: row,
            index: index
          })
        } else if (column.type === 'checkbox') {
          style.width = style.width || '56px'
          content = [h('au-checkbox', {
            domProps: {
              value: column.isCheckedRow(row)
            },
            on: {
              input: (value) => {
                column.toggleCheckedRow(row, value)
                this.$nextTick(this.$forceUpdate)
              }
            }
          })]
        } else {
          content = row[column.attrName]
        }

        if (column.autoWidth && index === 0) {
          this.$nextTick(() => {
            const trs = this.$el.querySelectorAll('tbody tr')
            var width = 0
            var tr, tds, td

            for (let i = 0; i < trs.length; i++) {
              tr = trs[i]
              tds = tr.querySelectorAll('td')

              td = tds[columnIndex]
              width = Math.max(width, td.querySelector('.au-table-cell').offsetWidth + TD_PADDING * 2 + 5)
            }
            console.log(width)

            if (width > 0) {
              for (let i = 0; i < trs.length; i++) {
                tr = trs[i]
                tds = tr.querySelectorAll('td')
                td = tds[columnIndex]
                td.style.width = width + 'px'
              }
            }
          })
        }

        return h(
          'td',
          {
            'class': { 'au-table-head': column.isHead },
            style
          },
          [h('div', {
            'class': 'au-table-cell'
          }, content)]
        )
      }))
    })

    const tableContent = []

    if (!this.noHeader) {
      const ths = this.columns.map((column) => {
        const content = column.label
        const style = {}

        if (column.type === 'checkbox') {
          const checkedCount = column.getCheckedCount()
          const length = this.data.length

          style.width = style.width || '56px'

          content = [h('au-checkbox', {
            domProps: {
              value: checkedCount === length,
              indeterminate: checkedCount > 0 && checkedCount < length
            },
            on: {
              input: (value) => {
                this.setAllChecked(column, value)
              }
            }
          })]
        }
        return h('th', {
          style,
        }, content)
      })

      tableContent.push(
        h('thead', [h('tr', ths)])
      )
    }

    tableContent.push(
      h('tbody',rows)
    )

    return h(
      'div',
      {
        'class': 'au-table'
      },
      [
        h('div', {'class': 'au-table-hidden'}, [this.$slots.default]),
        h('table', tableContent)
      ]
    )
  },
  methods: {
    setAllChecked (column, isChecked) {
      const length = this.data.length
      if (isChecked) {
        column.model = this.data
      } else {
        column.model = []
      }
      this.$forceUpdate()
    }
  }
})
