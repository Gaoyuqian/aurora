const ROW_SPANS = 24
const AuFlexItem = Vue.extend({
  template: `<div class="au-flex-item" :style="styleObj"><slot></slot></div>`,
  props: {
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
    styleObj () {
      const style = {}

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
  },
  data () {
    return {
      // set by AuFlex
      columnMode: false
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateUI)
  },
  mounted () {
    this.updateUI()
    window.addEventListener('resize', this.updateUI)
  },
  updated () {
    this.updateUI()
  },
  methods: {
    updateUI () {
      if (!(this.span || this.offset)) {
        return
      }

      const containerOuterWidth = this.$parent.getOuterWidth()
      const gutter = this.$parent.gutter / 2
      const span = Math.min(ROW_SPANS, parseInt(this.span, 10))
      const offset = Math.min(ROW_SPANS, parseInt(this.offset, 10))
      const itemWidth = span ? (containerOuterWidth * (span / ROW_SPANS) - gutter * 2) : null
      const itemOffset = offset ? (containerOuterWidth * (offset / ROW_SPANS) + gutter) : null

      if (itemWidth) {
        this.$el.style.width = `${itemWidth}px`
      }

      if (itemOffset) {
        this.$el.style.marginLeft = `${itemOffset}px`
      }
    }
  }
})

Vue.component('au-flex-item', AuFlexItem)

export default AuFlexItem
