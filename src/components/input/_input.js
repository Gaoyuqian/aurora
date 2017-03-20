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
    size: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    controlClass () {
      return {
        active: this.active,
        disabled: this.disabled
      }
    },
    inputClass () {
      const classObject = []
      classObject.push(`au-input-${this.size}`)
      return classObject
    },
    classObj () {
      const classObj = []

      if (this.active) {
        classObj.push('active')
      }

      if (this.disabled) {
        classObj.push('disabled')
      }

      return classObj
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
