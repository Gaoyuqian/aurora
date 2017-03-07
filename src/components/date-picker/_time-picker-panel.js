import dateFormat from '../../libs/dateformat.js'
import TimePickerItem from './_time-picker-item.js'
import dispatch from '../../mixins/_dispatch'
import datePicker from '../../mixins/_date-picker.js'
import datetime from '../../utils/_datetime.js'

const AuTimePickerPanel = Vue.extend({
  template: require('./_time-picker-panel.jade'),
  mixins: [dispatch, datePicker],
  components: {
    TimePickerItem
  },
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
      isDisabledHour: datetime.getIsDisabledFuncByComponent(this, 'hour'),
      isDisabledMinute: datetime.getIsDisabledFuncByComponent(this, 'minute'),
      isDisabledSecond: datetime.getIsDisabledFuncByComponent(this, 'second')
    }
  },
  created () {
    this.$on('check.isDisabled', () => {
      this.checkIsDisabled(this.value, (model) => {
        if (+this.value !== +model) {
          this.$emit('input', model)
        }
      })
    })
  },
  computed: {
    hours () {
      return this.getHours()
    },
    minutes () {
      return this.getMinutes(this.hour)
    },
    seconds () {
      return this.getSeconds(this.hour, this.minute)
    },
    model: {
      get () {
        this.value
        return new Date(this.value)
      },
      set (value) {
        this.checkIsDisabled(value, (model) => {
          this.$emit('input', model)
        })
      }
    },
    hour: {
      get () {
        return this.model.getHours()
      },
      set (value) {
        const model = new Date(this.model)
        model.setHours(value)
        this.model = model
      }
    },
    minute: {
      get () {
        return this.model.getMinutes()
      },
      set (value) {
        const model = new Date(this.model)
        model.setMinutes(value)
        this.model = model
      }
    },
    second: {
      get () {
        return this.model.getSeconds()
      },
      set (value) {
        const model = new Date(this.model)
        model.setSeconds(value)
        this.$emit('input', model)
      }
    },
  },
  methods: {
    getHours () {
      const hours = this.getRange(0, 23)
      const value = new Date(this.model)

      return hours.map((hour) => {
        value.setHours(hour)
        return {
          label: hour,
          isDisabled: this.isDisabledHour(value)
        }
      })
    },
    getMinutes (hour) {
      const minutes = this.getRange(0, 59)
      const value = new Date(this.model)
      value.setHours(hour)

      return minutes.map((minute) => {
        value.setMinutes(minute)
        return {
          label: minute,
          isDisabled: this.isDisabledMinute(value)
        }
      })
    },
    getSeconds (hour, minute) {
      const seconds = this.getRange(0, 59)
      const value = new Date(this.model)
      value.setHours(hour)
      value.setMinutes(minute)

      return seconds.map((second) => {
        value.setSeconds(second)
        return {
          label: second,
          isDisabled: this.isDisabledSecond(value)
        }
      })
    },
    checkIsDisabled (value, callback) {
      const hours = this.getHours()
      const hour = this.getAvaiableValue(hours, value.getHours())
      const minutes = this.getMinutes(hour)
      const minute = this.getAvaiableValue(minutes, value.getMinutes())
      const seconds = this.getSeconds(hour, minute)
      const second = this.getAvaiableValue(seconds, value.getSeconds())

      const model = new Date(this.model)
      model.setHours(hour)
      model.setMinutes(minute)
      model.setSeconds(second)
      callback(model)
    },
    getAvaiableValue (range, value) {
      var firstAvailable, isDisabled = false
      range.some((item) => {
        if (!item.isDisabled && !firstAvailable) {
          firstAvailable = item
        }

        if (item.label == value) {
          if (item.isDisabled) {
            isDisabled = true
          } else {
            result = item.label
            return true
          }
        }

        if (isDisabled && firstAvailable) {
          result = firstAvailable.label
          return true
        }
      })

      return result
    },
    reset () {
      this.$children.forEach((child) => {
        child.reset && child.reset()
      })
    },
    getRange (start, end) {
      const arr = []
      for (var i = start; i <= end; i++) {
        arr.push(this.getTimeFormat(i))
      }
      return arr
    },
    getTimeFormat (value) {
      value = String(value)
      if (value.length === 1) {
        return '0' + value
      }
      return value
    },
    closeHandler () {
      this.dispatch(true, 'close.panel')
    }
  }
})

export default AuTimePickerPanel
