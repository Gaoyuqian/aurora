import dispatch from '../../mixins/_dispatch'

const PADDING = 10
var showingPopup = null

const AuPopup = Vue.extend({
  template: require('./_popup.jade'),
  mixins: [dispatch],
  props: {
    selfControl: Boolean,
    position: {
      type: String,
      default: 'bottomLeft' // top, left, right, bottom, topLeft, topRight, leftTop, leftBottom, bottomLeft, bottomRight, rightTop, rightBottom
    },
    showArrow: Boolean,
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      top: 0,
      left: 0,
      isShow: false,
      direction: 'bottom'
    }
  },
  computed: {
    style () {
      return {
        top: this.top,
        left: this.left
      }
    },
    classObject () {
      const position = this.position.replace(/([A-Z])/g, (_, match) => {
        return '-' + match.toLowerCase()
      })
      const result = [`au-popup-direction-${this.direction}`, `au-popup-${position}`]

      if (this.type) {
        result.push(`au-popup-${this.type}`)
      }

      return result
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
      const top = this.getTop()
      const left = this.getLeft()

      this.top = `${top}px`
      this.left = `${left}px`
    },
    getTop () {
      const position = this.position
      const relateElem = this.relateElem
      const relateTop = relateElem.offsetTop
      const relateHeight = relateElem.offsetHeight
      const elemHeight = this.$el.offsetHeight
      const minTop = relateTop - elemHeight
      const maxTop = relateTop + relateHeight
      const topBorder = window.scrollY
      const bottomBorder = (window.scrollY + document.documentElement.clientHeight - elemHeight)

      var top = 0

      switch (position) {
        case 'top': case 'topLeft': case 'topRight':
          top = minTop
          this.direction = 'top'

          if (top < topBorder) {
            top = maxTop
            this.direction = 'bottom'

            if (top > bottomBorder) {
              top = topBorder
              this.direction = 'top'
            }
          }
          break

        case 'leftTop': case 'rightTop':
          top = minTop + elemHeight

          if (top > bottomBorder) {
            top = minTop + relateHeight
            if (top < topBorder) {
              top = bottomBorder
            }
          }
          break

        case 'left': case 'right':
          top = minTop + (maxTop - minTop) / 2
          if (top < topBorder) {
            top = Math.min(topBorder, maxTop)
          } else if (top > bottomBorder) {
            top = Math.max(bottomBorder, minTop)
          }
          break

        case 'leftBottom': case 'rightBottom':
          top = minTop + relateHeight
          if (top < topBorder) {
            top = minTop + elemHeight

            if (top > bottomBorder) {
              top = topBorder
            }
          }
          break

        default: // bottomLeft, bottom, bottomRight
          top = maxTop
          this.direction = 'bottom'
          if (top > bottomBorder) {
            top = minTop
            this.direction = 'top'

            if (top < topBorder) {
              top = bottomBorder
              this.direction = 'bottom'
            }
          }
          break
      }

      return top
    },

    getLeft () {
      const position = this.position
      const relateElem = this.relateElem
      const relateLeft = relateElem.offsetLeft
      const relateWidth = relateElem.offsetWidth
      const elemWidth = this.$el.offsetWidth
      const minLeft = relateLeft - elemWidth
      const maxLeft = relateLeft + relateWidth
      const leftBorder = window.scrollX
      const rightBorder = (window.scrollX + document.documentElement.clientWidth - elemWidth)

      var left = 0

      switch (position) {
        case 'left': case 'leftTop': case 'leftBottom':
          left = minLeft
          this.direction = 'left'
          if (left < leftBorder) {
            left = maxLeft
            this.direction = 'right'
            if (left > rightBorder) {
              left = leftBorder
              this.direction = 'left'
            }
          }
          break

        case 'topLeft': case 'bottomLeft':
          left = minLeft + elemWidth
          if (left > rightBorder) {
            left = minLeft + relateWidth
            if (left < leftBorder) {
              left = rightBorder
            }
          }
          break

        case 'top': case 'bottom':
          left = minLeft + (maxLeft - minLeft) / 2
          if (left < leftBorder) {
            left = Math.min(leftBorder, maxLeft)
          } else if (left > rightBorder) {
            left = Math.max(rightBorder, minLeft)
          }
          break

        case 'topRight': case 'bottomRight':
          left = minLeft + relateWidth
          if (left < leftBorder) {
            left = minLeft + elemWidth
            if (left > rightBorder) {
              left = leftBorder
            }
          }
          break

        default: // rightTop, right, rightBottom
          left = maxLeft
          this.direction = 'right'
          if (left > rightBorder) {
            left = minLeft
            this.direction = 'left'
            if (left < leftBorder) {
              left = rightBorder
              this.direction = 'right'
            }
          }
          break
      }

      return left
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
