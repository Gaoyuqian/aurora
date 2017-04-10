const AuTableBody = Vue.extend({
  props: {
    model: Object,
    columns: Array
  },
  render (h) {
    if (!this.model) {
      return null
    }

    const rows = this.model.rows.map((row, index) => {
      const tds = this.model.columns.map((column) => {
        const content = column.getContent(h, row, index, this)
        return h('td', [content])
      })

      return h('tr', {}, tds)
    })

    const table = h('table', [
      this.model.getColVNodes(h),
      h('tbody', rows)
    ])

    return h('div', {
      'class': 'au-table-body'
    }, [table])
  }
})

export default AuTableBody
