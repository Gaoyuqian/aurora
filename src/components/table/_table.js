import TableColumn from '../table-column/_table-column.js'
const TD_PADDING = 20

const AuTable = Vue.extend({
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    noHeader: Boolean,
    loading: Boolean
  },
  data () {
    return {
      columns: []
    }
  },
  mounted () {
    this.$on('reset.column', this.resetColumns)
    this.resetColumns()
  },
  render (h) {
    var content
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
              checkedValue: column.isCheckedRow(row)
            },
            on: {
              input: (value) => {
                column.toggleCheckedRow(row, value)
                this.$nextTick(() => {
                  this.$forceUpdate()
                  this.$emit('select', column.model)
                })
              }
            }
          })]
        } else {
          content = this.getAttr(row, column.attrName)
        }

        if (column.nowrap && index === 0) {
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
            'class': { 'au-table-head': column.highlight },
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
              checkedValue: length > 0 && checkedCount === length,
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

    const children = [
      h('div', {'class': 'au-table-hidden'}, [this.$slots.default]),
      h('table', tableContent)
    ]

    if (this.data.length === 0 && !this.loading) {
      children.push(
        h('div', {
          'class': 'au-table-empty'
        },
          this.$slots.empty || '暂无内容'
        )
      )
    }

    if (this.loading) {
      children.push(
        h('div', {
          'class': 'au-table-loading'
        },
          [h('div'), h('div'), h('div'), h('div'), h('div')]
        )
      )
    }

    return h(
      'div',
      {
        'class': {
          'au-table': true
        }
      },
      children
    )
  },
  methods: {
    getAttr (obj, attrName) {
      const key = '([\\w\\$]+)'
      const origAttrName = attrName
      const origObj = JSON.stringify(obj)

      attrName = attrName.replace(new RegExp('^' + key), (_, value) => {
        try {
          obj = obj[value]
        } catch (e) {
          console.error(`Cannot get value by ${origAttrName} in AuTable`, origObj)
          obj = ''
        }
        return ''
      })

      while (attrName) {
        let found = false
        attrName = attrName.replace(new RegExp('^\\.' + key + '|^\\[' + key + '\\]'), (_, value1, value2) => {
          const value = value1 || value2
          try {
            obj = obj[value]
            found = true

          } catch (e) {
            console.error(`Cannot get value by ${origAttrName} in AuTable`, origObj)
            obj = ''
          }
          return ''
        })

        if (!found) {
          if (attrName) {
            console.error(`cannot match attr-name: ${attrName} in AuTable`, origObj)
          }
          break
        }
      }

      return obj
    },
    resetColumns () {
      this.columns = (this.$slots.default || []).filter((slot) => {
        return slot.componentInstance instanceof TableColumn
      }).map((slot) => {
        return slot.componentInstance
      })
    },
    setAllChecked (column, isChecked) {
      const length = this.data.length
      if (isChecked) {
        column.model = this.data
      } else {
        column.model = []
      }
      this.$nextTick(() => {
        this.$forceUpdate()
        this.$emit('select', column.model)
        this.$emit('select.all', column.model)
      })
    }
  }
})

Vue.component('au-table', AuTable)

export default AuTable
