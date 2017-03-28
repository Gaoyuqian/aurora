export default {
  getParent(instance, Ctor) {
    while (instance = instance.$parent) {
      if (instance instanceof Ctor) {
        return instance
      }
    }

    return null
  }
}
