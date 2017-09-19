import {hx, inArray, idxArray} from '../../utils/_tools.js'
import instance from '../../utils/_instance.js'

var AuTTableColumn = Vue.extend({
  props: {
    type: {
      type: String,
      default: '',          // '',checkbox,expend
    },
    label: String,
    attrName: String,
    expandRows: Array,
  },
  render: function (h){
    return h('')
  }
})

var AuTTable = Vue.extend({
  props: {
    data: {
      type: Array,
      default: function (){
        return []
      }
    }
  },
  data: function (){
    return {
      columnsConf: [],
      checkeds: [],
      expandRows: [],
    }
  },
  methods: {
    getColumnsConf: function (){
      var me = this
      this.$slots.default.forEach($slot=>{
        var componentOptions = $slot.componentOptions

        if (componentOptions && componentOptions.tag === 'au-ttable-column'){
          console.log($slot)
          var colConf = componentOptions.propsData
          colConf['instance'] = $slot.componentInstance

          me.columnsConf.push(colConf)

          if (componentOptions.propsData.type === 'checkbox'){
            me.checkeds = $slot.data.props.value
          }
          if (componentOptions.propsData.type === 'expand'){
            me.expandRows = componentOptions.propsData.expandRows
          }
        }
      })
    }
  },
  mounted: function (){
    this.getColumnsConf()
  },
  render: function (h){
    console.log('ttable render')
    var me = this
    // 扩展行所对应的scoped slot
    var expandScopedSlot = null

    var $ths = this.columnsConf.map(colConf=>{
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
      else if (colConf.type === 'expand'){
        $cellChild = null
        expandScopedSlot = colConf.instance.$scopedSlots.default
      }

      return hx('th').
      push(
        hx('div.au-table-cell', {}, [$cellChild])
      )
    })

    var $trs = []
    this.data.forEach((data, index)=>{
      var $tds = me.columnsConf.map(colConf=>{
        var $cellChild = data[colConf.attrName]
        var scopedSlot = colConf.instance.$scopedSlots.default

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
        else if (colConf.type === 'expand'){
          // 是否展开状态
          var isExpand = inArray(data, me.expandRows)

          $cellChild = hx('div.au-table-expand-icon', {
            'class': {
              'active': isExpand
            },
            on: {
              'click': function (){console.log(isExpand)
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

        return hx('td')
        .push(
          hx('div.au-table-cell', {}, [$cellChild])
        )
      })

      var $tr = hx('tr').push($tds)
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

    return hx('div.au-table')
    // au-table-head
    .push(
      hx('div.au-table-head')
      // au-table-head-inner
      .push(
        hx('div.au-table-head-inner')
        // table
        .push(
          hx('table')
          // thead
          .push(
            hx('thead')
            // ths
            .push(
              $ths
            )
          )
        )
      )
    )
    // au-table-scroll
    .push(
      hx('div.au-table-scroll')
      .push(
        hx('div.au-table-body')
        .push(
          hx('table')
          .push(
            hx('tbody')
            .push(
              $trs
            )
          )
        )
      )
    )
    .push(
      me.$slots.default
    )
    .resolve(h)
  }
})

Vue.component('au-ttable-column', AuTTableColumn)
Vue.component('au-ttable', AuTTable)