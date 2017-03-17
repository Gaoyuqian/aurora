import dispatch from '../../mixins/_dispatch.js'
import Popup from '../popup/_popup.js'

const AuMenuItem = Vue.extend({
  mixins: [dispatch],
  props: {
    href: String,
    target: String,
    icon: String,
    label: String
  },
  data () {
    return {
      hasChild: false,
      isShowChild: false,
      childHeight: 0,
      isHeader: false,
      isSidebar: false,
      popup: null,
      timer: null
    }
  },
  created () {
    const $slots = this.$slots.default
    this.hasChild = ($slots != null && $slots.length > 0)
  },
  render (h) {
    const $slots = this.$slots.default
    const childs = []
    var elemName, elemAttrs
    if (this.icon) {
      childs.push(
        h('div', {
          'class': 'au-menu-item-icon'
        },[
          h('au-icon', {
            props: {
              icon: this.icon
            }
          })
        ])
      )
    }
    const content = this.$slots.content

    if (content && content.length > 0) {
      if (content[0].elm) {
        content[0].elm.classList.add('au-menu-item-text')
      }
    }

    childs.push(
      content || h('div',
        {
          'class': 'au-menu-item-text'
        },
        this.label
      )
    )

    if (this.hasChild) {
      childs.push(
        h('div',
          {
            'class': 'au-menu-item-arrow'
          },
          [h('au-icon', {
            props: {
              icon: 'chevron-down'
            }
          })]
        )
      )
    }

    if (this.href) {
      elemName = 'a'
      elemAttrs = {
        href: this.href,
        target: this.target
      }
    } else {
      elemName = 'div'
      elemAttrs = {}
    }

    return h(
      elemName,
      {
        'class': {
          'au-menu-item': true,
          'au-menu-item-show-child': this.isShowChild
        },
        attrs: elemAttrs,
        on: {
          click: this.clickHandler,
          mouseover: this.mouseoverHandler,
          mouseout: this.mouseoutHandler
        }
      },
      [
        h(
          'div',{
            'class': 'au-menu-item-title'
          },
          childs
        ),
        h(
          'div',{
            'class': 'au-menu-item-child',
            style: {
              height: this.isSidebar ? this.childHeight ? this.childHeight + 'px' : 0 : ''
            }
          },
          $slots
        )
      ]
    )
  },
  methods: {
    clearTimer () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    clickHandler ($event) {
      $event.stopPropagation()

      if (this.$parent.trigger === 'click') {
        this.toggleChild()
      }
      this.dispatch('click.item')
    },
    mouseoverHandler ($event) {
      if (this.$parent.trigger === 'hover') {
        this.toggleChild(true)
      }
      this.$parent.$emit('mouseover.item', this)
      this.$parent.$emit('show.line', this)
    },
    mouseoutHandler ($event) {
      if (this.$parent.trigger === 'hover') {
        this.toggleChild(false)
      }
      this.$parent.$emit('mouseout.item', this)
      this.$parent.$emit('hide.line', this)
    },
    toggleChild (willShow) {
      this.clearTimer()

      if (this.hasChild) {
        if (this.isSidebar) {
          willShow = willShow || !this.isShowChild
          this.isShowChild = willShow

          this.timer = setTimeout(() => {
            if (this.isShowChild) {
              const menu = this.$el.querySelector('.au-menu')
              this.childHeight = menu.offsetHeight
            } else {
              this.childHeight = 0
            }
          }, this.$parent.trigger === 'hover' ? 100 : 0)
        } else if (this.isHeader) {
          willShow = willShow || !this.popup.isShow
          if (willShow) {
            this.dispatch('show.line', this)
          } else {
            this.dispatch('hide.line', this)
          }
          this.timer = setTimeout(() => {
            if (this.popup) {
              this.popup.$el.style.minWidth = this.$el.offsetWidth + 'px'
              if (willShow) {
                this.popup.show()
              } else {
                this.popup.hide()
              }
            }
          }, this.$parent.trigger === 'hover' ? 100 : 0)
        }
      }
    },
    show () {
      this.toggleChild(true)
    },
    hide () {
      this.toggleChild(false)
    },
    setIsHeader () {
      this.isHeader = true
      if (this.hasChild) {
        const child = this.$el.querySelector('.au-menu-item-child')
        this.popup = new Popup()
        this.popup.$mount(document.createElement('div'))
        this.popup.$el.querySelector('.au-popup-content').appendChild(child)
        this.popup.setRelateElem(this.$el)
        document.body.appendChild(this.popup.$el)
        this.popup.setDropdown(this)

        this.popup.$on('show', () => {
          this.isShowChild = true
        })

        this.popup.$on('hide', () => {
          this.isShowChild = false
        })
      }
    },
    setIsSidebar () {
      this.isSidebar = true
      this.childHeight = 0
    }
  }
})

Vue.component('au-menu-item', AuMenuItem)

export default AuMenuItem
