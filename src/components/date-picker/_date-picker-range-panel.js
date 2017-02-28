import AuDatePickerContent from './_date-picker-content.js'

const AuDatePickerRangePanel = Vue.extend({
  template: require('./_date-picker-range-panel.jade'),
  components: {
    AuDatePickerContent
  },
  props: {
    value: {
      type: Array,
      default: []
    }
  },
  computed: {
    leftValue: {
      get () {
        return new Date(this.value[0])
      },
      set (value) {

      }
    },
    rightValue: {
      get () {
        return new Date(this.value[1])
      },
      set (value) {

      }
    }
  },
  methods: {
    reset () {
      this.$refs.leftContent.reset()
      this.$refs.rightContent.reset()
    }
  }
})


export default AuDatePickerRangePanel
