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
      currentDate: new Date(this.value)
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
      var value = new Date(this.currentDate)
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
      this.currentDate = new Date(this.value)
    },
    setYear (year) {
      const value = new Date(this.model)
      value.setFullYear(year)
      this.model = value
    },
    prevTenYear () {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 10)
      this.currentDate = new Date(this.currentDate)
    },
    nextTenYear () {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 10)
      this.currentDate = new Date(this.currentDate)
    }
  }
})

export default AuYearPickerContent
