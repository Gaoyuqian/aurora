const AuCheckbox = Vue.extend({
  template: require('./_checkbox.jade'),
  props: {
    nativeValue: {
      type: [String, Number, Boolean],
      default () {
        return true
      }
    },
    value: [String, Number, Boolean, Array],
    label: String,
    indeterminate: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (this.nativeValue === true && (this.value == null || this.value === '')) {
      this.$emit('input', false)
    }
  },
  computed: {
    checked () {
      return Array.isArray(this.value)
           ? this.value.indexOf(this.nativeValue) > -1
           : this.value === this.nativeValue
    }
  },
  methods: {
    clickHandler ($event) {
      if (this.disabled) {
        return
      }

      if (Array.isArray(this.value)) {
        const value = this.value.slice()
        const pos = value.indexOf(this.nativeValue)

        if (this.checked) {
          if (pos > -1) {
            value.splice(pos, 1)
          }
        } else {
          if (pos === -1) {
            value.push(this.nativeValue)
          }
        }

        this.$emit('input', value)
      } else {
        this.$emit('input', this.checked ? (this.nativeValue === true ? false : '') : this.nativeValue)
      }
    }
  }
})

Vue.component('au-checkbox', AuCheckbox)

export default AuCheckbox
