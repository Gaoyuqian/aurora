import dispatch from '../../mixins/_dispatch.js'
const AuOption = Vue.extend({
  mixins: [dispatch],
  template: require('./_option.jade'),
  props: {
    label: String,
    value: [String, Number],
    showCheck: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  created () {
    this.dispatch('register.option', this)
  },
  beforeDestroy () {
    this.dispatch('unregister.option', this)
  },
  methods: {
    clickHandler () {
      this.dispatch(
        this.active
        ? 'unselect.option'
        : 'select.option',
        this.value, this)
    },
    setActive (isActive) {
      this.active = isActive
    }
  }
})

Vue.component('au-option', AuOption)

export default AuOption
