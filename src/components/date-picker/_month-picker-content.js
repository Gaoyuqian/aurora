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
      months: [
        {
          label: '一月',
          value: 1
        },
        {
          label: '二月',
          value: 2
        },
        {
          label: '三月',
          value: 3
        },
        {
          label: '四月',
          value: 4
        },
        {
          label: '五月',
          value: 5
        },
        {
          label: '六月',
          value: 6
        },
        {
          label: '七月',
          value: 7
        },
        {
          label: '八月',
          value: 8
        },
        {
          label: '九月',
          value: 9
        },
        {
          label: '十月',
          value: 10
        },
        {
          label: '十一月',
          value: 11
        },
        {
          label: '十二月',
          value: 12
        }
      ]
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
