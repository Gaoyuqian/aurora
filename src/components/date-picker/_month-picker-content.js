const AuMonthPickerContent = Vue.extend({
  template: require('./_month-picker-content.jade'),
  props: {
    value: Date,
    default () {
      return new Date()
    }
  },
  data () {
    return {
      tempValue: new Date(this.value),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }
  },
  created () {
    this.reset()
  },
  computed: {
    isCurrentYear () {
      return this.model.getFullYear() === this.tempValue.getFullYear()
    },
    currentMonth () {
      return this.model.getMonth() + 1
    },
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (typeof value === 'number') {
          value = new Date(value)
        }
        this.$emit('change', value)
      }
    },
    year () {
      var value = new Date(this.tempValue)
      return value.getFullYear()
    }
  },
  methods: {
    reset () {
      this.tempValue = new Date(this.value)
    },
    setMonth (month) {
      const value = new Date(this.tempValue)
      value.setMonth(month - 1)
      this.model = value
    },
    prevYear () {
      this.tempValue.setFullYear(this.tempValue.getFullYear() - 1)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    },
    nextYear () {
      this.tempValue.setFullYear(this.tempValue.getFullYear() + 1)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    },
    showYearPanel () {
      this.$emit('showYearPanel')
    }
  },
  watch: {
    value (value) {
      this.tempValue = value
    }
  }
})

export default AuMonthPickerContent
