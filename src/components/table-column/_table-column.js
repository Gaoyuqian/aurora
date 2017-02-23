const tableColumn = Vue.extend({
  template: '<div><slot></slot></div>',
  props: {
    label: String
  },
})


Vue.component('au-table-column', tableColumn)

export default tableColumn
