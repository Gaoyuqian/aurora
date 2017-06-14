import dispatch from '../../mixins/_dispatch.js'

export default AuTree = Vue.extend({
  template: require('./_tree.jade'),
  mixins: [dispatch],
  props: {
    data: [Array, Object],
    defaultExpandAll: Boolean,
    loader: Function,
    clickRowExpand: {
      type: Boolean,
      default: true
    },
    checkable: Boolean,
    expands: {
      type: Array,
      default () {
        return []
      }
    },
    defaultCheckeds: Array
  },
  data () {
    return {
      checkeds: []
    }
  },
  created () {
    this.$on('checked', (data) => {
      this.addChecked(data)
      this.broadcast('checkout.checked')
      this.$nextTick(() => {
        this.$emit('check', this.checkeds)
      })
    })
    this.$on('unchecked', (data) => {
      this.removeChecked(data)
      this.broadcast('checkout.checked')
      this.$nextTick(() => {
        this.$emit('check', this.checkeds)
      })
    })
  },
  mounted () {
    this.addDefaultCheckes()
    if (this.expands) {
      this.setExpands(this.expands)
    }
  },
  methods: {
    isChecked (data) {// return true, false, indeterminate
      var indeterminate = false
      const checkedCount = 0
      const length = data.children ? data.children.length : 0
      if (length > 0) {
        data.children.some((data) => {
          const result = this.isChecked(data)
          if (result === 'indeterminate') {
            indeterminate = true
            return true
          } else if (result === true) {
            checkedCount++
          }

          return false
        })

        if (indeterminate) {
          return 'indeterminate'
        } else {
          if (checkedCount === length) {
            return true
          } else if (checkedCount === 0) {
            return false
          } else {
            return 'indeterminate'
          }
        }

      } else {
        return this.getCheckedPos(data) > -1
      }
    },
    getCheckedPos (data) {
      return this.checkeds.indexOf(data)
    },
    addChecked (data) {
      if (data.children != null && data.children.length > 0) {
        this.realRemoveChecked(data)
        data.children.forEach((child) => {
          this.addChecked(child)
        })
        return
      }
      if (this.getCheckedPos(data) === -1) {
        this.checkeds.push(data)
      }
    },
    removeChecked (data) {
      if (data.children != null && data.children.length > 0) {
        data.children.forEach((child) => {
          this.removeChecked(child)
        })
      }
      this.realRemoveChecked(data)
    },
    realRemoveChecked (data) {
      const pos = this.getCheckedPos(data)
      if (pos > -1) {
        this.checkeds.splice(pos, 1)
      }
    },
    renderContent (h, data) {
      if (data == null) {
        debugger
      }
      data = data || {}
      const Ctor = this.$scopedSlots.default
      return Ctor ? Ctor({ data }) : data.label
    },
    setExpands (value) {
      console.log('setExpands')
      this.$emit('change.expands', value)
    },
    addDefaultCheckes () {
      if (this.defaultCheckeds != null) {
        this.checkeds.push.apply(this.checkeds, this.defaultCheckeds)
        this.broadcast('checkout.checked')
      }
    }
  },
  watch: {
    expands (value) {
      this.setExpands(value)
    },
    defaultCheckeds (value) {
      this.addDefaultCheckes()
    }
  }
})

Vue.component('au-tree', AuTree)
