/**
 * @NOTE 准备一个简单的响应式对象
 * @param { Object } obj
 * @param { Function } callback
 * @returns
 */
function reactive(obj, callback) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  // 创建一个 Proxy 对象来监听 obj 对象的变化
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      return reactive(res, callback) // 如果获取到的值是对象，就继续对其进行监听
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      if (callback) {
        callback({ target: 'set', key, value, target, receiver })
      }
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      if (callback) {
        callback(key, undefined, { target: 'delete', key, target })
      }
      return res
    },
  })

  return observed
}