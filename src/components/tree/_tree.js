import dispatch from '../../mixins/_dispatch.js'
import {isArray, hasChildren} from '../../utils/_tools.js'

export default AuTree = Vue.extend({
  model: {
    prop: 'checks',
    event: 'change'
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    checkable: {
      type: Boolean,
      default: false
    },
    // checks: {
    //   type: Array,
    //   default: []
    // },
     defaultCheckeds: {
      type: Array,
      default: []
    },
    defaultCheckedKeys: {
      type: Array,
      default: []
    },
    expands: {
      type: Array,
      default: []
    },
    defaultExpandAll: {
      tpye: Boolean,
      default: false
    },
    loader: {
      type: Function
    },
    clickRowExpand: {
      type: Boolean,
      default: true
    }
  },
  data: function (){
    return {
      checks: []
    }
  },
  computed: {
    children: function (){
      return this.$children
    }
  },
  mounted: function (){
    this.setExpands()
    this.addDefaultChecks()
    this.addDefaultCheckedKeys()
  },
  watch: {
    expands: function (){
      this.setExpands()
    },
    defaultCheckeds: function (){
      this.addDefaultChecks()
    },
    defaultCheckedKeys: function (){
      this.addDefaultCheckedKeys()
    }
  },
  methods: {
    addDefaultChecks: function (){
      //console.warn(`Aurora au-tree: 'default-checks' is not recommended, use 'checks' instead of`)
      this.commitChecks(this.defaultCheckeds)
    },

    addDefaultCheckedKeys: function (){
      if (!isArray(this.defaultCheckedKeys)){
        return 
      }

      var commits = []
      this.data.forEach(data=>{
        var deepestChildren = this.getDeepestChildren(data)
        deepestChildren.forEach(child=>{
          if (this.isInDefaultCheckedKeys(child)){
            commits.push(child)
          }
        })
      })

      this.commitChecks(commits)
    },

    // 批量添加checks
    commitChecks: function (commits){
      if (commits.length === 0){
        return
      }

      var checks = this.checks.slice()
      checks.push(...commits)
      this.checks = this.cleanChecks(checks)
      // this.$emit('change', this.cleanChecks(checks))
    },

    isInDefaultCheckedKeys: function (data){
      return this.defaultCheckedKeys.indexOf(data['id']) != -1
    },

    setExpands: function (){
      var me = this

      var getNodes = function ($nodes){
        $nodes.forEach($node=>{
          $node.isExpand = me.defaultExpandAll || me.getIsExpand($node.data)
          if (hasChildren($node)){
            getNodes($node.children)
          }
        })
      }
      getNodes(this.children)
    },

    // 得到此节点的子节点选中情况
    getChildrenStatus: function (data){
      var datas = this.getDeepestChildren(data)
      var status = -1 // -1表示没有任何选中，0表示有选中，1表示所有都选中，2表示除了disabled之外都选中
      var checkedSum = 0
      var disabledSum = 0

      datas.forEach(data=>{
        if (data.disabled){
          disabledSum ++
        }
        if (this.checks.indexOf(data) !== -1){
          checkedSum ++
        }
      })

      if (checkedSum > 0){
        status = 0
        if (checkedSum === datas.length){
          status = 1
        }
        else if (checkedSum + disabledSum === datas.length){
          status = 2
        }
      }

      return status
    },

    // 得到此节点下的所有最深子节点
    getDeepestChildren: function (data){
      var datas = []

      function getChildren(data){
        if (!hasChildren(data)){
          datas.push(data)
        }
        else {
          data.children.forEach(childData=>{
            getChildren(childData)
          })
        }
      }
      getChildren(data)
      
      return datas
    },

    // 得到此节点的expand情况
    getIsExpand: function (data){
      var me = this
      var isExpand = false

      function searchData(data){
        if (me.expands.indexOf(data) !== -1){
          isExpand = true
          return
        }

        if (hasChildren(data)){
          data.children.forEach(childData=>{
            searchData(childData)
          })
        }
      }
      searchData(data)

      return isExpand
    },

    // 根据node change event 更新 checks
    emitNodeChange: function ($node, isChecked){
      var commitDatas = []

      function getData(data){
        if (!hasChildren(data)){
          if (!data.disabled){
            commitDatas.push(data)
          }
        }
        else {
          data.children.forEach(childData=>{
            getData(childData)
          })
        }
      }
      getData($node.data)
      this.updateChecks(commitDatas, isChecked)
    },
    updateChecks: function (datas, isChecked){
      var checks = this.checks.slice()

      datas.forEach(data=>{
        var dataIdx = -1
        for (var i=0; i<checks.length; i++){
          if (data === checks[i]){
            dataIdx = i
            break
          }
        }

        if (isChecked === true){
          if (dataIdx === -1){
            checks.push(data)
          }
        }
        else {
          if (dataIdx !== -1){
            checks.splice(dataIdx, 1)
          }
        }
      })
      this.checks = this.cleanChecks(checks)
      // this.$emit('change', this.cleanChecks(checks))
    },

    // 去掉所有不是子节点的节点
    cleanChecks: function (checks){
      return checks.filter(c=>{
        return !hasChildren(c)
      })
    },

    createNodes: function (h, nodesData){
      return nodesData.map((nodeData)=>{
        var $childrenNode = []

        if (hasChildren(nodeData)){
          isIndeterminate = true
          $childrenNode = this.createNodes(h, nodeData.children)
        }

        var status = this.getChildrenStatus(nodeData)

        var $node = h('au-tree-node', {
          props: {
            data: nodeData,
            checkable: this.checkable,
            isChecked: status === 1 ? true : false,
            isIndeterminate: hasChildren(nodeData) && (status != -1)
          }
        }, $childrenNode)

        return $node
      })
    }
  },
  render: function (h){
    console.log('tree render')
    return h('div', {
      'class': {
        'au-tree': true
      }
    }, this.createNodes(h, this.data))
  }
})

Vue.component('au-tree', AuTree)
