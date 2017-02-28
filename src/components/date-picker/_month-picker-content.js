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
      currentDate: new Date(this.value),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }
  },
  created () {
    this.reset()
  },
  computed: {
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
      var value = new Date(this.currentDate)
      return value.getFullYear()
    }
  },
  methods: {
    reset () {
      this.currentDate = new Date(this.value)
    },
    setMonth (month) {
      const value = new Date(this.model)
      value.setMonth(month - 1)
      this.model = value
    },
    prevYear () {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1)
      this.currentDate = new Date(this.currentDate)
      this.$emit('change.temp', this.currentDate)
    },
    nextYear () {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1)
      this.currentDate = new Date(this.currentDate)
      this.$emit('change.temp', this.currentDate)
    },
    showYearPanel () {
      this.$emit('showYearPanel')
    }
  },
  watch: {
    value (value) {
      this.currentDate = value
    }
  }
})

export default AuMonthPickerContent
