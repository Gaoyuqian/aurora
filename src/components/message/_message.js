
const AuMessage = Vue.extend({
  template: require('./_message.jade'),
  data () {
    return {
      type: 'default',
      message: '',
      timer: null,
      isShow: false
    }
  },
  computed: {
    classObject () {
      return [`au-message-${this.type}`]
    }
  },
  mounted () {
    if (this.type !== 'loading') {
      this.timer = setTimeout(this.disappear, 3000)
    }
    this.isShow = true
  },
  methods: {
    disappear () {
      clearTimeout(this.timer)
      this.isShow = false
      setTimeout(() => {
        this.$parent.disappearHandler(this)
        this.$destroy(true)
        if (this.$el.parentNode) {
          this.$el.parentNode.removeChild(this.$el);
        }
      }, 400)
    }
  }
})

export default AuMessage
