import Popup from '../popup/_popup.js'

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
    mutiple: Boolean
  },
  data () {
    return {
      text: '',
      optionsElem: null,
      registeredChild: {},
      active: false,
      selected: []
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
  },
  methods: {
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
      return this.mutiple ? this.value.length === 0 : !this.value
    },
    addValue (value, child) {
      if (this.mutiple) {
        this.selected.push({
          label: child.label,
          value
        })

        this.$emit('input', this.value.concat(value))
      } else {
        this.$emit('input', value)
      }
    },
    removeValue (value) {
      this.selected = this.selected.filter((selected) => {
        return selected.value !== value
      })

      this.$emit('input', this.selected.map((select) => {
        return select.value
      }))
    },
    removeValueHandler ($event, value) {
      $event.stopPropagation()
      this.removeValue(value)
    },
    clickHandler ($event) {
      $event.stopPropagation()
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
          console.log('onshow')
          this.active = true
        })
        this.optionsElem.$on('hide', () => {
          console.log('onhide')
          this.active = false
        })
      }

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
