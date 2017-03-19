const ROW_SPANS = 24
const AuFlexItem = Vue.extend({
  template: `<div class="au-flex-item" :class="classObj" :style="styleObj"><slot></slot></div>`,
  props: {
    flex: {
      type: [Boolean, String, Number],
      default: null
    },
    order: {
      type: String,
      default: null
    },
    grow: {
      type: String,
      default: null
    },
    shrink: {
      type: String,
      default: null
    },
    basis: {
      type: String,
      default: null
    },
    alignSelf: {
      type: String,
      default: null
    },
    span: {
      type: [String, Number],
      default: null
    },
    offset: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    classObj () {
      const classObj = []

      if (this.span) {
        classObj.push(`au-flex-item-span-${this.span}`)
      }

      if (this.offset) {
        classObj.push(`au-flex-item-offset-${this.offset}`)
      }

      return classObj
    },
    styleObj () {
      const style = {}
      const gutter = parseFloat(this.$parent.gutter)

      if (gutter) {
        style['padding'] = (gutter / 2) + 'px'
      }

      if (this.flex === true || this.flex === '') {
        style['flex'] = '1'
      } else if (this.flex) {
        style['flex'] = String(this.flex)
      }

      if (this.order) {
        style['order'] = this.order
      }

      if (!this.columnMode && this.grow) {
        style['flex-grow'] = this.grow
      }

      if (this.shrink) {
        style['flex-shrink'] = this.shrink
      }

      if (this.basis) {
        style['flex-basis'] = this.basis
      }

      if (this.alignSelf) {
        style['align-self'] = this.alignSelf
      }

      return style
    }
  }
})

Vue.component('au-flex-item', AuFlexItem)

export default AuFlexItem
