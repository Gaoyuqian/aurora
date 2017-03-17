import dispatch from '../../mixins/_dispatch'
const AuContent = Vue.extend({
  template: require('./_content.jade'),
  mixins: [dispatch],
  props: {},
  created () {
    this.dispatch('show.sidebar')
  },
  beforeDestroy () {
    this.dispatch('hide.sidebar')
  }
})

Vue.component('au-content', AuContent)

export default AuContent
