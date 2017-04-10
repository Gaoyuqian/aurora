import AuTableHead from './_table-head.js'
import AuTableBody from './_table-body.js'

const AuTableFixed = Vue.extend({
  template: require('./_table-fixed.jade'),
  components: {
    AuTableHead,
    AuTableBody
  },
  props: {
    model: Object,
    fixedType: String,
    fixedColumns: Array
  },
  computed: {
    cls () {
      return [`au-table-fixed-${this.fixedType}`]
    }
  },
  mounted () {
    this.calPosition()
    this.updateScroll()
  },
  data () {
    return {
      tableWidth: null,
      fixedWidth: null
    }
  },
  methods: {
    calPosition () {
      this.$refs.fixedInner.style.width = `${this.model.tableWidth}px`
      this.$nextTick(() => {
        const fixedCell = this.$el.querySelectorAll('thead .au-table-fixed-cell')
        const fixedWidth = [].reduce.call(fixedCell, (sum, cell) => {
          const rect = cell.getBoundingClientRect()
          return sum + rect.width
        }, 0)
        this.$refs.fixed.style.width = `${fixedWidth}px`
      })
      this.$refs.bodyWrapper.style.top = `${this.model.tableHeadHeight}px`
    },
    updateScroll (value) {
      console.log(this.$refs.bodyWrapper, value)
      this.$refs.bodyWrapper.scrollTop = value
    }
  },
  watch: {
    'model.tableWidth' () {
      this.calPosition()
    },
    'model.tableHeadHeight' () {
      this.calPosition()
    },
    'model.tableScrollTop' (value) {
      this.updateScroll(value)
    }
  }
})

export default AuTableFixed
