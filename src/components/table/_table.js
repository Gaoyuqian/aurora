import AuTableHead from './_table-head.js'
import AuTableBody from './_table-body.js'
import AuTableFixed from './_table-fixed.js'
import TableColumn from './_table-column.js'
import TableContainer from './_table-container.js'
import { TableModel } from './_table-model.js'

const AuTable = Vue.extend({
  template: require('./_table.jade'),
  components: {
    TableContainer,
    AuTableHead,
    AuTableBody,
    AuTableFixed
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    noHeader: Boolean, // depre
    loading: Boolean,
    maxHeight: [String, Number],
    bordered: Boolean
  },
  data () {
    return {
      columns: [],
      model: null,
      timestamp: new Date()
    }
  },
  computed: {
    style () {
      this.timestamp
      const maxHeight = String(this.maxHeight) || 'auto'

      if (maxHeight.match(/^\d+$/)) {
        maxHeight += 'px'
      }

      return {
        'min-width': this.model ? this.model.minWidth : 'auto',
        'max-height': maxHeight
      }
    },
    cls () {
      const cls = []
      if (this.bordered) {
        cls.push('au-table-bordered')
      }
      return cls
    },

    mainColumns () {
      this.timestamp
      return this.model ?
             this.model.columns.filter((column) => {
               return !column.fixed
             }) : []
    }
  },
  created () {
    this.$on('update.table', this.onUpdateTable)
    this.onUpdateTable()
  },
  mounted () {
    this.$refs.scroll.addEventListener('scroll', this.onScroll)
    window.addEventListener('scroll', this.calPosition)
    window.addEventListener('resize', this.calPosition)
    this.$nextTick(this.calPosition)
  },
  beforeDestroy () {
    this.$refs.scroll.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('scroll', this.calPosition)
    window.removeEventListener('resize', this.calPosition)
  },
  methods: {
    calPosition () {
      const table = this.$refs.scroll.querySelector('table')
      const rect = table.getBoundingClientRect()
      this.model.tableWidth = rect.width
      const headRect = this.$refs.headScroll.$el.getBoundingClientRect()
      this.model.tableHeadHeight = headRect.height
    },
    onScroll ($event) {
      const target = $event.target
      this.model.tableScrollLeft = target.scrollLeft
      this.model.tableScrollTop = target.scrollTop
    },
    onUpdateTable () {
      this.timestamp = new Date()
      this.updateColumns()
      this.model = new TableModel(this)
    },
    updateColumns () {
      console.log('columns')
      console.log(this.$slots.default)
      this.columns = (this.$slots.default || []).filter((slot) => {
        return slot.componentInstance instanceof TableColumn
      }).map((slot, index) => {
        return slot.componentInstance
      })
    }
  },
  watch: {
    'model.tableScrollLeft' (value) {
      this.$refs.headScroll.$el.scrollLeft = value
    },
    data () {
      this.$nextTick(this.onUpdateTable)
    }
  }
})

Vue.component('au-table', AuTable)

export default AuTable
