function broadcast (...args) {
  this.$children.forEach((child) => {
    if (child && child.$emit) {
      child.$emit.apply(child, args)
      broadcast.apply(child, args)
    }
  })
}

export default {
  methods: {
    dispatch (...args) {
      var $parent = this.$parent
      while ($parent != null) {
        if ($parent.$emit.apply($parent, args) !== false) {
          $parent = $parent.$parent
        }
      }
    },
    broadcast
  }
}
