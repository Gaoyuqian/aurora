console.log(require('./_input.tpl'))
const AuInput = Vue.extend({
  template: require('./_input.tpl'),
  props: {
    name: String,
    placeholder: String
  },
  methods: {
    onFocus ($event) {
      this.$emit('focus', $event)
    },
    onBlur ($event) {
      this.$emit('blur', $event)
    }
  }
})

Vue.component('au-input', AuInput)

export default AuInput
