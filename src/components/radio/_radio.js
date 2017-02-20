import AuRadioGroup from '../radio-group/_radio-group.js'

const AuRadio = Vue.extend({
  // template: require('./_radio.jade'),
  props: {
    value: [String, Number],
    nativeValue: [String, Number],
    label: String
  },
  computed: {
    isGroup () {
      return this.$parent instanceof AuRadioGroup
    },
    model: {
      get () {
        return this.isGroup ? this.$parent.value : this.value
      },
      set (value) {
        if (this.isGroup) {
          this.$parent.$emit('input', value)
        } else {
          this.$emit('input', value)
        }
      }
    }
  },
  render (h) {
    return h(
      'label',
      {
        class: 'au-radio'
      },
      [
        h('input', {
          attrs: {
            type: 'radio',
            value: this.nativeValue
          },
          domProps: {
            checked: this.model === this.nativeValue
          }
          on: {
            change: ($event) => {
              this.model = this.nativeValue
            }
          }
        }),
        h('i'),
        (this.label ? this.label : this.$slots.default)
      ]
    )
  }
})

Vue.component('au-radio', AuRadio)

export default AuRadio
