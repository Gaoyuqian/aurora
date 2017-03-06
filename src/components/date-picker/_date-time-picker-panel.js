import Popup from '../popup/_popup.js'
import AuDatePickerPanel from './_date-picker-panel.js'
import AuTimePickerPanel from './_time-picker-panel.js'
import dateFormat from '../../libs/dateformat.js'
import dispatch from '../../mixins/_dispatch'

const AuDateTimePickerPanel = Vue.extend({
  template: require('./_date-time-picker-panel.jade'),
  mixins: [dispatch],
  components: {
    Popup,
    AuDatePickerPanel,
    AuTimePickerPanel
  },
  props: {
    value: {
      type: Date,
      default () {
        return new Date()
      }
    },
    range: {
      type: Array,
      default () {
        return null
      }
    },
    leftRange: Boolean,
    rightRange: Boolean,
    isShowBottomBar: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    date () {
      this.model
      return dateFormat(this.model, 'yyyy-mm-dd')
    },
    time () {
      return dateFormat(this.model, 'HH:MM:ss')
    }
  },
  data () {
    return {
      tempValue: new Date(this.value),
      popup: null
    }
  },
  created () {
    this.$on('hide.popup', () => {
      this.hideTimePicker()
    })

    this.$on('close.panel', () => {
      this.hideTimePicker()
      return false
    })

  },
  mounted () {
    this.$refs.datePicker.$on('change.temp', (value) => {
      this.tempValue = value
      this.$emit('change.temp', value)
    })

    this.$refs.datePicker.$on('click.range', (value) => {
      this.$emit('click.range', value)
    })

    this.$refs.timePicker.$on('input', (value) => {
      this.$emit('change.time', value)
    })
  },
  methods: {
    reset () {

    },
    showTimePicker () {
      if (!this.popup) {
        this.popup = this.$refs.popup
        this.popup.setRelateElem(this.$refs.timeInput.$el)
      }

      this.popup.show()
      this.$nextTick(() => {
        this.broadcast('show.popup')
      })
    },
    hideTimePicker () {
      if (this.popup) {
        this.popup.hide()
      }
    },
    inputClickHandler ($event) {
      $event.stopPropagation()
      if (!this.popup || !this.popup.isShow) {
        this.showTimePicker()
      } else {
        this.hideTimePicker()
      }
    },
    clickHandler () {
      this.hideTimePicker()
    },
    closeHandler () {
      this.$emit('close')
    }
  },
  watch: {
    tempValue (value) {
      this.$refs.datePicker.tempValue = value
    },
    value (value) {
      console.log(value, this.tempValue, this.$refs.datePicker.tempValue)
    }
  }
})

export default AuDateTimePickerPanel
