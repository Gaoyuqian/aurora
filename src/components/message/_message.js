
const AuMessage = Vue.extend({
  template: require('./_message.jade'),
  data () {
    return {
      type: 'default',
      title: '提示信息',
      message: '',
      timer: null,
      isShow: false,
      options: {}
    }
  },
  computed: {
    cls () {
      const cls = [`au-message-${this.type}`]
      if (!this.title) {
        cls.push('au-message-only-desc')
      }
      return cls
    },
    buttons () {
      return this.options && this.options.buttons || []
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
      }, 0)
    }
  }
})

export default AuMessage
