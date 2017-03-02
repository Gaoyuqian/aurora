const AuYearPickerContent = Vue.extend({
  template: require('./_year-picker-content.jade'),
  props: {
    value: Date,
    default () {
      return new Date()
    }
  },
  data () {
    return {
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
      const value = this.startYear
      const arr = []

      while (value <= this.endYear) {
        arr.push(value)
        value++
      }
      return arr
    }
  },
  methods: {
    reset () {
      this.tempValue = new Date(this.value)
    },
    setYear (year) {
      const value = new Date(this.model)
      value.setFullYear(year)
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
