
const AuStep = Vue.extend({
  template: require('./_step.jade'),
  props: {
    title: String,
    desc: String,
    icon: String
  }
})

Vue.component('au-step', AuStep)

export default AuStep
