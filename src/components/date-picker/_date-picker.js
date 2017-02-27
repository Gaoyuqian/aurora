import Popup from '../popup/_popup.js'
import AuDatePickerPanel from './_date-picker-panel.js'
import dateFormat from '../../libs/dateformat.js'

const AuDatePicker = Vue.extend({
  template: require('./_date-picker.jade'),
  components: {
    Popup,
    AuDatePickerPanel
  },
  props: {
    value: [String, Date],
    type: {
      type: String, // year, month, date, datetime, daterange, datetimerange
      default: 'date'
    },
    format: {
      type: String,
      default: 'yyyy-mm-dd'
    }
  },
  computed: {
    model: {
      get () {
        this.value
        return this.value ? new Date(this.value) : new Date()
      },
      set (value) {
        value = dateFormat(value, this.format)
        this.$emit('input', value)
        this.hidePopup()
      }
    }
  },
  data () {
    return {
      popup: null,
      datetime: this.value || ''
    }
  },
  methods: {
    clickHandler ($event) {
      $event.stopPropagation()
    },
    showPopup () {
      if (!this.popup) {
        this.popup = this.$refs.popup
        this.popup.setRelateElem(this.$el)
        document.body.appendChild(this.popup.$el)
      }

      this.popup.show()
      this.$refs.panel.reset()
      window.addEventListener('click', this.hidePopup)
    },
    hidePopup () {
      this.popup.hide()
      window.removeEventListener('click', this.hidePopup)
    }
  },
  watch: {
    value (value) {
      this.datetime = value
    }
  }
})

Vue.component('au-date-picker', AuDatePicker)

export default AuDatePicker
