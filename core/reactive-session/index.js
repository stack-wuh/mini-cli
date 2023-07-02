import { reactive } from "./reactive.js"
import sessionBase from './session.js'

const SESSION_CHANGE_EVENT_NAME = 'session-change'

export default class reactiveSession extends sessionBase {
  constructor (sessionKey, sessionStore, sessionOps) {
      super(sessionKey, sessionStore, sessionOps)

      const store = this.getSessionStore(sessionKey)
      const changeEventName = `${sessionKey}:${SESSION_CHANGE_EVENT_NAME}`
      const expires = getTime() + ((sessionOps.expires || 0) * 60 * 1000)

      this.expires = expires

      const reactiveValue = reactive(store, (e) => {
          const cs = new CustomEvent(changeEventName, { detail: e })
          
          this.setSessionStore(sessionKey, e.receiver).then((res) => {
            if (res) {
              window.dispatchEvent(cs)
            }
          })
      })

      this.proxy = reactiveValue
  }
}
