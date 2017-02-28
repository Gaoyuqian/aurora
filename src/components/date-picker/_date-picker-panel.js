import AuYearPickerContent from './_year-picker-content.js'
import AuMonthPickerContent from './_month-picker-content.js'
import AuDatePickerContent from './_date-picker-content.js'

const AuDatePickerPanel = Vue.extend({
  template: require('./_date-picker-panel.jade'),
  components: {
    AuYearPickerContent,
    AuMonthPickerContent,
    AuDatePickerContent
  },
  props: {
    value: {
      type: Date,
      default () {
        return new Date()
      }
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
  data () {
    return {
      tempValue: new Date(this.value),
      type: 'date'
    }
  },
  mounted () {
    this.$refs.monthContent.$on('showYearPanel', () => {
      this.type = 'year'
      this.$refs.yearContent.reset()
    })

    this.$refs.dateContent.$on('showYearPanel', () => {
      this.type = 'year'
      this.$refs.yearContent.reset()
    })

    this.$refs.dateContent.$on('showMonthPanel', () => {
      this.type = 'month'
      this.$refs.monthContent.reset()
    })

    this.$refs.yearContent.$on('change', (value) => {
      this.tempValue = value
      this.type = 'month'
      this.$refs.monthContent.reset()
    })

    this.$refs.monthContent.$on('change', (value) => {
      this.tempValue = value
      this.type = 'date'
      this.$refs.dateContent.reset()
    })

    this.$refs.monthContent.$on('change.temp', (value) => {
      this.tempValue = value
    })

    this.$refs.dateContent.$on('change', (value) => {
      this.model = value
    })

    this.$refs.dateContent.$on('change.temp', (value) => {
      this.tempValue = value
    })

  },
  methods: {
    reset () {
      this.tempValue = new Date(this.value),
      this.type = 'date'
      this.$refs.yearContent.reset()
      this.$refs.monthContent.reset()
      this.$refs.dateContent.reset()
    }
  }
})


export default AuDatePickerPanel
