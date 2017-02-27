
const AuPanel = Vue.extend({
  template: require('./_panel.jade'),
  props: {
    label: String,
    icon: String
  }
})

Vue.component('au-panel', AuPanel)

export default AuPanel
