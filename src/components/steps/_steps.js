import AuStep from './_step.js'
const AuSteps = Vue.extend({
  template: require('./_steps.jade'),
  props: {
    active: [String, Number],
  },
  data () {
    return {
      lines: []
    }
  },
  computed: {
    childs () {
      return this.$children.filter((child) => {
        return child instanceof AuStep
      })
    }
  }
  mounted () {
    this.lines = this.getLines()
  },
  updated (...args) {
    const lines = this.getLines()
    if (this.isEqualLine(this.lines, lines)) {
      return
    }
    this.lines = lines
    this.$nextTick(this.$forceUpdate)
  },
  methods: {
    isEqualLine (line1, line2) {
      return JSON.stringify(line1) === JSON.stringify(line2)
    },
    getLines () {
      const lines = []
      const children = this.$children.filter((child) => {
        return child instanceof AuStep
      })
      const length = children.length
      var index = 0

      while ((index + 1) < length) {
        let left = children[index]
        let right = children[index + 1]

        let leftRect = left.$refs.icon.getBoundingClientRect()
        let rightRect = right.$refs.icon.getBoundingClientRect()
        let elemRect = this.$el.getBoundingClientRect()

        lines.push({
          'class': {},
          style: {
            left: (leftRect.left + leftRect.width - elemRect.left) + 'px',
            width: (rightRect.left - leftRect.left - leftRect.width) + 'px'
          }
        })
        index++
      }
      return lines
    }
  }
})

Vue.component('au-steps', AuSteps)

export default AuSteps
