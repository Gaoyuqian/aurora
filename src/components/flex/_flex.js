const AuFlex = Vue.extend({
  template: require('./_flex.tpl'),
  props: {
    inline: Boolean,
    column: Boolean,
    wrap: {
      type: [String, Boolean],
      default: null
    },
    justifyContent: {
      type: String,
      default: null
    },
    alignItems: {
      type: String,
      default: 'center'
    },
    alignContent: {
      type: String,
      default: null
    },
    gutter: {
      type: [String, Number],
      default: 0
    },
    center: Boolean
  },
  computed: {
    _wrap () {
      return this.wrap === true ? 'wrap' : this.wrap
    },
    styleObj () {
      const style = {}

      if (this.inline) {
        style['display'] = 'inline-flex'
      }

      if (this.column) {
        style['flex-direction'] = 'column'
      }

      if (this._wrap) {
        style['flex-wrap'] = this._wrap
      }

      if (this.center) {
        style['justify-content'] = 'center'
      }

      if (this.justifyContent) {
        style['justify-content'] = this.justifyContent
      }

      if (this.alignItems) {
        style['align-items'] = this.alignItems
      }

      if (this.alignContent) {
        style['align-content'] = this.alignContent
      }

      const gutter = parseFloat(this.gutter)
      if (gutter) {
        style['margin'] = -(gutter / 2) + 'px'
      }

      return style
    }
  }
})

Vue.component('au-flex', AuFlex)

export default AuFlex
