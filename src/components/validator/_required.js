export default {
  validate (value, callback) {
    callback(
      value != null && value !== ''
    )
  }
}
