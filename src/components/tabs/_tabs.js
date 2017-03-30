import AuTabPanel from './_tab-panel.js'

const AuTabs = Vue.extend({
  template: require('./_tabs.jade'),
  props: {
    value: [String, Number]
  },
  data () {
    return {
      tabs: [],
      currentValue: '',
      activeLineStyle: {}
    }
  },
  updated () {
    const tabs = this.getTabs()

    if (this.isEqualTabs(this.tabs, tabs)) {
      return
    }

    this.tabs = tabs
    this.$nextTick(() => {
      this.$forceUpdate()
      this.$nextTick(() => {
        this.setChildrenActive()
        this.$nextTick(this.calLineStyle)
      })
    })
  },
  mounted () {
    this.initTabs()

    if (!this.value) {
      if (this.tabs.length > 0) {
        this.setValue(this.tabs[0].value)
      }
    } else {
      this.currentValue = this.value
      this.setChildrenActive()
      this.$nextTick(this.calLineStyle)
    }
  },
  methods: {
    isEqualTabs (tabs1, tabs2) {
      return JSON.stringify(tabs1) === JSON.stringify(tabs2)
    },
    initTabs () {
      this.tabs = this.getTabs()
    },
    getTabs () {
      const tabs = []
      const slot = this.$slots.default

      if (slot) {
        slot.forEach((item) => {
          if (item.componentOptions && item.componentOptions.Ctor == AuTabPanel) {
            const props = item.componentOptions.propsData
            tabs.push(props)
          }
        })
      }
      return tabs
    },
    clickTab (tab) {
      if (!tab.disabled) {
        this.setValue(tab.value)
      }
    },
    setValue (value) {
      this.$emit('input', value)
      this.currentValue = value
      this.setChildrenActive()
      this.$nextTick(this.calLineStyle)
    },
    setChildrenActive () {
      this.$children.some((component) => {
        if (!(component instanceof AuTabPanel)) {
          return
        }
        if (component.value === this.currentValue) {
          component.active = true
        } else {
          component.active = false
        }
      })
    },
    calLineStyle () {
      const heading = this.$el.querySelector('.au-tabs-heading')
      const items = heading.querySelectorAll('.au-tab-item.active')

      if (items && items.length > 0) {
        this.activeLineStyle = {
          width: items[0].offsetWidth + 'px',
          left: items[0].offsetLeft + 'px'
        }
      } else {
        this.activeLineStyle = {}
      }
    }
  }
})

Vue.component('au-tabs', AuTabs)

export default AuTabs
