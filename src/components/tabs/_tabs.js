import AuTabPanel from './_tab-panel.js'

const AuTabs = Vue.extend({
  template: require('./_tabs.jade'),
  props: {
    value: [String, Number]
  },
  computed: {
    tabs () {
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
  },
  data () {
    return {
      currentValue: '',
      activeLineStyle: {}
    }
  },
  mounted () {
    if (!this.value) {
      this.setValue(this.tabs[0].value)
    } else {
      this.setChildrenActive()
      this.calLineStyle()
    }
  },
  methods: {
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

      if (items) {
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
