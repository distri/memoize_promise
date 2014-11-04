Memoize Promise
===============

    module.exports = (fn) ->
      cache = {}

      memoized = (key) ->
        unless cache[key]
          cache[key] = fn.apply(this, arguments)

          cache[key].fail ->
            delete cache[key]

        return cache[key]

        return memoized
