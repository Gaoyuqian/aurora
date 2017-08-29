import {hx, inArray, idxArray} from '../../utils/_tools.js'
import instance from '../../utils/_instance.js'

var getParent = instance.getParent

var AuTransferItem = Vue.extend({
  props: {
    checkeds: {
      type: Array,
      default: function (){
        return []
      }
    },
    data: {
      type: Array,
      default: function (){
        return []
      }
    },
    dir: String
  },
  computed: {
    transfer: function (){
      return getParent(this, AuTransfer)
    },
    dataKey: function (){
      return this.transfer.dataKey
    }
  },
  methods: {
    getAllCheckedStatus: function (){
      var status = -1 // -1没有选中，0有部分选中，1全部选中，2除了disabled全部选中
      var disabledNum = 0

      this.data.forEach(_=>{
        if (_['disabled']){
          disabledNum ++
        }
      })

      if (this.checkeds.length === 0){
        return -1
      }

      if (this.checkeds.length > 0 && this.checkeds.length === this.data.length){
        return 1
      }

      if (this.checkeds.length + disabledNum === this.data.length){
        return 2
      }

      return 0

    }
  },
  render: function (h){
    console.log('transferItem render')
    var me = this

    var allCheckedStatus = this.getAllCheckedStatus()

    // get items
    var $items = this.data.map(data=>{
      return hx('div.au-transfer-panel__item')
        .push(
          hx('au-checkbox', {
            props:{
              'label': me.transfer.renderFunc ? me.transfer.renderFunc(data) : data.label, 
              checkedValue: inArray(data[this.dataKey], this.checkeds),
              disabled: data.disabled ? true : false
            },
            on: {
              input: function (value){
                me.transfer.updateLeftRightCheckeds(me.dir, data[me.dataKey], value)
              }
            }
          })
          .resolve(h)
        )
        .resolve(h)
    })

    return hx('div.au-transfer-panel')
    .push(
      hx('div.au-transfer-panel__header', {
        domProps: {
          'innerHTML': this.dir === 'left' ? this.transfer.buttonTexts[0] : this.transfer.buttonTexts[1]
        }
      })
      .resolve(h)
    )
    .push(
      hx('div.au-transfer-panel__body')
      .push(
        hx('div.au-transfer-panel__list')
        .push(
          $items
        )
        .push(
          hx('p.au-transfer-panel__empty', {
            style: {
              display: $items.length === 0 ? 'block': 'none'
            }
          }, ['无数据'])
          .resolve(h)
        )
        .resolve(h)
      )
      .resolve(h)
    )
    .push(
      hx('div.au-transfer-panel__footer')
      .push(
        hx('au-checkbox', {
          props:{
            label: `${me.checkeds.length}/${me.data.length}`,
            checkedValue: allCheckedStatus === 1,
            indeterminate: allCheckedStatus === 0 || allCheckedStatus === 2
          },
          on: {
            input: function (value){
              console.log(allCheckedStatus)
              if (allCheckedStatus === 2){
                value = false
              }
              me.transfer.updateLeftRightAllCheckeds(me.dir, value)
            }
          }
        })
        .resolve(h)
      )
      .resolve(h)
    )
    .resolve(h)
  }
})

