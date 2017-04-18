import AuForm from '../form/_form.js'
import instance from '../../utils/_instance.js'
import dispatch from '../../mixins/_dispatch'
import Validator from '../validator/_validator.js'

const AuFormItem = Vue.extend({
  template: require('./_form-item.jade'),
  mixins: [dispatch],
  props: {
    label: {
      type: String,
      default: ''
    },
    labelPosition: String,
    labelWidth: [Number, String],
    rules: [ Array, Object ], // [{ required, type, message, trigger }]
    prop: String,
  },
  data () {
    return {
      form: null, // set by parent au-form
      message: '',
      hasError: false,
      validator: new Validator()
    }
  },
  mounted () {
    this.validator.setRules(this.getRules())
    this.dispatch('register.form.item', this)

    this.$on('blur.form', this.onControlBlur);
    this.$on('change.form', this.onControlChange);
    this.$nextTick(this.getValue)
  },
  beforeDestroy () {
    this.dispatch('unregister.form.item', this)
  },
  computed: {
    _labelWidth () {
      return this.getProp('labelWidth')
    },
    _labelPosition () {
      return this.getProp('labelPosition')
    },
    isLabelTop () {
      return this._labelPosition === 'top'
    },
    labelStyle () {
      const style = {}
      if (!this.isLabelTop && this._labelWidth) {
        style.width = this._labelWidth + 'px'
      }
      return style
    },
    cls () {
      const cls = []
      if (this._labelPosition) {
        cls.push(`au-form-item-label-${this._labelPosition}`)
      }

      if (this.hasError) {
        cls.push(`au-form-item-has-error`)
      }

      if (this.isRequired) {
        cls.push(`au-form-item-required`)
      }

      return cls
    },
    inline () {
      return this.form ? this.form.inline : false
    },
    isRequired () {
      return this.getRules().some(rule => rule.required)
    }
  },
  methods: {
    onControlBlur () {
      this.$nextTick(() => {
        this.validate('blur')
      })
    },
    onControlChange () {
      this.$nextTick(() => {
        this.validate('change')
      })
    },
    getValue () {
      const model = this.form.model
      const path = this.prop
      if (model && path) {
        const found = instance.getPropByPath(model, path)
        if (found) {
          return found.get()
        }
      }
      return null
    },
    getProp (name) {
      if (this[name]) {
        return this[name]
      }

      const form = this.form

      if (form) {
        return form[name] || ''
      }
    },
    validate (type, callback) {
      const rules = this.getRules()

      if (!rules) {
        return
      }
      this.validator.validate(type, this.getValue(), (messages) => {
        if (messages.length > 0) {
          this.hasError = true
          this.message = messages[0]
        } else {
          this.hasError = false
          this.message = ''
          callback && callback()
        }
      })
    },
    getRules () {
      const form = this.form
      const rules = this.rules ? Array.isArray(this.rules) ? this.rules : [this.rules] : []
      if (form) {
        let formRules = form.rules && form.rules[this.prop] || []
        rules = rules.concat(formRules)
      }
      return rules
    }
  },
  watch: {
    rules () {
      this.validator.setRules(this.rules)
    }
  }
})

Vue.component('au-form-item', AuFormItem)

export default AuFormItem
