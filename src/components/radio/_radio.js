import AuRadioGroup from '../radio-group/_radio-group.js'

const AuRadio = Vue.extend({
  template: require('./_radio.jade'),
  props: {
    value: [String, Number],
    nativeValue: [String, Number],
    label: String
  },
  computed: {
    checked () {
      return this.model === this.nativeValue
    },
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
  methods: {
    clickHandler () {
      this.model = this.nativeValue
    }
  }
})

Vue.component('au-radio', AuRadio)

export default AuRadio
