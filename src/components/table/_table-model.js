class TableColumn {
  constructor (column, tableObj) {
    this.tableObj = tableObj
    this.originColumn = column
    this.title = column.label
    this.prop = column.attrName
    this.width = column.width
    this.fixed = column.fixed
    this.type = column.type
    this.fixedType = ''
    if (column.type === 'expand') {
      if (column.defaultExpandAll) {
        this.expandRows = this.tableObj.rows.slice()
      } else {
        this.expandRows = column.expandRows || []
      }
    }

    if (!this.width) {
      if (column.type === 'checkbox' || column.type === 'expand') {
        this.width = this.width || '56'
      } else {
        this.width = 80
      }
    }
  }

  setAllChecked (column, isChecked) {
    const table = this.tableObj.table
    if (isChecked) {
      column.model = this.tableObj.rows
    } else {
      column.model = []
    }

    table.$nextTick(() => {
      table.$forceUpdate()
      table.$emit('select', column.model)
      table.$emit('select.all', column.model)
    })
  }

  getTitle (h, table) {
    if (this.type === 'expand') {
      return null
    } else if (this.type === 'checkbox') {
      const column = this.originColumn
      const checkedCount = column.getCheckedCount()
      const length = this.tableObj.rows.length

      return h('div', {'class':'au-table-cell'}, [h('au-checkbox', {
        domProps: {
          checkedValue: checkedCount === length,
          indeterminate: checkedCount > 0 && checkedCount < length
        },
        on: {
          input: (value) => {
            this.setAllChecked(column, value)
          }
        }
      })])
    }
    return h('div', {
      'class': 'au-table-cell'
    }, this.title)
  }

  getCtorContent (data, index) {
    const Ctor = this.originColumn.$scopedSlots.default
    if (!Ctor) {
      return null
    }
    return Ctor({
      data,
      index
    })
  }

  isExpand (data) {
    return this.expandRows.indexOf(data) > -1
  }

  getContent (h, data, index, table) {
    const column = this.originColumn
    const prop = this.prop
    const vdata = column.$vnode.data
    const style = vdata.staticStyle || vdata.style || {}
    var content

    if (column.type === 'checkbox') {
      content = [h('au-checkbox', {
        domProps: {
          checkedValue: column.isCheckedRow(data)
        },
        on: {
          input: (value) => {
            column.toggleCheckedRow(data, value)
            this.tableObj.table.$nextTick(() => {
              this.tableObj.table.$forceUpdate()
              table.$emit('select', column.model)
            })
          }
        }
      })]
    } else if (column.type === 'expand') {
      const pos = this.expandRows.indexOf(data)
      content = [
        h(
          'div',
          {
            'class': {
              'au-table-expand-icon': true,
              'active': pos > -1
            },
            on: {
              click: () => {
                if (pos === -1) {
                  this.expandRows.push(data)
                } else {
                  this.expandRows.splice(pos, 1)
                }
              }
            }
          },
          [h('au-icon', {
            domProps: {
              icon: 'caret-right'
            }
          })])
      ]
    } else {
      content = this.getCtorContent(data, index) || this.getAttr(data, prop)
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
      return new TableColumn(column, this)
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
