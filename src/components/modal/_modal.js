const AuModal = Vue.extend({
  template: require('./_modal.jade'),
  props: {
    label: String,
    icon: String,
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeHandler () {
      this.$emit('input', false)
    }
  }
})

Vue.component('au-modal', AuModal)

export default AuModal
