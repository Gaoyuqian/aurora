const AuForm = Vue.extend({
  template: require('./_form.jade'),
  props: {}
})

Vue.component('au-form', AuForm)

export default AuForm