export default AuTransfer = Vue.extend({
  model: {
    prop: 'checkeds',
    event: 'change'
  },
  props: {
    checkeds: {
      type: Array,
      default: function (){
        return []
      }
    },
    data: {
      type: Array,
      default: function (){
        return []
      }
    },
    leftDefaultCheckeds: {
      type: Array,
      default: function (){
        return []
      }
    },
    rightDefaultCheckeds: {
      type: Array,
      default: function (){
        return []
      }
    },
    dataKey: {
      type: String,
      default: 'id'
    },
    buttonTexts: {
      type: Array,
      default: function (){
        return ['Source', 'Target']
      }
    },
    renderFunc: Function
  },
  data: function (){
    return {
      leftCheckeds: [],
      rightCheckeds: [],
    }
  },
  created: function (){
    this.addLeftDefaultCheckeds()
    this.addRightDefaultCheckeds()
  },
  watch: {
    leftDefaultCheckeds: function (){
      this.addLeftDefaultCheckeds()
    },
    rightDefaultCheckeds: function (){
      this.addRightDefaultCheckeds()
    }
  },
  methods: {
    addLeftDefaultCheckeds: function (){
      this.leftCheckeds.push(...this.leftDefaultCheckeds)
    },
    addRightDefaultCheckeds: function (){
      this.rightCheckeds.push(...this.rightDefaultCheckeds)
    },
    getLeftRightItems: function (){
      var data = [...this.data]
      var left = []
      var right = []

      data.forEach(_=>{
        if (inArray(_[this.dataKey], this.checkeds)){
          right.push(_)
        }
        else {
          left.push(_)
        }
      })

      return [left, right]
    },
    updateLeftRightCheckeds: function (dir, key, isChecked){
      var leftRightCheckeds = dir === 'left' ? this.leftCheckeds : this.rightCheckeds
      var idx = leftRightCheckeds.indexOf(key)

      if (isChecked){
        if (idx === -1){
          leftRightCheckeds.push(key)
        }
      }
      else {
        if (idx !== -1){
          leftRightCheckeds.splice(idx, 1)
        }
      }
    },
    updateLeftRightAllCheckeds: function (dir, isChecked){
      var isLeft = dir === 'left'
      var [leftItems, rightItems] = this.getLeftRightItems()
      var leftRightItems = isLeft ? leftItems : rightItems

      var checkeds = []

      if (isChecked){
        leftRightItems.forEach(_=>{
          if (!_.disabled){
            checkeds.push(_[this.dataKey])
          }
        })
      }

      this[isLeft ? 'leftCheckeds' : 'rightCheckeds'] = checkeds
    },
    updateLeftRightItems: function (dir){
      var me = this

      var checkeds = [...this.checkeds]

      if (dir === 'left'){
        this.rightCheckeds.forEach(_=>{
          var idx = checkeds.indexOf(_)
          if (idx !== -1){
            checkeds.splice(idx, 1)
          }
        })
        this.rightCheckeds = []
      }
      else {
        checkeds.push(...this.leftCheckeds)
        this.leftCheckeds = []
      }

      this.$emit('change', checkeds)
    },

    clearLeftCheckeds: function (){
      this.leftCheckeds = []
    },
    clearRightCheckeds: function (){
      this.rightCheckeds = []
    }
      
  },
  render: function (h){
    console.log('transfer render')
    var me = this

    var [leftItems, rightItems] = this.getLeftRightItems()

    return hx('div.au-transfer')
    .push(
      hx('au-flex', {props:{gutter:10,alignItems:''}})

      // left transfer item
      .push(
        hx('au-item', {props:{span:10}})
        .push(
          hx('au-transfer-item', {
            props:{data:leftItems, checkeds:this.leftCheckeds, dir:'left'}}
          )
          .resolve(h)
        )
        .resolve(h)
      )

      // buttons
      .push(
        hx('au-item', {props:{span:4}})
        .push(
          hx('div.au-transfer__buttons')
          .push(
            hx('au-button', {
              props:{
                icon: 'chevron-left',
                type: me.rightCheckeds.length === 0 ? 'default' : 'primay', 
                block: true, 
                disabled: me.rightCheckeds.length === 0
              },
              on: {
                click: function (){
                  me.updateLeftRightItems('left')
                }
              }
            }, ['向左'])
            .resolve(h)
          )
          .push(
            hx('au-button', {
              props:{
                icon: 'chevron-right',
                type: me.leftCheckeds.length === 0 ? 'default' : 'primay', 
                block: true,
                disabled: me.leftCheckeds.length === 0
              },
              on: {
                click: function (){
                  me.updateLeftRightItems('right')
                }
              }
            }, ['向右'])
            .resolve(h)
          )
          .resolve(h)
        )
        .resolve(h)
      )

      // right transfer item
      .push(
        hx('au-item', {props:{span:10}})
        .push(
          hx('au-transfer-item', {
            props:{data:rightItems, checkeds:this.rightCheckeds, dir:'right'}}
          )
          .resolve(h)
        )
        .resolve(h)
      )

      .resolve(h)
    )
    .resolve(h)
  }
})

Vue.component('au-transfer-item', AuTransferItem)
Vue.component('au-transfer', AuTransfer)