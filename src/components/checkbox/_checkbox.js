const AuCheckbox = Vue.extend({
  template: require('./_checkbox.jade'),
  props: {
    name: String,
    value: String,
    label: String
  }
})

Vue.component('au-checkbox', AuCheckbox)

export default AuCheckbox
