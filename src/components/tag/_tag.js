const AuTag = Vue.extend({
  template: require('./_tag.jade')
  props: {
    type: {
      type: String,
      default: 'default'
    },
    color: {
      type: String,
      default: ''
    },
    bordered: Boolean,
    closeable: Boolean
  },
  computed: {
    cls () {
      const cls = []
      if (this.color) {
        cls.push(`au-tag-${this.color}`)
      } else {
        cls.push(`au-tag-${this.type}`)
      }

      if (this.bordered) {
        cls.push('au-tag-bordered')
      }
      return cls
    }
  },
  methods: {
    onClick () {
      this.$emit('close')
    }
  }
})

Vue.component('au-tag', AuTag)

export default AuTag
