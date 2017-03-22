import AuHeader from '../header/_header.js'
import AuSidebar from '../content/_sidebar.js'
import dispatch from '../../mixins/_dispatch.js'

const AuMenu = Vue.extend({
  template: require('./_menu.jade'),
  mixins: [dispatch],
  props: {
    menuTrigger: {
      type: String,
      default: 'click'
    },
    vertical: Boolean,
    selected: {
      type: Array,
      default () {
        return []
      }
    }
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
      } else if (this.getParent(AuSidebar) != null) {
        this.isVertical = true
      }
    }
  },
  mounted () {
    if (this.selected.length > 0) {
      this.checkSelected()
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
    },
    checkSelected () {
      this.broadcast('check.selected', this.selected)
    }
  },
  watch: {
    vertical (vertical) {
      this.isVertical = vertical
    },
    selected () {
      this.checkSelected()
    }
  }
})

Vue.component('au-menu', AuMenu)

export default AuMenu
