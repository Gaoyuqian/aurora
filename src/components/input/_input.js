const AuInput = Vue.extend({
  template: require('./_input.jade'),
  props: {
    type: {
      type: String,
      default: 'text',
      validator (value) {
        return value === 'text' || value === 'textarea'
      }
    },
    placeholder: String,
    value: String,
    rows: [String, Number],
    cols: [String, Number],
    readonly: Boolean,
    disabled: Boolean,
    active: Boolean,
    headingIcon: String,
    tailingIcon: String
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.value = value
      }
    },
    classObject () {
      return {
        active: this.active,
        disabled: this.disabled
      }
    }
  },
  methods: {
    onFocus ($event) {
      this.$emit('focus', $event)
    },
    onBlur ($event) {
      this.$emit('blur', $event)
    },
    onKeyup ($event) {
      this.$emit('input', $event.target.value)
    }
  }
})

Vue.component('au-input', AuInput)

export default AuInput
