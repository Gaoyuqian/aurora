import instance from '../../utils/_instance.js'
import {isArray, hasChildren} from '../../utils/_tools.js'

var getParent = instance.getParent

export default AuTreeNode = Vue.extend({
  props: {
    data: {
      type: Object
    },
    checkable: {
      type: Boolean,
      default: false
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    isIndeterminate: {
      type: Boolean,
      default: false
    }
  },
  data: function (){
    return {
      isExpand: false,
      loadStatus: -1, // -1未请求，0请求中，1请求结束
    }
  },
  computed: {
    tree: function (){
      return getParent(this, AuTree)
    },
    hasChildren: function (){
      return hasChildren(this.data)
    },
    hasExpend: function (){
      return this.hasChildren
    },
    nodeParent: function (){
      return getParent(this, AuTreeNode)
    },
    children: function (){
      if (!this.hasChildren){
        return false
      }

      return this.$children.filter($node=>{
        if ($node instanceof AuTreeNode){
          return $node
        }
      })
    }
  },
  methods: {
    clickExpand: function (){
      var me = this

      if (me.hasChildren){
        me.isExpand = !me.isExpand
      }
      else {
        if ((me.loadStatus === -1) && me.tree.loader){
          me.loadStatus = 0
          me.tree.loader(me.data, ()=>{
            me.loadStatus = 1
            me.isExpand = true

            if (isArray(me.data.children)){
              var children = me.data.children
              // Vue.set(me.data, 'children', children)

              var commits = []
              
              // 如果此节点选中状态，则强制触发选中事件
              if (me.isChecked){
                commits = children
              }
              // 否则查一下children有没有和defaultCheckedKeys 匹配的
              else {
                children.forEach(child=>{
                  if (me.tree.isInDefaultCheckedKeys(child)){
                    commits.push(child)
                  }
                })
              }
              me.tree.commitChecks(commits)
            }

          })
        }
      }
    }
  },
  render: function (h){
    console.log('tree node render')
    var me = this
    var treeSS = this.tree.$scopedSlots.default

    var $treeItemContentInner = h('div', [
        treeSS ? treeSS({data:this.data}) : this.data.label
      ]
    )
    var $treeItemContent = h('div', {'class':{'au-tree-item-content':true}}, [$treeItemContentInner])

    //if checkable
    var $checkbox = null
    if (this.checkable){
      $checkbox = h('div', {
        'class': {
          'au-tree-checkbox': true
        }
      }, [h('au-checkbox', {
        props: {
          checkedValue: this.isChecked,
          indeterminate: this.isIndeterminate,
          disabled: me.data.disabled ? true : false
        },
        on: {
          input: function (value){
            // 有个特殊情况，除了disabled的节点，全部选中，那么处于indeterminate的节点的value会一直保持false导致value一直未true
            if (me.tree.getChildrenStatus(me.data) === 2){
              value = false
            }

            me.tree.$emit('check', me.data, value, me)
            me.tree.emitNodeChange(me, value)
          }
        }
      })])
    }

    // expand
    var $expandChildren = []
    if (me.hasExpend || (me.tree.loader && me.loadStatus === -1)){
      $expandChildren.push(
        h('au-icon', {props:{'icon':'caret-right'}})
      )
    }

    if (me.loadStatus === 0){
      $expandChildren.push(
        h('au-icon', {props:{'icon':'spinner', 'autorotate':true}})
      )
    }

    var $expand = h('div', {
      'class': {
        'au-tree-item-expand': true, 
        'au-tree-item-expanded': this.isExpand
      },
      on: {
        click: function ($event){
          me.clickExpand()
        }
      }
    }, $expandChildren)

    var $treeItem = h('div', {
      'class': {
        'au-tree-item':true
      },
      on: {
        click: function ($event){
          // 如果事件源是checkbox 或者 expand, 则忽略
          var $$target = $event.target
          var className = $$target.className

          var isStop = (className.indexOf('au-checkbox') !== -1) ||
                       ($$target.className.indexOf('au-tree-item') !== -1) ||
                       ($$target.className.indexOf('icon') !== -1)

          if (isStop){
            return
          }

          if (me.tree.clickRowExpand){
            me.clickExpand()
          }
        }
      }
    }, [
      $expand,
      $checkbox,
      $treeItemContent
    ])

    //if children
    var $children = null
    if (this.hasChildren){
      $children = h('div', {
        'class': {
          'au-tree-children': true
        },
        style: {
          display: this.isExpand ? 'block' : 'none'
        },
      }, [this.$slots.default])
    }
    var $treeNode = h('div', {'class':{'au-tree-node':true}}, [$treeItem, $children])

    return $treeNode
  }
})

Vue.component('au-tree-node', AuTreeNode)
