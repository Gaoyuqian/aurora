export default {
  getScrollElem (elem) {
    var style
    while (elem = elem.parentElement) {
      style = window.getComputedStyle(elem)
      if (style.overflowY === 'auto'
          || style.overflowX === 'auto'
          || style.overflow === 'auto') {
        return elem
      }
    }
    return null
  },

  getOffset (elem) {
    const result = {
      top: 0,
      left: 0
    }
    do {
      result.top += elem.offsetTop
      result.left += elem.offsetLeft
    } while (elem = elem.offsetParent)
    return result
  }
}
