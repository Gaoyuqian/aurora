import dispatch from '../../mixins/_dispatch.js'
const AuOption = Vue.extend({
  mixins: [dispatch],
  template: require('./_option.jade'),
  props: {
    label: String,
    value: [String, Number]
  },
  data () {
    return {
      active: false,
      isHide: false,
      isFocus: false,
      mutiple: false
    }
  },
  computed: {
    cls () {
      const cls = []
      if (this.mutiple) {
        cls.push('au-option-mutiple')
      }
      if (this.active) {
        cls.push('active')
      }

      if (this.isFocus) {
        cls.push('au-focus')
      }
      return cls
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
    mouseoverHandler () {
      this.dispatch('focus.option', this)
      this.isFocus = true
    },
    mouseoutHandler () {
      this.dispatch('blur.option', this)
      this.isFocus = false
    },
    setActive (isActive, select) {
      this.mutiple = select.mutiple
      this.active = isActive
    },
    setFocus (isFocus) {
      this.isFocus = isFocus
    }
  }
})

Vue.component('au-option', AuOption)

export default AuOption
