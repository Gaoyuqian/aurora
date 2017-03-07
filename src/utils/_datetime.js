export default {
  getDateDisabledFunc (type, value) {
    if (!value) {
      return function () { return true }
    }
    if (typeof value === 'string') {
      if (value.match(/^\d{2}:\d{2}:\d{2}$/) != null) {
        const arr = value.split(':')
        const timeNumber = this.getTimeNumber(
          parseInt(arr[0], 10),
          parseInt(arr[1], 10),
          parseInt(arr[2], 10)
        )
        return function (date) {
          const result
          const dateTimeCount = this.getTimeNumber(
            value.getHours(),
            value.getMinutes(),
            value.getSeconds()
          )

          if (type === 'startDate') {
            return timeCount > dateTimeCount
          } else {
            return timeCount < dateTimeCount
          }
        }
      } else {
        value = new Date(value)
      }
    }

    return (date) => {
      if (type === 'startDate') {
        return this.compareDate(value, date) < 0
      } else {
        return this.compareDate(value, date) > 0
      }
    }
  },

  // compare two dates
  // if date1 > date2 return negetive number
  // if date1 == date2 return 0
  // if date1 < date2 return positive number
  compareDate (date1, date2) {
    const value1 = this.formatDateUnit(date1.getFullYear()) + this.formatDateUnit(date1.getMonth() + 1) + this.formatDateUnit(date1.getDate())
    const value2 = this.formatDateUnit(date2.getFullYear()) + this.formatDateUnit(date2.getMonth() + 1) + this.formatDateUnit(date2.getDate())

    value1 = parseInt(value1, 10)
    value2 = parseInt(value2, 10)

    return value2 - value1
  },

  formatDateUnit (value) {
    value = String(value)
    if (value.length < 2) {
      value = '0' + value
    }
    return value
  },

  getTimeNumber (hour, minute, second) {
    return hour * 60 * 60 + minute * 60 + second
  },
  getIsDisabledDate (date, funcs) {
    const result = false
    funcs.some((fun) => {
      if (result = fun(date)) {
        return true
      }
    })
    return result
  },

  getIsDisabledFuncByComponent (component) {
    const funcs = []

    if (component.disabledDate) {
      funcs.push(component.disabledDate)
    }

    if (component.startDate) {
      funcs.push(this.getDateDisabledFunc('startDate', component.startDate))
    }

    if (component.endDate) {
      funcs.push(this.getDateDisabledFunc('endDate', component.endDate))
    }

    if (funcs.length === 0) {
      return function () { return false }
    }

    return (date) => {
      return this.getIsDisabledDate(date, funcs)
    }
  }
}
