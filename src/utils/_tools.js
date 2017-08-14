function isArray (o){
  return Object.prototype.toString.call(o) === '[object Array]'
}

function hasChildren(obj){
  return isArray(obj.children) && obj.children.length > 0
}

export {
  isArray,
  hasChildren
}