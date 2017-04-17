import AuModalMask from './_modal-mask.js'
var mask
var zIndex = 7000
const modalQueue = []

const AuModal = Vue.extend({
  template: require('./_modal.jade'),
  props: {
    title: String,
    icon: String,
    value: Boolean,
    noClose: Boolean,
    width: [String, Number]
  },
  data () {
    return {
      zIndex
    }
  },
  computed: {
    style () {
      const style = {
        'z-index': this.zIndex
      }
      return style
    },
    modalStyle () {
      const style = {}
      const width = parseFloat(this.width)
      if (width) {
        style.width = width + 'px'
      }
      return style
    }
  },
  created () {
    zIndex += 10
  },
  mounted () {
    document.body.appendChild(this.$el)
    if (this.value) {
      this.show()
    }
  },
  beforeDestroy () {
    this.hide()
    this.$el.parentElement.removeChild(this.$el)
  },
  methods: {
    clear () {
      const pos = modalQueue.indexOf(this)
      if (pos > -1) {
        modalQueue.splice(pos, 1)
      }
    },
    closeHandler () {
      this.$emit('input', false)
    },
    getMask () {
      if (mask == null) {
        mask = new AuModalMask()
        mask.$mount(document.createElement('div'))
        document.body.appendChild(mask.$el)
      }
      return mask
    },
    show () {
      modalQueue.push(this)
      this.showMask()
    },
    hide () {
      this.clear()
      const length = modalQueue.length
      if (length === 0) {
        this.hideMask()
      } else {
        modalQueue[length - 1].showMask()
      }
    },
    showMask () {
      this.getMask().show(this.zIndex - 5)
    },
    hideMask () {
      this.getMask().hide()
    }
  },
  watch: {
    value (value) {
      if (value === true) {
        this.show()
      } else {
        this.hide()
      }
    }
  }
})

Vue.component('au-modal', AuModal)

export default AuModal
