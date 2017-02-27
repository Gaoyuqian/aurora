const AuFormGroup = Vue.extend({
  template: require('./_form-group.jade'),
  props: {
    label: {
      type: String,
      default: ''
    }
  }
})

Vue.component('au-form-group', AuFormGroup)

export default AuFormGroup
