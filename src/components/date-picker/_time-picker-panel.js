import dateFormat from '../../libs/dateformat.js'
import TimePickerItem from './_time-picker-item.js'

const AuTimePickerPanel = Vue.extend({
  template: require('./_time-picker-panel.jade'),
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
  created () {
    setInterval(() => {
      console.log(this.value)
    }, 1000)
  },
  computed: {
    model: {
      get () {
        this.value
        console.log('get model')
        return new Date(this.value)
      },
      set (value) {
        console.log('set model')
        this.$emit('input', value)
      }
    },
    hour: {
      get () {
        console.log('get hour', this.model.getHours())
        return this.model.getHours()
      },
      set (value) {
        console.log('set hour', value)
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
        //this.model = model
        console.log(value, model, model.getSeconds())
        this.$emit('input', model)
      }
    },
  },
  methods: {
    reset () {
      console.log(this.value)
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
    }
  },
  watch: {
    value (value) {
      console.log('value change', value)
    }
  }
})

export default AuTimePickerPanel
