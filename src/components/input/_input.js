const AuInput = Vue.extend({
  props: {
    type: {
      type: String,
      default: 'text',
      validator (value) {
        return value === 'text' || value === 'textarea'
      }
    },
    name: String,
    placeholder: String,
    value: String,
    readonly: {
      type: Boolean,
      default: false
    },
    rows: [String, Number],
    cols: [String, Number],
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  render (h) {
    if (this.type === 'text') {
      return h(
        'input',
        {
          'class': {
            'au-input': true,
            'active': this.active,
            'disabled': this.disabled
          },
          attrs: {
            type: 'text',
            placeholder: this.placeholder
          },
          on: {
            blur: this.onBlur,
            focus: this.onFocus,
            keyup: ($event) => {
              this.$emit('input', $event.target.value)
            }
          },
          domProps: {
            value: this.value,
            readOnly: this.readonly,
            disabled: this.disabled
          }
        }
      )
    } else {
      return h(
        'textarea',
        {
          'class': {
            'au-input': true,
            'active': this.active,
            'disabled': this.disabled
          },
          attrs: {
            type: 'text',
            placeholder: this.placeholder,
            rows: this.rows,
            cols: this.cols
          },
          on: {
            blur: this.onBlur,
            focus: this.onFocus,
            keyup: ($event) => {
              this.$emit('input', $event.target.value)
            }
          },
          domProps: {
            value: this.value,
            readOnly: this.readonly,
            disabled: this.disabled
          }
        }
      )
    }
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
