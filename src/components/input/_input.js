const AuInput = Vue.extend({
  template: require('./_input.jade'),
  props: {
    type: {
      type: String,
      default: 'text',
      validator (value) {
        return ['text', 'textarea', 'password'].indexOf(value) > -1
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
    },
    icon: String
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

      if (this.icon) {
        classObject.push('au-input-with-icon')
      }
      return classObject
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
    },
    onClickIcon ($event) {
      this.$emit('click-icon', $event)
    },
    onMouseOverIcon ($event) {
      this.$emit('mouseover-icon', $event)
    },
    onMouseOutIcon ($event) {
      this.$emit('mouseout-icon', $event)
    }
  }
})

Vue.component('au-input', AuInput)

export default AuInput
