const AuRadioGroup = Vue.extend({
  props: {
    options: {
      type: Array,
      required: false,
      default: null,
      validator (value) {
        var result = true
        value.forEach((item) => {
          result = result && 'label' in item && 'value' in item
        })
        return result
      }
    },
    value: [String, Number]
  },
  render (h) {
    const child = this.options ? this.options.map((option) => {
      return h(
        'au-radio',
        {
          props: {
            nativeValue: option.value,
            label: option.label
          }
        }
      )
    }) : this.$slots.default
    return h(
      'div',
      child
    )
  }
})

Vue.component('AuRadioGroup', AuRadioGroup)

export default AuRadioGroup
