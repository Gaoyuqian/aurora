import AuYearPickerContent from './_year-picker-content.js'

const AuYearPickerPanel = Vue.extend({
  template: require('./_year-picker-panel.jade'),
  components: {
    AuYearPickerContent
  },
  props: {
    value: Date,
    default () {
      return new Date()
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  mounted () {
    this.$refs.yearContent.$on('change', (value) => {
      this.model = value
    })
  },
  methods: {
    reset () {
      this.$refs.yearContent.reset()
    }
  }
})

export default AuYearPickerPanel
