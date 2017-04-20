const AuForm = Vue.extend({
  template: require('./_form.jade'),
  props: {
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: [Number, String],
      default: ''
    },
    inline: Boolean,
    model: Object,
    rules: Object
  },
  data () {
    return {
      items: []
    }
  },
  computed: {
    cls () {
      const cls = []
      if (this.inline) {
        cls.push('au-form-inline')
      }
      return cls
    }
  },
  created () {
    this.$on('register.form.item', (item) => {
      item.form = this
      this.items.push(item)
    })

    this.$on('unregister.form.item', (item) => {
      item.form = null
      this.items.splice(this.items.indexOf(item), 1)
    })
  },
  methods: {
    validate (callback) {
      var result = true
      var count = this.items.length
      this.items.forEach((item) => {
        item.validate(null, (isSuccess) => {
          count--
          result &= isSuccess
          if (count === 0) {
            callback(result)
          }
        })
      })
    },
    onSubmit ($event) {
      $event.preventDefault()
      this.validate((isSuccess) => {
        if (isSuccess) {
          this.$emit('submit', this.model)
        } else {
          this.$emit('error', this.model)
        }
      })
    },
    onReset ($event) {
      $event.preventDefault()
      this.$emit('reset')
      this.items.forEach((item) => {
        item.reset()
      })
    }
  }
})

Vue.component('au-form', AuForm)

export default AuForm
