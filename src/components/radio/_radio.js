import AuRadioGroup from '../radio-group/_radio-group.js'

const AuRadio = Vue.extend({
  template: require('./_radio.jade'),
  model: {
    prop: 'checkedValue',
    event: 'input'
  },
  props: {
    checkedValue: [String, Number],
    value: [String, Number],
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checked () {
      return this.model === this.value
    },
    isGroup () {
      return this.$parent instanceof AuRadioGroup
    },
    model: {
      get () {
        return this.isGroup ? this.$parent.value : this.checkedValue
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
  methods: {
    clickHandler () {
      if (this.disabled) {
        return
      }

      this.model = this.value
    }
  }
})

Vue.component('au-radio', AuRadio)

export default AuRadio
