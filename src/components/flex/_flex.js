import dispatch from '../../mixins/_dispatch'
import AuFlexItem from './_flex-item.js'

const AuFlex = Vue.extend({
  template: require('./_flex.tpl'),
  mixins: [dispatch],
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
  mounted () {
    this.$on('update.ui', this.updateUI)
    window.addEventListener('resize', this.resizeHandler)
    this.updateUI()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
  },
  updated () {
    this.updateUI()
  },
  computed: {
    _wrap () {
      return this.column != null ? (this.wrap || 'wrap') : this.wrap
    },
    styleObj () {
      const style = {}

      if (this.direction) {
        style['flex-direction'] = this.direction
      }

      if (this._wrap) {
        style['flex-wrap'] = this._wrap
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
    // call by child
    getOuterWidth () {
      const container = this.$refs.container
      const margin = (parseFloat(container.style.marginLeft) || 0) + (parseFloat(container.style.marginRight) || 0)

      if (margin > 0) {
        margin = 0
      }

      const rect = container.getBoundingClientRect()
      return (rect.width + margin) + Number(this.gutter)
    },
    resizeHandler () {
      const $parent = this.$parent

      while ($parent != null) {
        if ($parent instanceof AuFlex) {
          return
        }
        $parent = $parent.$parent
      }
      this.updateUI()
    },
    updateUI () {
      this.$nextTick(() => {
        const elemStyle = this.$refs.container.style
        const gutter = this.gutter / 2
        const itemWidth

        if (this.column != null) {
          const containerOuterWidth = this.getOuterWidth()
          itemWidth = Math.floor((containerOuterWidth / this.column) - gutter * 2)
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

              itemStyle.marginLeft = instance.offset ? itemStyle.marginLeft : `${gutter}px`
              itemStyle.marginRight = instance.offset ? itemStyle.marginRight : `${gutter}px`
              itemStyle.marginTop = instance.offset ? itemStyle.marginTop : `${gutter}px`
              itemStyle.marginBottom = instance.offset ? itemStyle.marginBottom : `${gutter}px`
            }
          }
        })

        this.$nextTick(() => {
          this.broadcast('update.ui')
        })
      })
    }
  }
})

Vue.component('au-flex', AuFlex)

export default AuFlex
