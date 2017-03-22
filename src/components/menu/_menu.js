import AuHeader from '../header/_header.js'
import AuContent from '../content/_content.js'

const AuMenu = Vue.extend({
  template: require('./_menu.jade'),
  props: {
    menuTrigger: {
      type: String,
      default: 'click'
    },
    vertical: Boolean
  },
  computed: {
    classObj () {
      const classObj = []

      if (this.isPopupMenu) {
        classObj.push('au-menu-popup-menu')
      } else {
        if (this.isVertical) {
          classObj.push('au-menu-vertical')
        } else {
          classObj.push('au-menu-horizontal')
        }
      }

      if (this.isSubMenu) {
        classObj.push('au-menu-sub-menu')
      }
      return classObj
    }
  },
  data () {
    return {
      isSubMenu: false,
      isVertical: this.vertical,
      isPopupMenu: false
    }
  },
  beforeMount () {
    if (!this.$options.propsData.vertical) {
      if (this.getParent(AuHeader) != null) {
        this.isVertical = false
      } else if (this.getParent(AuContent) != null) {
        this.isVertical = true
      }
    }
  },
  methods: {
    getParent (Ctor) {
      var elem = this.$parent
      do {
        if (elem && elem instanceof Ctor) {
          return elem
        }
      } while (elem = elem.$parent)

      return null
    }
  },
  watch: {
    vertical (vertical) {
      this.isVertical = vertical
    }
  }
})

Vue.component('au-menu', AuMenu)

export default AuMenu
