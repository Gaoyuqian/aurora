import AuYearPickerContent from './_year-picker-content.js'
import AuMonthPickerContent from './_month-picker-content.js'
import datePicker from '../../mixins/_date-picker.js'

const AuMonthPickerPanel = Vue.extend({
  template: require('./_month-picker-panel.jade'),
  mixins: [datePicker],
  components: {
    AuYearPickerContent,
    AuMonthPickerContent
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
        this.$emit('close')
      }
    }
  },
  data () {
    return {
      tempValue: new Date(this.value),
      type: 'month'
    }
  },
  mounted () {
    this.$refs.monthContent.$on('showYearPanel', () => {
      this.type = 'year'
      this.$refs.yearContent.tempValue = this.$refs.monthContent.tempValue
    })

    this.$refs.yearContent.$on('change', (value) => {
      this.$refs.monthContent.tempValue = value
      this.type = 'month'
    })

    this.$refs.monthContent.$on('change', (value) => {
      this.model = value
    })

    this.$refs.monthContent.$on('change.temp', (value) => {
      this.tempValue = value
    })
  },
  methods: {
    reset () {
      this.tempValue = new Date(this.value)
      this.type = 'month'
      this.$refs.monthContent.reset()
      this.$refs.yearContent.reset()
    }
  },
  watch: {
    value (value) {
      this.tempValue = new Date(value)
    }
  }
})

export default AuMonthPickerPanel
