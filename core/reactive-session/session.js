/**
 * @NOTE 获取默认的操作函数 localStorage/sessionStorage
 * @param { Object } sessionOps
 *  @param { String } sessionOps.sessionType
 * @returns
 */
const getSessionFunc = (sessionOps) => {
  const { sessionType = 'localStorage' } = sessionOps

  return window[sessionType]
}

const getTime = () => {
  return new Date().getTime()
}

/**
 * @NOTE 从Session中转换成规定结构
 *
 * * true ===> { data: true, timestamp: 1888288388382 }
 * * { name: "shadow", age: 20 } ===> { data: { name: "shadow", age: 20 }, timestamp: 1888288388123 }
 * * { data: true, timestamp: 18881238888 } ====> { data: true, timestamp: 18881238888 }
 *
 */
const getSessionBody = (sessionStore) => {
  let _store = {
    data: sessionStore,
    timestamp: getTime(),
  }

  if (
    typeof sessionStore === 'object' &&
    Reflect.has(sessionStore, 'timestamp')
  ) {
    _store = sessionStore
  }

  return _store
}

const setSessionBody = (sessionStore) => {
  const data = Reflect.has(sessionStore, 'data')
    ? sessionStore.data
    : sessionStore
  let _store = {
    data,
    timestamp: getTime(),
  }

  return _store
}

export default class sessionBase {
  constructor(sessionKey, sessionStore, sessionOps = {}) {
    Object.assign(this, {
      sessionKey,
      sessionStore,
      sessionOps,
    })

    this.getSessionStore = this.getSessionStore.bind(this)

    const sessionFunc = getSessionFunc(sessionOps)
    this.sessionFunc = sessionFunc

    const _store = this.getSessionStore(sessionKey, sessionOps)
    this._store = _store
  }

  getSessionStore(sessionKey) {
    try {
      let store = this.sessionFunc.getItem(sessionKey)
      store = JSON.parse(store || '{}')

      let _store = getSessionBody(store)

      if (!Reflect.has(_store, 'expires')) {
        _store.expires = this.expires
      }
      {
        const expiresStatus = this.checkSessionExpires(store)

        if (!expiresStatus) {
          console.log('=======> [sesion.get.expires]: 缓存已过期')
        }
      }

      return _store
    } catch (error) {
      throw new Error(`[session.expires.set]: ${error}`)
    }
  }

  setSessionStore(sessionKey, updateValue) {
    try {
      const _store = setSessionBody(updateValue)
      Object.assign(_store, { expires: this.expires })
      const store = JSON.stringify(_store)

      this.sessionFunc.setItem(sessionKey, store)
      const status = this.checkSessionUpdateStatus(_store)
      return Promise.resolve(status)
    } catch (error) {
      throw new Error(`[session.set]: ${error}`)
    }
  }

  checkSessionUpdateStatus(originValue) {
    const targetValue = this.getSessionStore(this.sessionKey)
    return originValue.timestamp === targetValue.timestamp
  }

  checkSessionExpires(sessionStore) {
    return sessionStore.timestamp <= sessionStore.expires
  }
}
