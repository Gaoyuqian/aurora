import datetime from '../../utils/_datetime.js'
import datePicker from '../../mixins/_date-picker.js'

const monthsMap = {
  1: '一月',
  2: '二月',
  3: '三月',
  4: '四月',
  5: '五月',
  6: '六月',
  7: '七月',
  8: '八月',
  9: '九月',
  10: '十月',
  11: '十一月',
  12: '十二月'
}

const AuMonthPickerContent = Vue.extend({
  template: require('./_month-picker-content.jade'),
  mixins: [datePicker],
  props: {
    value: {
      type: Date,
      default () {
        return new Date()
      }
    }
  },
  data () {
    return {
      tempValue: new Date(this.value),
      isDisabledFunc: datetime.getIsDisabledFuncByComponent(this, 'month')
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
    },
    months () {
      const months = []
      var month
      var value

      for (month = 1; month <= 12; month++) {
        value = new Date(`${this.year}-${month}`)

        months.push({
          value,
          month,
          label: this.getLabel(month),
          isDisabled: this.isDisabledFunc(value)
        })
      }

      new Date()
      return months
    }
  },
  methods: {
    getLabel (month) {
      return monthsMap[month] || ''
    },
    reset () {
      this.tempValue = new Date(this.value)
    },
    setMonth (month) {
      if (month.isDisabled) {
        return
      }
      const value = new Date(this.tempValue)
      value.setMonth(month.month - 1)
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
