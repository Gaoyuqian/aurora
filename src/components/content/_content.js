import Menu from '../menu/_menu.js'
import dispatch from '../../mixins/_dispatch'

const AuContent = Vue.extend({
  template: require('./_content.jade'),
  mixins: [dispatch],
  created () {
    this.dispatch('show.sidebar')
  },
  beforeDestroy () {
    this.dispatch('hide.sidebar')
  }
})

Vue.component('au-content', AuContent)

export default AuContent
