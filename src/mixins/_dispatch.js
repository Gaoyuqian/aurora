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
    broadcast (...args) {
      this.$children.forEach((child) => {
        if (child != null) {
          child.$emit(event, params)
          this.broadcast.apply(child, args)
        }
      })
    }
  }
}
