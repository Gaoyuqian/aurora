import AuDateTimePickerPanel from './_date-time-picker-panel.js'
import dispatch from '../../mixins/_dispatch.js'

const AuDateTimePickerRangePanel = Vue.extend({
  template: require('./_date-time-picker-range-panel.jade'),
  mixins: [dispatch],
  components: {
    AuDateTimePickerPanel
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      status: 'free', // free, click1
      displayValue: [
        new Date(this.value[0]),
        new Date(this.value[1])
      ],
      tempValue: [
        new Date(this.value[0]),
        new Date(this.value[1])
      ]
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {

      }
    },
    leftValue: {
      get () {
        this.displayValue
        return new Date(this.displayValue[0])
      },
      set (value) {
        this.displayValue = [value, this.rightValue]
        this.$refs.leftContent.tempValue = value
      }
    },
    rightValue: {
      get () {
        this.displayValue
        return new Date(this.displayValue[1])
      },
      set (value) {
        this.displayValue = [this.leftValue, value]
        this.$refs.rightContent.tempValue = value
      }
    }
  },
  created () {
    this.$on('mouseover.item.datePickerContent', (value) => {
      this.broadcast('mouseover.item.datePickerContent', value)
      return false
    })
  },
  mounted () {
    const $refs = this.$refs
    $refs.leftContent.$on('change.temp', this.updateRightContent)
    $refs.rightContent.$on('change.temp', this.updateLeftContent)

    $refs.leftContent.$on('click.range', this.clickItem)
    $refs.rightContent.$on('click.range', this.clickItem)

    $refs.leftContent.$on('change.time', (value) => {
      this.$emit('input', [value, this.value[1]])
    })

    $refs.rightContent.$on('change.time', (value) => {
      this.$emit('input', [this.value[0], value])
    })

    this.updateRightContent(this.leftValue)
  },
  methods: {
    updateLeftContent (value) {
      value = new Date(value)
      value.setMonth(value.getMonth() - 1)
      this.$refs.leftContent.tempValue = value
    },
    updateRightContent (value) {
      value = new Date(value)
      value.setMonth(value.getMonth() + 1)
      this.$refs.rightContent.tempValue = value
    },
    clickItem (value) {
      if (this.status === 'free') {
        this.status = 'click1'
        this.displayValue = [value, this.displayValue[1]]
        this.tempValue = [value, null]

      } else if (this.status === 'click1') {
        const leftValue = this.tempValue[0]
        if (leftValue > value) {
          this.tempValue = [value, null]
          return
        }
        this.displayValue = [this.displayValue[0], value]
        this.tempValue = [leftValue, value]
        this.$emit('input', this.tempValue)
        this.$emit('close')
        this.status = 'free'
      }
    },
    reset () {
      this.status = 'free'
      this.displayValue = this.tempValue = [
        new Date(this.value[0]),
        new Date(this.value[1])
      ]
      this.$refs.leftContent.reset()
      this.$refs.rightContent.reset()
      this.$refs.leftContent.tempValue = this.leftValue
      this.$nextTick(() => {
        this.updateRightContent(this.leftValue)
      })
    },
    closeHandler () {
      this.$emit('close')
    }
  }
})

export default AuDateTimePickerRangePanel
