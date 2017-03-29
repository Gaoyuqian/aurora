const AuTag = Vue.extend({
  template: require('./_tag.jade')
  props: {
    type: {
      type: 'String',
      default: 'default'
    }
  },
  computed: {
    cls () {
      const cls = []
      cls.push(`au-tag-${this.type}`)
      return cls
    }
  }
})

Vue.component('au-tag', AuTag)

export default AuTag
