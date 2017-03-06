import Popup from '../popup/_popup.js'
import AuDatePickerPanel from './_date-picker-panel.js'
import AuYearPickerPanel from './_year-picker-panel.js'
import AuMonthPickerPanel from './_month-picker-panel.js'
import AuDatePickerRangePanel from './_date-picker-range-panel.js'
import AuTimePickerPanel from './_time-picker-panel.js'
import AuDateTimePickerPanel from './_date-time-picker-panel.js'
import AuDateTimePickerRangePanel from './_date-time-picker-range-panel.js'
import dispatch from '../../mixins/_dispatch'

import dateFormat from '../../libs/dateformat.js'

const AuDatePicker = Vue.extend({
  template: require('./_date-picker.jade'),
  mixins: [dispatch],
  components: {
    Popup
  },
  props: {
    value: [String, Date, Array],
    type: {
      type: String, // year, month, date, datetime, daterange, datetimerange, time
      default: 'date'
    },
    format: {
      type: String,
      default (...args) {
        switch (this.type) {
          case 'year':
            return 'yyyy'
          case 'month':
            return 'yyyy-mm'
          case 'date': case 'daterange':
            return 'yyyy-mm-dd'
          case 'time':
            return 'HH:MM:ss'
          case 'datetime': default:
            return 'yyyy-mm-dd HH:MM:ss'
        }
      }
    }
  },
  computed: {
    model: {
      get () {
        this.value
        if (this.type === 'daterange' || this.type === 'datetimerange') {
          console.log(this.type, this.value, this.value.map)
          return this.value ? this.value.map(item => new Date(item)) : [new Date(), new Date()]
        } else if (this.type === 'time') {
          const date = new Date()
          const arr = this.value.split(':')

          arr[0] && date.setHours(arr[0])
          arr[1] && date.setMinutes(arr[1])
          arr[2] && date.setSeconds(arr[2])

          return date
        } else {
          return this.value ? new Date(this.value) : new Date()
        }
      },
      set (value) {
        if (this.type === 'daterange' || this.type === 'datetimerange') {
          value = value.map(this.getFormatDatetime)
        } else {
          value = this.getFormatDatetime(value)
        }
        this.$emit('input', value)
      }
    },
    datetime () {
      return this.getFormatDatetime(this.model)
    },
    tailingIcon () {
      return this.type === 'time' ? 'clock-o' : 'calendar-o'
    }
  },
  data () {
    return {
      tempValue: new Date(this.value),
      popup: null,
      panel: null,
      inputActive: false
    }
  },
  created () {
    this.$on('close.panel', () => {
      this.hidePopup()
      return false
    })
  },
  methods: {
    getFormatDatetime (value) {
      if (Array.isArray(value)) {
        return value.map((item) => {
          return this.getFormatDatetime(item)
        }).join(' ~ ')
      }
      return dateFormat(value, this.format)
    },
    reset () {
      this.tempValue = new Date(this.value)
      if (this.panel) {
        this.panel.value = this.model
        console.log('call reset')
        this.panel.reset()
      }
    },
    getPanelClass () {
      switch (this.type) {
        case 'year':
          return AuYearPickerPanel
        case 'month':
          return AuMonthPickerPanel
        case 'date':
          return AuDatePickerPanel
        case 'datetime':
          return AuDateTimePickerPanel
        case 'daterange':
          return AuDatePickerRangePanel
        case 'time':
          return AuTimePickerPanel
        case 'datetimerange':
          return AuDateTimePickerRangePanel
        default:
          return null
      }
    },
    clickHandler ($event) {
      $event.stopPropagation()
      if (this.$refs.popup.isShow) {
        this.hidePopup()
      } else {
        this.showPopup()
      }
    },
    showPopup () {
      this.reset()

      if (!this.popup) {
        this.popup = this.$refs.popup
        const Panel = this.getPanelClass()

        this.panel = new Panel({
          propsData: {
            value: this.model
          }
        })

        this.panel.$parent = this.popup

        this.panel.$on('input', (value) => {
          this.model = value
          this.$nextTick(() => {
            this.panel.value = this.model
          })
        })

        this.panel.$on('close', () => {
          this.hidePopup()
        })

        this.panel.$mount(document.createElement('div'))
        this.panel.reset()

        this.popup.$el.appendChild(this.panel.$el)
        this.popup.setRelateElem(this.$el)
        document.body.appendChild(this.popup.$el)

        this.popup.$on('show', () => {
          this.inputActive = true
        })

        this.popup.$on('hide', () => {
          this.inputActive = false
        })
      }

      this.popup.show()
      this.$nextTick(() => {
        this.panel.broadcast && this.panel.broadcast('show.popup')
      })
    },
    hidePopup () {
      this.popup.hide()
      this.$nextTick(() => {
        this.panel.broadcast && this.panel.broadcast('hide.popup')
      })
    }
  }
})

Vue.component('au-date-picker', AuDatePicker)

export default AuDatePicker
