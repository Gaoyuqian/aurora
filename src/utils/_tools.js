function isArray (o){
  return Object.prototype.toString.call(o) === '[object Array]'
}

function hasChildren(obj){
  return isArray(obj.children) && obj.children.length > 0
}

function inArray(obj, objList){
  return objList.indexOf(obj) !== -1
}

function idxArray(val, key, objList){
  for (var i=0; i<objList.length; i++){
    if (objList[i][key] === val){
      return i
    }
  }
  return -1
}


// 简化createElement嵌套写法
class VVNode{
  constructor(tag, props={}, children = []){
    this.tag = tag
    this.props = props
    this.children = children
  }
  push(vnode) {
    if (isArray(vnode)){
      this.children.push(...vnode)
    }
    else {
      if (vnode){
        this.children.push(vnode)
      }
    }
    
    return this
  }
  resolve(h) {
    var children = this.children.map(child=>{
      if (child instanceof VVNode){
        return child.resolve(h)
      }
      else {
        return child
      }
    })
    return h(this.tag, this.props, children)
  }
}
function hx(tag, props={}, children=[]){
  if (tag.indexOf('.') !== -1){
    var [realTag, className] = tag.split('.')
    tag = realTag

    if (className !== ''){
      var classList = className.split('+')

      if (!props['class']){
        props['class'] = {}
      }
      
      classList.forEach(_=>{
        props['class'][_.trim()] = true
      })
    }
  }

  return new VVNode(tag, props, children)
}

export {
  isArray,
  hasChildren,
  hx,
  inArray,
  idxArray
}