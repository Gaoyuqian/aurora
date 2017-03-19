const AuForm = Vue.extend({
  template: require('./_form.jade'),
  props: {
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: [Number, String],
      default: ''
    }
  }
})

Vue.component('au-form', AuForm)

export default AuForm
