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
    model: Object
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
  }
})

Vue.component('au-form', AuForm)

export default AuForm
