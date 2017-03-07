import datetime from '../../utils/_datetime.js'

const AuYearPickerContent = Vue.extend({
  template: require('./_year-picker-content.jade'),
  props: {
    value: {
      type: Date,
      default () {
        return new Date()
      }
    },
    startDate: [String, Date],
    endDate: [String, Date],
    disabledDate: Function
  },
  data () {
    return {
      isDisabledFunc: datetime.getIsDisabledFuncByComponent(this),
      tempValue: new Date(this.value)
    }
  },
  created () {
    this.reset()
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    },
    currentYear () {
      return this.model.getFullYear()
    },
    startYear () {
      var value = new Date(this.tempValue)
      return Math.floor(value.getFullYear() / 10) * 10
    },
    endYear () {
      return this.startYear + 9
    },
    years () {
      const year = this.startYear
      const arr = []
      var value

      while (year <= this.endYear) {
        value = new Date(`${year}-12-31`)
        arr.push({
          year,
          value,
          isDisabled: this.isDisabledFunc(value)
        })
        year++
      }
      return arr
    }
  },
  methods: {
    reset () {
      this.tempValue = new Date(this.value)
    },
    setYear (year) {
      if (year.isDisabled) {
        return
      }
      const value = new Date(this.model)
      value.setFullYear(year.year)
      this.model = value
    },
    prevTenYear () {
      this.tempValue.setFullYear(this.tempValue.getFullYear() - 10)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    },
    nextTenYear () {
      this.tempValue.setFullYear(this.tempValue.getFullYear() + 10)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    }
  }
})

export default AuYearPickerContent
