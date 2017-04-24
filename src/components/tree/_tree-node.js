import AuTree from './_tree.js'
import instance from '../../utils/_instance.js'

export default AuTreeNode = Vue.extend({
  template: require('./_tree-node.jade'),
  components: {
    TreeContent: {
      props: {
        data: Object
      },
      computed: {
        label () {
          return this.data ? this.data.label : ''
        },
      },
      render (h) {
        return h('div', this.$parent.renderContent(h, this.data))
      }
    }
  },
  props: {
    data: Object,
    checkeds: Array
  },
  computed: {
    children () {
      return this.data && this.data.children || null
    },
    disableCheckbox () {
      return this.data && this.data.disableCheckbox || false
    },
    tree () {
      return instance.getParent(this, AuTree)
    },
    displayExpandIcon () {
      return this.children == null ? this.tree.loader != null && !this.isLoaded : this.children.length > 0
    },
    clickRowExpand () {
      return this.tree.clickRowExpand
    },
    checkable () {
      return this.tree.checkable
    },
    renderContent () {
      return this.tree.renderContent
    }
  },
  data () {
    return {
      isExpand: false,
      isLoading: false,
      isLoaded: false,
      isChecked: false,
      indeterminate: false
    }
  },
  created () {
    this.isExpand = this.tree ? this.tree.defaultExpandAll : false
    this.$on('checkout.checked', (checkeds) => {
      const result = this.tree.isChecked(this.data)
      if (result === 'indeterminate') {
        this.indeterminate = true
        this.isChecked = false
      } else {
        this.indeterminate = false
        this.isChecked = result
      }
    })

    this.tree.$on('change.expands', (expands) => {
      if (expands.indexOf(this.data) > -1) {
        let component = this
        while ((component = component.$parent) != null && component instanceof AuTreeNode) {
          component.isExpand = true
        }
        this.isExpand = true
      } else {
        this.isExpand = false
      }
    })
  },
  methods: {
    onClickCheckbox () {
      // do nothing
    },
    onClickExpand () {
      if (this.children) {
        this.isExpand = !this.isExpand
      } else {
        if (this.isExpand) {
          this.isExpand = false
        } else {
          if (this.tree.loader) {
            this.isLoading = true
            this.tree.loader(this.data, () => {
              this.isLoaded = true
              this.isLoading = false
              this.isExpand = true
              if (this.isChecked && this.data.children && this.data.children.length > 0) {
                this.$nextTick(() => {
                  this.tree.$emit('checked', this.data)
                })
              }
            })
          }
        }
      }
    },
    onClickRow () {
      if (this.clickRowExpand) {
        this.onClickExpand()
      }
    },
    onCheckboxChange (value) {
      if (value) {
        this.tree.$emit('checked', this.data)
      } else {
        this.tree.$emit('unchecked', this.data)
      }
    }
  },
  watch: {
    data () {
      this.isLoaded = false
    }
  }
})

Vue.component('au-tree-node', AuTreeNode)
