import dateFormat from '../../libs/dateformat.js'
import TimePickerItem from './_time-picker-item.js'
import dispatch from '../../mixins/_dispatch'

const AuTimePickerPanel = Vue.extend({
  template: require('./_time-picker-panel.jade'),
  mixins: [dispatch],
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
    const minutes = this.getRange(0, 59)
    return {
      hours: this.getRange(0, 23),
      minutes: minutes,
      seconds: minutes,
      tempValue: new Date(this.value)
    }
  },
  computed: {
    model: {
      get () {
        this.value
        return new Date(this.value)
      },
      set (value) {
        this.$emit('input', value)
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
