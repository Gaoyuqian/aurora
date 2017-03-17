const indexOf = [].indexOf
import AuMenuItem from './_menu-item.js'

const AuMenu = Vue.extend({
  template: require('./_menu.jade'),
  props: {
    trigger: {
      type: String,
      default: 'click'
    }
  },
  data () {
    return {
      isSidebar: false,
      isHeader: false,
      activeLineStyle: {
        width: 0,
        left: 0
      },
      timer: null
    }
  },
  mounted () {
    this.$on('click.item', () => {
      this.$emit('hide')
    })

    const $elem = this.$el
    while ($elem = $elem.parentElement) {
      if (indexOf.call($elem.classList, 'au-menu') > -1) {
        return

      } else if (indexOf.call($elem.classList, 'au-content-sidebar') > -1) {
        this.isSidebar = true
        break

      } else if (indexOf.call($elem.classList, 'au-header') > -1) {
        this.isHeader = true
        break
      }
    }

    this.$children.forEach((item) => {
      if (item instanceof AuMenuItem) {
        if (this.isHeader) {
          item.setIsHeader()
        } else if (this.isSidebar) {
          item.setIsSidebar()
        }
      }
    })

    if (this.isHeader) {
      this.$on('show.line', (item) => {
        this.clearTimer()
        this.timer = setTimeout(() => {
          this.activeLineStyle = {
            transform: 'scale(1)',
            left: item.$el.offsetLeft + 'px',
            width: item.$el.offsetWidth + 'px'
          }
          this.timer = null
        }, 100)
      })

      this.$on('hide.line', (item) => {
        this.clearTimer()
        this.timer = setTimeout(() => {
          this.activeLineStyle = {
            transform: 'scale(0)',
            left: this.activeLineStyle.left,
            width: this.activeLineStyle.width
          }
          this.timer = null
        }, 100)

      })
    }
  },
  methods: {
    clearTimer () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  }
})

Vue.component('au-menu', AuMenu)

export default AuMenu
