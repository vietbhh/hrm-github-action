import { isFunction } from "lodash-es"
import NodeCache from "node-cache"
const ttlSeconds = 60 * 60 * 1 // cache for 1 hour
const cache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
})
const getCache = (key, storeFunction = null) => {
  const value = cache.get(key)
  if (value) {
    return value
  }
  if (isFunction(storeFunction)) {
    storeFunction()
  }
}

const setCache = (key, value) => {
  return cache.set(key, value, ttlSeconds)
}

const delCache = (keys) => {
  cache.del(keys)
}

const delStartWith = (startStr = "") => {
  if (!startStr) {
    return
  }

  const keys = cache.keys()
  for (const key of keys) {
    if (key.indexOf(startStr) === 0) {
      delCache(key)
    }
  }
}

const flushCache = () => {
  cache.flushAll()
}

export { getCache, setCache, delCache, delStartWith, flushCache }
