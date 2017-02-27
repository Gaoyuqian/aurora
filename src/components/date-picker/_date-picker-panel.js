const ONE_DAY = 24 * 60 * 60 * 1000

const AuDatePickerPopup = Vue.extend({
  template: require('./_date-picker-panel.jade'),
  props: {
    value: Date,
    default () {
      return new Date()
    }
  },
  data () {
    return {
      currentDate: ''
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
        if (typeof value === 'number') {
          value = new Date(value)
        }
        this.$emit('input', value)
      }
    },
    year () {
      return this.currentDate.getFullYear()
    },
    month () {
      return this.currentDate.getMonth() + 1
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
    },
    prevMonth () {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1)
      this.currentDate = new Date(this.currentDate)
    },
    nextYear () {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1)
      this.currentDate = new Date(this.currentDate)
    },
    nextMonth () {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1)
      this.currentDate = new Date(this.currentDate)
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
    }
  }
})

Vue.component('au-date-picker-popup', AuDatePickerPopup)

export default AuDatePickerPopup
