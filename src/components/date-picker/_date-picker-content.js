import dateFormat from '../../libs/dateformat.js'
const ONE_DAY = 24 * 60 * 60 * 1000

const AuDatePickerContent = Vue.extend({
  template: require('./_date-picker-content.jade'),
  props: {
    value: {
      type: Date,
      default () {
        return new Date()
      }
    },
    range: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      currentDate: new Date(this.value)
    }
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
    year () {
      return dateFormat(this.currentDate, 'yyyy')
    },
    month () {
      return dateFormat(this.currentDate, 'mm')
    },
    days () {
      var value = new Date(this.currentDate)
      var currentMonth = value.getMonth()
      var i, j

      value.setDate(1)

      var week = value.getDay() // 周几 0表示周日
      value = new Date(+value - ONE_DAY * week)
      var days = [] // this.days对象

      for (i = 0; i < 6; i++) {
        days.push([])

        for (j = 0; j < 7; j++) {
          days[i].push(this.getDay(value, currentMonth === value.getMonth()))
          value = new Date(+value + ONE_DAY)
        }
      }

      return days
    }
  },
  methods: {
    reset () {
      this.currentDate = new Date(this.value)
    },
    clickItem (value) {
      this.model = value
    },
    prevYear () {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1)
      this.currentDate = new Date(this.currentDate)
      this.$emit('change.temp', this.currentDate)
    },
    prevMonth () {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1)
      this.currentDate = new Date(this.currentDate)
      this.$emit('change.temp', this.currentDate)
    },
    nextYear () {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1)
      this.currentDate = new Date(this.currentDate)
      this.$emit('change.temp', this.currentDate)
    },
    nextMonth () {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1)
      this.currentDate = new Date(this.currentDate)
      this.$emit('change.temp', this.currentDate)
    },
    getDay (value, isCurrentMonth) {
      return {
        value,
        isCurrentMonth,
        date: value.getDate(),
        month: value.getMonth() + 1,
        isToday: this.isToday(value),
        isCurrentDate: this.isCurrentDate(value)
      }
    },
    isToday (date) {
      const today = new Date()
      return date.getFullYear() === today.getFullYear()
          && date.getMonth() === today.getMonth()
          && date.getDate() === today.getDate()
    },
    isCurrentDate (date) {
      const curDate = this.model
      return date.getFullYear() === curDate.getFullYear()
          && date.getMonth() === curDate.getMonth()
          && date.getDate() === curDate.getDate()
    },
    showYearPanel () {
      this.$emit('showYearPanel')
    },
    showMonthPanel () {
      this.$emit('showMonthPanel')
    }
  },
  watch: {
    value (value) {
      this.currentDate = new Date(value)
    }
  }
})


export default AuDatePickerContent
