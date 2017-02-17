import AuFlexItem from './_flex-item.js'

Vue.component('au-flex', {
  template: require('./_flex.tpl'),
  props: {
    direction: {
      type: String,
      default: null
    },
    wrap: {
      type: String,
      default: null
    },
    justifyContent: {
      type: String,
      default: null
    },
    alignItems: {
      type: String,
      default: null
    },
    alignContent: {
      type: String,
      default: null
    },
    column: {
      type: [Number, String],
      default: null
    },
    gutter: {
      type: [String, Number],
      default: 0
    }
  },
  created () {
    if (this.column != null) {
      this.wrap = this.wrap || 'wrap'
    }
  },
  mounted () {
    window.addEventListener('resize', this.updateUI)
    this.updateUI()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateUI)
  },
  updated () {
    this.updateUI()
  },
  computed: {
    styleObj () {
      const style = {}

      if (this.direction) {
        style['flex-direction'] = this.direction
      }

      if (this.wrap) {
        style['flex-wrap'] = this.wrap
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

      return style
    }
  },
  methods: {

    // can call by child
    getOuterWidth () {
      const container = this.$refs.container
      const margin = (parseFloat(container.style.marginLeft) || 0) + (parseFloat(container.style.marginRight) || 0)

      if (margin > 0) {
        margin = 0
      }

      return (container.offsetWidth + margin) + Number(this.gutter)
    },
    updateUI () {
      const elemStyle = this.$refs.container.style
      const gutter = this.gutter / 2

      if (this.column != null) {
        const containerOuterWidth = this.getOuterWidth()
        const itemWidth = (containerOuterWidth / this.column) - gutter * 2
      }

      elemStyle.margin = `-${gutter}px`

      this.$children.forEach((instance) => {
        if (instance instanceof AuFlexItem) {
          const itemStyle = instance.$el.style

          if (itemWidth != null) {
            itemStyle.width = `${itemWidth}px`
            itemStyle.margin = `${gutter}px`
            instance.columnMode = true
          } else {

            // cancel column-mode, if set before
            instance.columnMode = false
            itemStyle.marginLeft = itemStyle.marginLeft || `${gutter}px`
            itemStyle.marginRight = itemStyle.marginRight || `${gutter}px`
            itemStyle.marginTop = itemStyle.marginTop || `${gutter}px`
            itemStyle.marginBottom = itemStyle.marginBottom || `${gutter}px`
          }
        }
      })
    }
  }
})
