const TD_PADDING = 20

// TODO: Fix emit problem
const AuTableContainer = Vue.extend({
  props: {
    columns: Array,
    data: Array,
    left: Boolean
    right: Boolean,
    model: Object
  },
  updated () {
    /* const tr = this.$el.querySelector('tr')
     * if (tr) {
     *   const tds = [].filter.call(tr.querySelectorAll('td, th'), (td) => {
     *     return !td.classList.contains('au-hidden')
     *   })

     *   const width = tds.reduce((width, td) => {
     *     console.log(td.getBoundingClientRect().width)
     *     return width + td.getBoundingClientRect().width
     *   }, 0)

     *   if (width) {
     *     this.$el.style.width = width + 'px'
     *     this.$el.querySelector('table').style.width = width + 'px'
     *   }
     * }*/
  },
  render (h) {
    console.log('--------------------------------------------------------------------------------')
    console.log(this.model)
    return h('div', 'hello')
    /* const cols = this.columns.map((column) => {
     *   const width = column.auColumn.width ? String(column.auColumn.width) : '80'
     *   return h('col', { attrs: { width } })
     * })

     * const rows = this.data.map((row, index) => {
     *   return h('tr', this.columns.map((column, columnIndex) => {
     *     var content
     *     const Ctor = column.auColumn.$scopedSlots.default
     *     const data = column.auColumn.$vnode.data
     *     const style = data.staticStyle || data.style || {}

     *     if (Ctor) {
     *       content = Ctor({
     *         data: row,
     *         index: index
     *       })
     *     } else if (column.auColumn.type === 'checkbox') {
     *       style.width = style.width || '56px'
     *       content = [h('au-checkbox', {
     *         domProps: {
     *           checkedValue: column.auColumn.isCheckedRow(row)
     *         },
     *         on: {
     *           input: (value) => {
     *             column.auColumn.toggleCheckedRow(row, value)
     *             this.$nextTick(() => {
     *               this.$forceUpdate()
     *               this.getTable().$emit('select', column.auColumn.model)
     *             })
     *           }
     *         }
     *       })]
     *     } else {
     *       content = this.getAttr(row, column.auColumn.attrName)
     *     }

     *     if (column.auColumn.nowrap && index === 0) {
     *       this.$nextTick(() => {
     *         const trs = this.$el.querySelectorAll('tbody tr')
     *         var width = 0
     *         var tr, tds, td

     *         for (let i = 0; i < trs.length; i++) {
     *           tr = trs[i]
     *           tds = tr.querySelectorAll('td')

     *           td = tds[columnIndex]
     *           width = Math.max(width, td.querySelector('.au-table-cell').offsetWidth + TD_PADDING * 2 + 5)
     *         }
     *         if (width > 0) {
     *           for (let i = 0; i < trs.length; i++) {
     *             tr = trs[i]
     *             tds = tr.querySelectorAll('td')
     *             td = tds[columnIndex]
     *             td.style.width = width + 'px'
     *           }
     *         }
     *       })
     *     }

     *     return h(
     *       'td',
     *       {
     *         'class': {
     *           'au-table-head': column.auColumn.highlight,
     *           'au-hidden': !column.isShow
     *         },
     *         style
     *       },
     *       [h('div', {
     *         'class': 'au-table-cell'
     *       }, content)]
     *     )
     *   }))
     * })

     * const tableContent = [
     *   h('colgroup', cols)
     * ]

     * if (!this.noHeader) {
     *   const ths = this.columns.map((column) => {
     *     const content = column.auColumn.label
     *     const style = {}

     *     if (column.auColumn.type === 'checkbox') {
     *       const checkedCount = column.auColumn.getCheckedCount()
     *       const length = this.data.length

     *       style.width = style.width || '56px'

     *       content = [h('au-checkbox', {
     *         domProps: {
     *           checkedValue: length > 0 && checkedCount === length,
     *           indeterminate: checkedCount > 0 && checkedCount < length
     *         },
     *         on: {
     *           input: (value) => {
     *             this.setAllChecked(column, value)
     *           }
     *         }
     *       })]
     *     }
     *     return h('th', {
     *       style,
     *       'class': {
     *         'au-hidden': !column.isShow
     *       }

     *     }, content)
     *   })

     *   tableContent.push(
     *     h('thead', [h('tr', ths)])
     *   )
     * }

     * tableContent.push(
     *   h('tbody',rows)
     * )

     * return h('div', {
     *   'class': {
     *     'table-container': true,
     *     'table-container-left': this.left,
     *     'table-container-right': this.right
     *   }
     * }, [h('div', {
     *   'class': 'table-container-inner'
     * }, [h('table', tableContent)])])*/
  },
  methods: {
    getTable () {
      return this.$parent
    },
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
    setAllChecked (column, isChecked) {
      const length = this.data.length
      if (isChecked) {
        column.auColumn.model = this.data
      } else {
        column.auColumn.model = []
      }
      this.$nextTick(() => {
        this.$forceUpdate()

        this.getTable().$emit('select', column.auColumn.model)
        this.getTable().$emit('select.all', column.auColumn.model)
      })
    }
  }
})

export default AuTableContainer
