import Popup from '../popup/_popup.js'
import Option from '../option/_option.js'

const AuSelect = Vue.extend({
  template: require('./_select.jade'),
  components: {
    Popup
  },
  props: {
    options: {
      type: Array,
      default: () => {
        return null
      }
    },
    value: {
      type: [Number, String, Array],
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    mutiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      text: '',
      optionsElem: null,
      registeredChild: {},
      active: false
    }
  },
  computed: {
    selected () {
      this.value

      if (this.mutiple) {
        return this.value.map((value) => {
          var label = this.getLabel(value)
          return { label, value }
        })
      } else {
        return []
      }
    }
  },
  created () {
    this.$on('select.option', (value, child) => {
      this.addValue(value, child)
      if (!this.mutiple) {
        this.hideOptions()
      }

      this.$nextTick(() => {
        this.$refs.popup.calPosition()
      })
    })

    this.$on('unselect.option', (value, child) => {
      if (!this.mutiple) {
        return
      }
      this.removeValue(value)
      if (!this.mutiple) {
        this.hideOptions()
      }

      this.$nextTick(() => {
        this.$refs.popup.calPosition()
      })
    })

    this.$on('register.option', (child) => {
      this.registeredChild[child._uid] = child
      this.setOptionActive()
      this.calcText()
    })

    this.$on('unregister.option', (child) => {
      delete this.registeredChild[child._uid]
      this.setOptionActive()
      this.calcText()
    })
  },
  methods: {
    getLabel (value) {
      var cid, child

      for (cid in this.registeredChild) {
        child = this.registeredChild[cid]
        if (child.value === value) {
          return child.label
        }
      }

      return ''
    },
    calcText () {
      var label = '', child
      if (this.isEmptyValue()) {
        this.text = this.placeholder
      } else {
        for (var key in this.registeredChild) {
          child = this.registeredChild[key]

          if (child.value === this.value) {
            label = child.label
            break
          }
        }
        this.text = label
      }
    },
    isEmptyValue () {
      return this.mutiple ? this.value.length === 0 : this.value === ''
    },
    addValue (value, child) {
      if (this.disabled) {
        return
      }
      if (this.mutiple) {
        this.$emit('input', this.value.concat(value))
      } else {
        this.$emit('input', value)
      }
    },
    removeValue (value) {
      if (this.disabled) {
        return
      }
      const pos = this.value.indexOf(value)
      if (pos > -1) {
        this.value.splice(pos, 1)
      }
      this.$emit('input', this.value.slice())
    },
    removeValueHandler ($event, value) {
      $event.stopPropagation()
      this.removeValue(value)
      this.$nextTick(this.$refs.popup.calPosition)
    },
    clickHandler ($event) {
      $event.stopPropagation()
      if (this.disabled) {
        return
      }
      this.showOptions();
    },
    showOptions () {
      if (this.active) {
        this.hideOptions()
        return
      }

      if (this.optionsElem == null) {
        this.optionsElem = this.$refs.popup
        this.optionsElem.setRelateElem(this.$el)
        document.body.appendChild(this.optionsElem.$el)
        this.optionsElem.$on('show', () => {
          this.active = true
        })
        this.optionsElem.$on('hide', () => {
          this.active = false
        })
      }

      console.log(this.$refs.options.style)
      this.$refs.options.style.minWidth = this.$el.getClientRects()[0].width - 2 + 'px'
      this.optionsElem.show()
    },
    hideOptions () {
      this.optionsElem.hide()
    },
    setOptionActive () {
      var child
      const value = this.mutiple ? this.value : [this.value]
      for (var key in this.registeredChild) {
        child = this.registeredChild[key]
        child.setActive(value.indexOf(child.value) > -1)
      }
    }
  },
  watch: {
    value () {
      this.setOptionActive()
      this.calcText()
    }
  }
})

Vue.component('au-select', AuSelect)

export default AuSelect
