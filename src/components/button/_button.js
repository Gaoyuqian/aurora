
Vue.component('au-button', {
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'default'
    },
    href: {
      type: String,
      default: null
    },
    target: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    headingIcon: {
      type: String,
      default: null
    },
    trailingIcon: {
      type: String,
      default: null
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    disableOnClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classObj () {
      const obj = ['au-button']

      if (this.size !== 'default') {
        obj.push(`au-button-${this.size}`)
      }

      if (this.block) {
        obj.push('au-button-block')
      }

      if (this.type) {
        obj.push(`au-button-${this.type}`)
      }

      if (this.icon) {
        obj.push(`au-button-icon`)
      }

      return obj
    }
  },
  render (h) {
    const child = []

    if (this.loading) {
      child.push(h('au-icon', {
        props: {
          size: this.size,
          icon: 'spinner',
          autorotate: true
        }
      }))
    }

    if (this.icon != null) {
      child.push(h('au-icon', {
        props: {
          size: this.size,
          icon: this.icon
        }
      }))
    } else {
      if (this.headingIcon != null) {
        child.push(h('au-icon', {
          'class': 'au-button-heading-icon',
          props: {
            size: this.size,
            icon: this.headingIcon
          }
        }))
      }

      child.push(this.$slots.default)

      if (this.trailingIcon != null) {
        child.push(h('au-icon', {
          'class': 'au-button-trailing-icon',
          props: {
            size: this.size,
            icon: this.trailingIcon
          }
        }))
      }
    }

    if (this.href != null) {
      return h(
        'au-active-transition',
        {
          props: {
            disabled: this.disabled
          }
        },
        [
          h(
            'a',
            {
              'class': this.classObj,
              attrs: {
                href: this.href,
                target: this.target
              },
              on: {
                click: this.clickHandler
              }
            },
            child
          )
        ]
      )
    } else {
      return h(
        'au-active-transition',
        {
          props: {
            disabled: this.disabled
          }
        },
        [
          h(
            'button',
            {
              'class': this.classObj,
              attrs: {
                type: this.nativeType,
                disabled: this.disabled || this.loading
              },
              on: {
                click: this.clickHandler
              }
            },
            child
          )
        ]
      )
    }
  },
  methods: {
    clickHandler () {
      this.$el.blur();

      if (this.disabled) {
        return
      }

      if (this.disableOnClick) {
        this.disabled = true
      }
      this.$emit('click', (this.enable))
    },
    enable () {
      this.disabled = false
    }
  }
})
