const AuTabPanel = Vue.extend({
  template: require('./_tab-panel.jade'),
  props: {
    value: [String, Number],
    tab: [String],
    badge: [String, Number],
    disabled: Boolean
  },
  data () {
    return {
      active: false
    }
  }
})


Vue.component('au-tab-panel', AuTabPanel)

export default AuTabPanel
