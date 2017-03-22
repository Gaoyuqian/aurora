import dispatch from '../../mixins/_dispatch'

const AuSidebar = Vue.extend({
  template: require('./_sidebar.jade'),
  mixins: [dispatch],
  created () {
    this.dispatch('show.sidebar')
  },
  beforeDestroy () {
    this.dispatch('hide.sidebar')
  }
})

export default AuSidebar
