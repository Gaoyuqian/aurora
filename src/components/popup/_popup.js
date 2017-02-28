const PADDING = 10
var showingPopup = null

const AuPopup = Vue.extend({
  template: require('./_popup.jade'),
  props: {

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

      if (elemHeight > windowHeight) {
        this.$el.style.height = (windowHeight - PADDING * 2) + 'px'
      } else {
        this.$el.style.height = 'auto'
      }

      if ((top + elemHeight) > (windowY + windowHeight)) {
        top = Math.max(
          (windowY + windowHeight) - elemHeight - PADDING,
          relateElem.offsetTop - elemHeight
        )
      }

      if ((left + elemWidth) > (windowX + windowWidth)) {
        if (elemWidth < windowWidth) {
          left = relateElem.clientWidth + relateElem.offsetLeft - elemWidth
        } else {
          left = Math.max(
            (windowX + windowWidth) - elemWidth,
            relateElem.offsetLeft + relateElem.clientWidth - Math.max(relateElem.clientWidth, elemWidth)
          )
        }
      }

      this.top = `${top}px`
      this.left = `${left}px`

    },
    initPosition () {
      const relateElem = this.relateElem
      var top = relateElem.offsetTop + relateElem.offsetHeight
      var left = relateElem.offsetLeft

      this.$el.style.height = 'auto'
      this.top = `${top}px`
      this.left = `${left}px`
    },
    show () {
      if (showingPopup) {
        showingPopup.hide()
        showingPopup = null
      }
      if (this.relateElem == null) {
        return
      }
      showingPopup = this
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
