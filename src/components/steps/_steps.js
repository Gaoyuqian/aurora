
const AuSteps = Vue.extend({
  template: require('./_steps.jade'),
  props: {
    active: [String, Number],
  }
})

Vue.component('au-steps', AuSteps)

export default AuSteps
