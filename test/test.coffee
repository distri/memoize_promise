MemoizePromise = require "../main"

Replay = (values) ->
  index = -1

  fn = ->
    index += 1

    return values[index]

describe "MemoizePromise", ->
  it "should memoize promises", (done) ->
    called = 0

    fn = MemoizePromise (v) ->
      deferred = Q.defer()
      
      called += 1

      deferred.resolve(v)

      return deferred.promise

    resolved = 0
    
    handler = (v) ->
      assert.equal v, "a"
      assert.equal called, 1
      resolved += 1
      if resolved == 2
        done()

    fn("a").then handler
    fn("a").then handler

  it "should void cache on failure", (done) ->
    called = 0

    fn = MemoizePromise (v) ->
      deferred = Q.defer()

      called += 1

      deferred.reject(v)

      return deferred.promise

    rejected = 0
    calledReplay = Replay [1, 2, 3]

    handler = (v) ->
      assert.equal v, "a"
      assert.equal called, calledReplay()
      rejected += 1
      if rejected == 3
        done()

    fn("a").then ->
      assert false
    , handler
    .done()

    setTimeout ->
      fn("a").then ->
        assert false
      , handler
      .done()

      setTimeout ->
        fn("a").then ->
          assert false
        , handler
        .done()

  it "should cache after a failure", (done) ->
    called = 0

    fn = MemoizePromise (v) ->
      deferred = Q.defer()

      called += 1

      if called == 2
        deferred.resolve(v)
      else
        deferred.reject(v)

      return deferred.promise

    completed = 0
    calledReplay = Replay [1, 2, 2]

    handler = (v) ->
      assert.equal v, "a"
      assert.equal called, calledReplay()
      completed += 1
      if completed == 3
        done()

    fn("a").then ->
      assert false
    , handler
    .done()

    setTimeout ->
      fn("a").then(handler, -> assert false)
      .done()

      setTimeout ->
        fn("a").then(handler, -> assert false)
        .done()
