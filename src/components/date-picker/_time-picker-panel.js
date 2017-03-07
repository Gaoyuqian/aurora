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
  computed: {
    hours () {
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
    minutes () {
      const minutes = this.getRange(0, 59)
      const value = new Date(this.model)
      value.setHours(this.hour)

      return minutes.map((minute) => {
        value.setMinutes(minute)
        return {
          label: minute,
          isDisabled: this.isDisabledMinute(value)
        }
      })
    },
    seconds () {
      const seconds = this.getRange(0, 59)
      const value = new Date(this.model)
      value.setHours(this.hour)
      value.setMinutes(this.minute)

      return seconds.map((second) => {
        value.setSeconds(second)
        return {
          label: second,
          isDisabled: this.isDisabledSecond(value)
        }
      })
    },
    model: {
      get () {
        this.value
        return new Date(this.value)
      },
      set (value) {
        this.$emit('input', value)
        this.$nextTick(() => {
          this.broadcast('check.isDisabled')
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
