import AuMessage from './_message.js'
const AuMessageCenter = Vue.extend({
  template: require('./_message-center.jade'),
  components: {
    AuMessage
  },
  mounted () {
    document.body.appendChild(this.$el)
  },
  data () {
    return {
      messages: []
    }
  },
  computed: {
    classObject () { }
  },
  methods: {
    createMessage (data) {
      if (!data.title) {
        delete data.title
      }
      const message = new AuMessage({
        data
      })
      message.$mount(document.createElement('div'))
      message.$parent = this
      this.$el.appendChild(message.$el)

      return message
    },
    push (data) {
      const message = this.createMessage(data)

      if (data.type === 'loading') {
        return function() {
          message.disappear()
        }
      } else {
        this.messages.push(message)

        if (this.messages.length > 3) {
          this.messages[0].disappear()
        }
      }
    },
    disappearHandler (message) {
      const pos = this.messages.indexOf(message)
      if (pos > -1) {
        this.messages.splice(pos, 1)
      }
    }
  }
})

export default AuMessageCenter

var messageCenter

export function push (type, title, message, options) {
  if (message == null || typeof message !== 'string') {
    options = message
    message = title
    title = ''
  }

  if (messageCenter == null) {
    messageCenter = (new AuMessageCenter()).$mount(document.createElement('div'))
  }

  return messageCenter.push({
    type, title, message, options
  })
}
