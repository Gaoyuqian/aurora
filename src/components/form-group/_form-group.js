const AuFormGroup = Vue.extend({
  template: require('./_form-group.jade'),
  props: {
    label: {
      type: String,
      default: ''
    },
    labelPosition: String,
    labelWidth: [Number, String]
  },
  computed: {
    labelStyle () {
      const style = {}
      const labelWidth = this.getLabelWidth()
      if (this.getLabelPosition() != 'top' && labelWidth) {
        style.width = labelWidth + 'px'
      }
      return style
    },
    isLabelTop () {
      return this.getLabelPosition() === 'top'
    },
    cls () {
      const cls = []
      const labelPosition = this.getLabelPosition()
      if (labelPosition === 'right') {
        cls.push('au-form-group-right-label')
      } else if (labelPosition === 'top') {
        cls.push('au-form-group-top-label')
      }

      return cls
    }
  },
  mounted () {

  },
  methods: {
    getLabelPosition () {
      return this.labelPosition || this.$parent.labelPosition
    },
    getLabelWidth () {
      return this.labelWidth || parseFloat(this.$parent.labelWidth)
    }
  }
})

Vue.component('au-form-group', AuFormGroup)

export default AuFormGroup
