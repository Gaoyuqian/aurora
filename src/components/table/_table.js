import {hx, inArray, idxArray, getScrollWidth} from '../../utils/_tools.js'
import instance from '../../utils/_instance.js'
import resizer from '../../utils/_resizer.js'

// checkbox, expand 宽度56
var SMALL_WIDTH = 56
// th最小宽度
var MIN_WIDTH = 80
// 行高
var TR_HEIGHT = 41
// 滚动条宽度
var SCROLL_WIDTH = 0

var AuTableColumn = Vue.extend({
  props: {
    type: {
      type: String,
      default: '',          // '',checkbox,expend,radio
    },
    label: String,
    attrName: String,
    width: [Number, String],
    highlight: Boolean,     // 是否高亮列

    // 排序相关
    sortable: [Boolean, String],
    sortMethod: Function,

    // 扩展行
    expandRows: {
      type: Array,
      default: function (){
        return []
      }
    },
    defaultExpandAll: Boolean,

    fixed: Boolean,
  },
  render: function (h){
    return h('')
  }
})

var AuTable = Vue.extend({
  props: {
    data: {
      type: Array,
      default: function (){
        return []
      }
    },
    maxHeight: Number,
    bordered: Boolean,
    showHeader: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  data: function (){
    return {
      columnsConf: [],            // 列信息汇总
      checkeds: [],               // 选中的数据
      expandRows: [],             // 展开的数据
      sortCol: {                  // 当前排序的字段
        prop: '',
        order: '',                // asc, desc, ''
        sortMethod: null,
      },
      // renderTime: 0,              // 用来触发render
      mouseCurrIdx: -1,
    }
  },
  methods: {
    // 获取colums信息
    _getColumnsConf: function (){
      var me = this
      this.$slots.default.forEach($slot=>{
        var componentOptions = $slot.componentOptions

        if (componentOptions && componentOptions.tag === 'au-table-column'){
          // console.log($slot)

          var $instance = $slot.componentInstance

          // 列信息表
          var colConf = {
            instance: $instance,
            type: $instance.type,
            label: $instance.label,
            attrName: $instance.attrName,
            width: parseFloat($instance.width) || 0,
            expandRows: $instance.expandRows,
            defaultExpandAll: $instance.defaultExpandAll,
            sortable: $instance.sortable,
            sortMethod: $instance.sortMethod,
            fixed: $instance.fixed,
            highlight: $instance.highlight,

            scopedSlot: $instance.$scopedSlots.default,
          }
          me.columnsConf.push(colConf)

          if (inArray(componentOptions.propsData.type, ['checkbox', 'radio'])){
            colConf.width = colConf.width || SMALL_WIDTH
            me.checkeds = $slot.data.props.value
          }

          if (componentOptions.propsData.type === 'expand'){
            colConf.width = colConf.width || SMALL_WIDTH
            me.expandRows = componentOptions.propsData.expandRows || []

            if ($instance.defaultExpandAll === true){
              me.data.forEach(data=>{
                me.expandRows.push(data)
              })
            }
          }
        }
      })

      // 计算列宽信息
      var boxWidth = this.$el.getBoundingClientRect().width - 2 - SCROLL_WIDTH
      
      // 已经设置width的列的width总和
      var widthCount = 0
      var colCount = 0
      this.columnsConf.forEach(colConf=>{
        if (colConf.width){
          widthCount += colConf.width
          colCount ++
        }
      })

      // 剩余每列的平均宽度，最小100
      var perWidth = Math.max(MIN_WIDTH, 
        (boxWidth-widthCount) / (this.columnsConf.length-colCount)
      )
      perWidth = parseInt(perWidth)

      this.columnsConf.forEach(colConf=>{
        colConf.width = colConf.width || perWidth
      })

    },

    // 得到列宽元素
    _getColgroup: function (){
      var $group = hx('colgroup')

      // 如果尚未mounted，则忽略
      if (this.columnsConf.length === 0){
        return $group
      }

      this.columnsConf.forEach(colConf=>{
        var $col = hx('col', {
          attrs: {
            width: colConf.width
          }
        })
        $group.push($col)
      })

      return $group
    },

    // 当无数据时候展示
    _getEmpty: function (){
      var $slot = this.$slots['empty']

      // 所有列总宽度
      var colWidthCount = 0
      this.columnsConf.forEach(colConf=>{
        colWidthCount += colConf.width
      })

      return hx('div.au-table-empty', {
        style: {
          width: colWidthCount + 'px'
        }
      }, [$slot || '暂无数据'])
    },

    // 根据排序方法得到新的数据
    _getDataBySort: function (method){
      var data = [...this.data]
      var sortColProp = this.sortCol.prop
      var sortColOrder = this.sortCol.order

       if (sortColProp !== '' && sortColOrder !== ''){
        // 如果自定义排序方法
        if (method){
          data.sort((a, b)=>{
            return method(sortColOrder, a, b)
          })
        }
        else {
          data.sort((a, b)=>{
            var aVal = this._getAttrValue(a, sortColProp)
            var bVal = this._getAttrValue(b, sortColProp)

            if (sortColOrder === 'desc'){
              return aVal < bVal
            }
            else {
              return aVal > bVal
            }
          })
        }
       }
      
      return data
    },

    // 根据属性key得到属性值，支持多级调用，比如a.b.c
    _getAttrValue: function (obj, attr){
      if (!obj || !attr){
        return
      }

      var key = '([\\w\\$]+)'
      var origAttr = attr
      var origObj = JSON.stringify(obj)
  
      attr = attr.replace(new RegExp('^' + key), (_, value) => {
        try {
          obj = obj[value]
        } catch (e) {
          console.error(`Cannot get value by ${origAttr} in AuTable`, origObj)
          obj = ''
        }
        return ''
      })
  
      while (attr) {
        let found = false
        attr = attr.replace(new RegExp('^\\.' + key + '|^\\[' + key + '\\]'), (_, value1, value2) => {
          var value = value1 || value2
          try {
            obj = obj[value]
            found = true
  
          } catch (e) {
            console.error(`Cannot get value by ${origAttr} in AuTable`, origObj)
            obj = ''
          }
          return ''
        })
  
        if (!found) {
          if (attr) {
            console.error(`cannot match attr-name: ${attr} in AuTable`, origObj)
          }
          break
        }
      }
  
      return obj
    },

    _getTHead: function($colgroup, flag){
      if (!this.showHeader){
        return null
      }

      // flag 标记是否为最上层单独的au-table-head
      var $thsAndTrs = this._getThsAndTrs()

      return hx('div.au-table-head', {
        'class': {
          'au-table-head-top': flag ? true: false
        }
      })
      // au-table-head-inner
      .push(
        hx('div.au-table-head-inner')
        // table
        .push(
          hx('table')
          // colgroup
          .push(
            $colgroup
          )
          // thead
          .push(
            hx('thead')
            // ths
            .push(
              $thsAndTrs.ths
            )
          )
        )
      )
    },

    _getTBody: function ($colgroup){
      var $thsAndTrs = this._getThsAndTrs()

      return (this.data.length === 0) ? this._getEmpty() : 
      hx('div.au-table-body')
      .push(
        hx('table')
        .push(
          $colgroup
        )
        .push(
          hx('tbody')
          .push(
            $thsAndTrs.trs
          )
        )
      )
    },

    _getTFixedLeft: function ($colgroup, $ths, $trs){
      var $thead = this._getTHead($colgroup)
      var $tbody = this._getTBody($colgroup)

      // 得到左侧fixed列的宽度总和
      var widthCount = 0

      this.columnsConf.every(colConf=>{
        if (colConf.fixed !== true){
          return false
        }
        widthCount += colConf.width
        return true
      })

      // 没有left fixed的列
      if (widthCount === 0){
        return null
      }

      return hx('div.au-table-fixed + au-table-fixed-left', {
        style:  {
          width: widthCount + 'px',
          bottom: SCROLL_WIDTH + 'px'
        }
      })
      .push(
        hx('div.au-table-fixed-inner')
        .push(
          $thead
        )
        .push(
          hx('div.au-table-fixed-body + au-table-fixed-left-body', {
            style: {
              top: this.showHeader ? (TR_HEIGHT + 'px') : 0
            }
          })
          .push(
            $tbody
          )
        )
      )
    },

    _getFixedRightWidth: function (){
      // 得到右侧fixed列的宽度总和
      var widthCount = 0
      for (var i=this.columnsConf.length-1, colConf; i>=0; i--){
        colConf = this.columnsConf[i]

        if (colConf.fixed !== true){
          break
        }
        widthCount += colConf.width
      }

      return widthCount
    },

    _getTFixedRight: function ($colgroup, $ths, $trs){
      var $thead = this._getTHead($colgroup)
      var $tbody = this._getTBody($colgroup)

      // 得到右侧fixed列的宽度总和
      var widthCount = this._getFixedRightWidth()

      // 没有right fixed的列
      if (widthCount === 0){
        return null
      }

      return hx('div.au-table-fixed + au-table-fixed-right', {
        style: {
          width: widthCount + 'px',
          bottom: SCROLL_WIDTH + 'px',
        }
      })
      .push(
        hx('div.au-table-fixed-inner')
        .push(
          $thead
        )
        .push(
          hx('div.au-table-fixed-body + au-table-fixed-right-body', {
            style: {
              top: this.showHeader ? (TR_HEIGHT + 'px') : 0
            }
          })
          .push(
            $tbody
          ) 
        )
      )
    },

    _getThsAndTrs: function (){
      var me = this

      // 扩展行所对应的scoped slot
      var expandScopedSlot = null
    
      // 表头
      var $ths = this.columnsConf.map(colConf=>{
        var isSortable = inArray(colConf.sortable, [true, 'custom'])
        var $cellChild = colConf.label
  
        // 总开关
        if (colConf.type === 'checkbox'){
          $cellChild = hx('au-checkbox', {
            props: {
              checkedValue: me.checkeds.length === me.data.length && me.checkeds.length !== 0,
              indeterminate: me.checkeds.length > 0 && me.checkeds.length < me.data.length
            },
            on: {
              input: function (val){
                if (val === true){
                  me.data.forEach(data=>{
                    if (!inArray(data, me.checkeds)){
                      me.checkeds.push(data)
                    }
                  })
                }
                else {
                  // me.checkeds是对au-cloumns v-model的引用，不能直接赋值
                  // me.checkeds = []
                  while (me.checkeds.length){
                    me.checkeds.pop()
                  }
                }
              }
            }
          })
        }
        else if (colConf.type === 'radio'){
          $cellChild = null
        }
        else if (colConf.type === 'expand'){
          $cellChild = null
          expandScopedSlot = colConf.scopedSlot
        }
  
        var $tableCell = hx('div.au-table-cell', {}, [$cellChild])
        if (isSortable){
          var sortCol = me.sortCol
          var iconType = 'sort'
  
          if (colConf.attrName === sortCol.prop){
            if (sortCol.order !== ''){
              iconType = `sort-${sortCol.order}`
            }
          }
  
          $tableCell = hx('div.au-table-cell + au-table-cell-sort', {
            on: {
              click: function (){
                // 如果点击的是当前排序的列
                if (sortCol.prop === colConf.attrName){
                  if (sortCol.order === ''){
                    sortCol.order = 'desc'
                  }
                  else if (sortCol.order === 'desc'){
                    sortCol.order = 'asc'
                  }
                  else {
                    sortCol.order = ''
                  }
                }
                // 否则重置order
                else {
                  sortCol.order = 'desc'
                }
  
                sortCol.prop = colConf.attrName
  
                // 排序数据
                if (colConf.sortable === 'custom'){
                  me.$emit('sort-change', {
                    column: colConf, 
                    prop: sortCol.prop, 
                    order: sortCol.order
                  })
                }
                
              }
            }
          })
          .push($cellChild)
          .push(
            hx('au-icon.au-table-sort-icon', {
              props: {
                icon: iconType
              }
            })
          )
        }
  
        return hx('th').push($tableCell)
      })
  
      // 表内容
      var $trs = []
      this._getDataBySort().forEach((data, index)=>{
        var $tds = me.columnsConf.map(colConf=>{
          var $cellChild = me._getAttrValue(data, colConf.attrName)// data[colConf.attrName]
          var scopedSlot = colConf.scopedSlot
  
          if (colConf.type === 'checkbox'){
            $cellChild = hx('au-checkbox', {
              props: {
                checkedValue: inArray(data, me.checkeds)
              },
              on: {
                input: function (val){
                  var idx = me.checkeds.indexOf(data)
                  if (val === true){
                    if (idx === -1){
                      me.checkeds.push(data)
                    }
                  }
                  else {
                    if (idx !== -1){
                      me.checkeds.splice(idx, 1)
                    }
                  }
                }
              }
            })
          }
          else if (colConf.type === 'radio'){
            $cellChild = hx('au-radio', {
              props: {
                value: data,
                checkedValue: me.checkeds[0]
              },
              on: {
                input: function (val){
                  Vue.set(me.checkeds, 0, data)
                }
              }
            })
          }
          else if (colConf.type === 'expand'){
            // 是否展开状态
            var isExpand = inArray(data, me.expandRows)
  
            $cellChild = hx('div.au-table-expand-icon', {
              'class': {
                'active': isExpand
              },
              on: {
                'click': function (){
                  if (isExpand){
                    var idx = me.expandRows.indexOf(data)
                    me.expandRows.splice(idx, 1)
                  }
                  else {
                    me.expandRows.push(data)
                  }
                }
              }
            })
            .push(
              hx('au-icon', {
                props: {
                  icon: 'caret-right'
                },
              })
            )
          }
          else {
            if (scopedSlot){
              $cellChild = scopedSlot({data, index})
            }
          }
  
          return hx(colConf.highlight ? 'th' : 'td')
          .push(
            hx('div.au-table-cell', {}, [$cellChild])
          )
        })
  
        var $tr = hx('tr', {
          'class': {
            'au-table-row-hover':  me.mouseCurrIdx === index
          },
          on: {
            mouseenter: function (){
              me.mouseCurrIdx = index
            },
            mouseleave: function (){
              me.mouseCurrIdx = -1
            }
          }
        }).push($tds)
        $trs.push($tr)
  
        // 如果扩展行，增加扩展行
        if (expandScopedSlot){
          var $expandTr = hx('tr')
          .push(
            hx('td.au-table-expand-td', {
              style: {
                display: inArray(data, me.expandRows) ? 'table-cell' : 'none'
              },
              attrs: {
                colspan: this.columnsConf.length
              }
            })
            .push(
              hx('div.au-table-cell',{}, [expandScopedSlot({data, index})])
            )
          )
  
          $trs.push($expandTr)
        }
      })
  
      return {ths: $ths, trs: $trs}
    },

    _calScroll: function (){
      // 监听滚动
      var $$scroll = this._getEle('.au-table-scroll')
      var $$headInner = this._getEle('.au-table-head-inner')
      var $$fixedLeft = this._getEle('.au-table-fixed-left-body')
      var $$fixedRight = this._getEle('.au-table-fixed-right-body')

      var $$currDom = null
      var $$domArr = [$$scroll, $$fixedLeft, $$fixedRight]

      $$domArr.forEach($$dom=>{
        if (!$$dom){
          return
        }

        $$dom.addEventListener('scroll', _=>{
          $$currDom = $$dom

          if ($$headInner && ($$dom === $$scroll) ){
            $$headInner.scrollLeft = $$scroll.scrollLeft
          }
        })
      })

      // 使用定时器同步滚动
      setInterval(_=>{
        if (!$$currDom){
          return
        }
        $$domArr.forEach($$dom=>{
          if (!$$dom){
            return
          }
          $$dom.scrollTop = $$currDom.scrollTop
        })
      })
    },

    // 计算各种偏移
    _calOffset: function (){
      if (!this.data.length){
        return
      }

      // 根据头部高度，计算fixed left right body的向上偏移
      if (this.showHeader){
        var $$headTop = this._getEle('.au-table-head-top')
        var height = $$headTop.getBoundingClientRect().height
        var $$fixedLeftBody = this._getEle('.au-table-fixed-left-body')
        var $$fixedRightBody = this._getEle('.au-table-fixed-right-body')

        if ($$fixedLeftBody){
          $$fixedLeftBody.style.top = height + 'px'
        }
        if ($$fixedRightBody){
          $$fixedRightBody.style.top = height + 'px'
        }
      }

      // 因为纵向滚动条引发的偏移
      if (this.maxHeight){
        var $$tableScroll = this._getEle('.au-table-scroll')
        var isYScroll = $$tableScroll.scrollHeight > $$tableScroll.clientHeight

        var $$fixedRight = this._getEle('.au-table-fixed-right')
  
        if ($$headTop){
          $$headTop.style.paddingRight = isYScroll ? (SCROLL_WIDTH + 'px') : 0
        }
  
        if ($$fixedRight){
          $$fixedRight.querySelector('.au-table-head-inner').style.paddingRight = isYScroll ? (SCROLL_WIDTH + 'px') : 0
          
          // 如果有滚动条，那么fixed right宽度要加SCROLL_WIDTH
          var rightWidth = this._getFixedRightWidth()
          if (isYScroll){
            rightWidth += SCROLL_WIDTH
          }

          $$fixedRight.style.width = rightWidth + 'px'
        }
      }
    },

    _getEle: function (selector){
      if (!this.$el){
        return null
      }
      return this.$el.querySelector(selector)
    }
  },
  mounted: function (){
    var me = this

    this._getColumnsConf()

    this.$nextTick(_=>{
      this._calScroll()
    })
    
    // 定时器监听表格高度变化，判断是否显示纵向滚动条，用来设置头部偏移、fixed-right偏移
    setInterval(_=>{
      this._calOffset()
    })
  },
  render: function (h){
    console.log('table render')
    var me = this

    // this.renderTime

    // 每次重绘时候获取
    SCROLL_WIDTH = getScrollWidth()

    // colgroup
    var $colgroup = this._getColgroup()

    var $table = hx('div.au-table', {
      'class': {
        'au-table-bordered': this.bordered ? true : false
      }
    })
    // au-table-head
    .push(
      me._getTHead($colgroup, true)
    )
    // au-table-scroll
    .push(
      hx('div.au-table-scroll', {
        style: {
          'max-height': me.maxHeight ? (me.maxHeight + 'px') : 'none'
        }
      })
      .push(
        me._getTBody($colgroup)
      )
    )
    .push(
      me.$slots.default
    )

    // 如果有数据再检查是否有fixed列
    if (this.data.length > 0){
      $table
      .push(
        me._getTFixedLeft($colgroup)
      )
      .push(
        me._getTFixedRight($colgroup)
      )
    }

    // 是否显示loading
    if (this.loading){
      $table.push(
        hx('div.au-table-loading', {}, [h('div'), h('div'), h('div'), h('div'), h('div')])
      )
    }

    return $table.resolve(h)
  }
})

Vue.component('au-table-column', AuTableColumn)
Vue.component('au-table', AuTable)