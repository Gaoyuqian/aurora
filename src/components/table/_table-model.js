class TableColumn {
  constructor (column) {
    this.originColumn = column
    this.title = column.label
    this.prop = column.attrName
    this.width = column.width || 80
    this.fixed = column.fixed
    this.fixedType = ''
  }

  getTitle (h, table) {
    return h('div', {
      'class': 'au-table-cell'
    }, this.title)
  }

  getContent (h, data, index, table) {
    const column = this.originColumn
    const prop = this.prop
    const Ctor = column.$scopedSlots.default
    const vdata = column.$vnode.data
    const style = vdata.staticStyle || vdata.style || {}
    var content

    if (Ctor) {
      content = Ctor({
        data,
        index: index
      })
    } else if (column.type === 'checkbox') {

      // TODO: remove following code
      style.width = style.width || '56px'
      content = [h('au-checkbox', {
        domProps: {
          checkedValue: column.isCheckedRow(data)
        },
        on: {
          input: (value) => {
            column.toggleCheckedRow(data, value)
            this.$nextTick(() => {
              this.$forceUpdate()
              table.$emit('select', column.model)
            })
          }
        }
      })]
    } else {
      content = this.getAttr(data, prop)
    }

    return h('div', {
      'class': 'au-table-cell'
    }, content)
  }

  getAttr (obj, attr) {
    const key = '([\\w\\$]+)'
    const origAttr = attr
    const origObj = JSON.stringify(obj)

    attr = attr.replace(new RegExp('^' + key), (_, value) => {
      try {
        obj = obj[value]
      } catch (e) {
        console.error(`Cannot get value by ${origAttr} in AuTable`, origObj)
        obj = ''
      }
      return ''
    })

    while (attr) {
      let found = false
      attr = attr.replace(new RegExp('^\\.' + key + '|^\\[' + key + '\\]'), (_, value1, value2) => {
        const value = value1 || value2
        try {
          obj = obj[value]
          found = true

        } catch (e) {
          console.error(`Cannot get value by ${origAttr} in AuTable`, origObj)
          obj = ''
        }
        return ''
      })

      if (!found) {
        if (attr) {
          console.error(`cannot match attr-name: ${attr} in AuTable`, origObj)
        }
        break
      }
    }

    return obj
  }
}

export class TableModel {
  constructor (table) {
    this.table = table
    this.rows = table.data
    this.initColumns()
    this.updateModel()
    this.tableWidth = null
    this.tableScrollLeft = null
    this.tableScrollTop = null
    this.tableHeadHeight = null
  }

  updateModel () {
    this.timestamp = new Date()
  }

  initColumns () {
    const columns = this.table.columns
    this.columns = columns.map((column) => {
      return new TableColumn(column)
    })
    this.initLeftFixedColumns()
    this.initRightFixedColumns()
  }

  initLeftFixedColumns () {
    this.leftColumns = []
    const continuous = true
    var length = this.columns.length
    const fixed = []

    for (let i = 0; i < length; i++) {
      let column = this.columns[i]
      if (column.fixed) {
        column.fixedType = 'left'
        this.leftColumns.push(column)
      } else {
        break
      }
    }
  }

  initRightFixedColumns () {
    this.rightColumns = []
    const continuous = true
    var length = this.columns.length
    const fixed = []

    for (let i = length - 1; i >= 0; i--) {
      let column = this.columns[i]
      if (column.fixed) {
        column.fixedType = 'right'
        this.rightColumns.push(column)
      } else {
        break
      }
    }
  }

  getColVNodes (h) {
    const cols = this.columns.map((column) => {
      const width = column.width
      const options = {}

      if (width) {
        options.attrs = {
          width
        }
      }
      return h('col', options)
    })

    return h('colgroup', cols)
  }
}

Object.defineProperty(TableModel.prototype, 'minWidth', {
  get: function() {
    return this.columns.reduce((sum, column) => {
      return sum + (column.width)
    }, 0);
  },
  set: function(newValue) {

  },
  enumerable: true,
  configurable: true
});
