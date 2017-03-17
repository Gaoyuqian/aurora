const AuFormGroup = Vue.extend({
  template: require('./_form-group.jade'),
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    labelPosition () {
      return this.$parent.labelPosition
    },
    labelWidth () {
      return parseFloat(this.$parent.labelWidth)
    },
    labelStyle () {
      const style = {}
      if (this.labelPosition != 'top' && this.labelWidth) {
        style.width = this.labelWidth + 'px'
      }
      return style
    }
  },
  mounted () {

  }
})

Vue.component('au-form-group', AuFormGroup)

export default AuFormGroup
