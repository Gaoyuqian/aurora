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
    },
    inline: Boolean
  },
  computed: {
    cls () {
      const cls = []
      if (this.inline) {
        cls.push('au-form-inline')
      }
      return cls
    }
  }
})

Vue.component('au-form', AuForm)

export default AuForm
