import dispatch from '../../mixins/_dispatch'

const PADDING = 10
var showingPopup = null

const AuPopup = Vue.extend({
  template: require('./_popup.jade'),
  mixins: [dispatch],
  props: {
    selfControl: Boolean
  },
  data () {
    return {
      top: 0,
      left: 0,
      isShow: false
    }
  },
  computed: {
    style () {
      return {
        top: this.top,
        left: this.left
      }
    }
  },
  methods: {
    setRelateElem (relateElem) {
      this.relateElem = relateElem
    },
    clickHandler ($event) {
      $event.stopPropagation()
    },
    calPosition () {
      const relateElem = this.relateElem
      const html = document.documentElement
      const elemWidth = this.$el.scrollWidth
      const elemHeight = this.$el.scrollHeight
      const windowHeight = html.clientHeight
      const windowWidth = html.clientWidth
      const windowX = window.scrollX
      const windowY = window.scrollY
      var top = relateElem.offsetTop + relateElem.offsetHeight
      var left = relateElem.offsetLeft

      if ((top + elemHeight) > (windowY + windowHeight)) {
        top = relateElem.offsetTop - elemHeight - 2
        if (top < windowY) {
          top = windowY + (windowHeight - elemHeight)
        }
      }

      if ((left + elemWidth) > (windowX + windowWidth)) {
        left = windowWidth - elemWidth + windowX
      }

      this.top = `${top}px`
      this.left = `${left}px`
    },
    initPosition () {
      const relateElem = this.relateElem
      var top = relateElem.offsetTop + relateElem.offsetHeight
      var left = relateElem.offsetLeft

      this.top = `${top}px`
      this.left = `${left}px`
    },
    show () {
      if (!this.selfControl && showingPopup) {
        showingPopup.hide()
        showingPopup = null
      }
      if (this.relateElem == null) {
        return
      }
      if (!this.selfControl) {
        showingPopup = this
      }
      this.initPosition()
      this.isShow = true
      this.$nextTick(() => {
        this.calPosition()
      })
      window.addEventListener('resize', this.calPosition)
      window.addEventListener('scroll', this.calPosition)
      window.addEventListener('click', this.hide)
      this.$emit('show')
    },
    hide () {
      this.isShow = false
      window.removeEventListener('resize', this.calPosition)
      window.removeEventListener('scroll', this.calPosition)
      window.removeEventListener('click', this.hide)
      this.$emit('hide')
    }
  }
})

export default AuPopup
