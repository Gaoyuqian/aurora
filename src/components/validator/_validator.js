import required from './_required.js'
import email from './_email.js'
import phone from './_phone.js'

export default class Validator {
  constructor (rules) {
    if (rules) {
      this.setRules(rules)
    }
  }

  setRules (rules) {
    this.rules = rules
    this.rules.forEach((rule) => {
      if (rule.trigger) {
        rule._trigger = rule.trigger.split(/\s*[,\s]\s*/)
      } else {
        rule._trigger = ['blur']
      }
    })
  }

  validate (trigger, value, callback) {
    var count = 0
    var result = true
    const messages = []
    this.rules.forEach((rule) => {
      if (!trigger || (!rule._trigger || rule._trigger.indexOf(trigger) > -1)) {
        count++
        const validator = this.getValidator(rule)
        validator.validate(value, (_result) => {
          count--
          if (!_result) {
            messages.push(rule.message || validator.message)
          }
          if (count === 0) {
            callback(messages)
          }
        })
      }
    })
  }

  getValidator (rule) {
    if (rule.validator) {
      return {
        message: rule.message,
        validate: rule.validator
      }
    }

    if (rule.required) {
      return required
    }

    switch (rule.type) {
      case 'email':
        return email
      case 'phone':
        return phone
      default:
        console.error('No validate matched')
        return {
          validate: (_, callback) => {
            callback(true)
          }
        }
    }
  }
}
