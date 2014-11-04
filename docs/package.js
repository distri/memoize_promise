(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "memoize_promise\n===============\n\nMemoize promises, auto-invalidating on rejected ones.\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Memoize Promise\n===============\n\n    module.exports = (fn) ->\n      cache = {}\n\n      memoized = (key) ->\n        unless cache[key]\n          cache[key] = fn.apply(this, arguments)\n\n          cache[key].fail ->\n            delete cache[key]\n\n        return cache[key]\n\n        return memoized\n",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://cdnjs.cloudflare.com/ajax/libs/q.js/1.0.1/q.min.js\" # Just for testing\n]\n",
      "mode": "100644"
    },
    "test/test.coffee": {
      "path": "test/test.coffee",
      "content": "MemoizePromise = require \"../main\"\n\nReplay = (values) ->\n  index = -1\n\n  fn = ->\n    index += 1\n\n    return values[index]\n\ndescribe \"MemoizePromise\", ->\n  it \"should memoize promises\", (done) ->\n    called = 0\n\n    fn = MemoizePromise (v) ->\n      deferred = Q.defer()\n      \n      called += 1\n\n      deferred.resolve(v)\n\n      return deferred.promise\n\n    resolved = 0\n    \n    handler = (v) ->\n      assert.equal v, \"a\"\n      assert.equal called, 1\n      resolved += 1\n      if resolved == 2\n        done()\n\n    fn(\"a\").then handler\n    fn(\"a\").then handler\n\n  it \"should void cache on failure\", (done) ->\n    called = 0\n\n    fn = MemoizePromise (v) ->\n      deferred = Q.defer()\n\n      called += 1\n\n      deferred.reject(v)\n\n      return deferred.promise\n\n    rejected = 0\n    calledReplay = Replay [1, 2, 3]\n\n    handler = (v) ->\n      assert.equal v, \"a\"\n      assert.equal called, calledReplay()\n      rejected += 1\n      if rejected == 3\n        done()\n\n    fn(\"a\").then ->\n      assert false\n    , handler\n    .done()\n\n    setTimeout ->\n      fn(\"a\").then ->\n        assert false\n      , handler\n      .done()\n\n      setTimeout ->\n        fn(\"a\").then ->\n          assert false\n        , handler\n        .done()\n\n  it \"should cache after a failure\", (done) ->\n    called = 0\n\n    fn = MemoizePromise (v) ->\n      deferred = Q.defer()\n\n      called += 1\n\n      if called == 2\n        deferred.resolve(v)\n      else\n        deferred.reject(v)\n\n      return deferred.promise\n\n    completed = 0\n    calledReplay = Replay [1, 2, 2]\n\n    handler = (v) ->\n      assert.equal v, \"a\"\n      assert.equal called, calledReplay()\n      completed += 1\n      if completed == 3\n        done()\n\n    fn(\"a\").then ->\n      assert false\n    , handler\n    .done()\n\n    setTimeout ->\n      fn(\"a\").then(handler, -> assert false)\n      .done()\n\n      setTimeout ->\n        fn(\"a\").then(handler, -> assert false)\n        .done()\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  module.exports = function(fn) {\n    var cache, memoized;\n    cache = {};\n    return memoized = function(key) {\n      if (!cache[key]) {\n        cache[key] = fn.apply(this, arguments);\n        cache[key].fail(function() {\n          return delete cache[key];\n        });\n      }\n      return cache[key];\n      return memoized;\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\",\"remoteDependencies\":[\"https://cdnjs.cloudflare.com/ajax/libs/q.js/1.0.1/q.min.js\"]};",
      "type": "blob"
    },
    "test/test": {
      "path": "test/test",
      "content": "(function() {\n  var MemoizePromise, Replay;\n\n  MemoizePromise = require(\"../main\");\n\n  Replay = function(values) {\n    var fn, index;\n    index = -1;\n    return fn = function() {\n      index += 1;\n      return values[index];\n    };\n  };\n\n  describe(\"MemoizePromise\", function() {\n    it(\"should memoize promises\", function(done) {\n      var called, fn, handler, resolved;\n      called = 0;\n      fn = MemoizePromise(function(v) {\n        var deferred;\n        deferred = Q.defer();\n        called += 1;\n        deferred.resolve(v);\n        return deferred.promise;\n      });\n      resolved = 0;\n      handler = function(v) {\n        assert.equal(v, \"a\");\n        assert.equal(called, 1);\n        resolved += 1;\n        if (resolved === 2) {\n          return done();\n        }\n      };\n      fn(\"a\").then(handler);\n      return fn(\"a\").then(handler);\n    });\n    it(\"should void cache on failure\", function(done) {\n      var called, calledReplay, fn, handler, rejected;\n      called = 0;\n      fn = MemoizePromise(function(v) {\n        var deferred;\n        deferred = Q.defer();\n        called += 1;\n        deferred.reject(v);\n        return deferred.promise;\n      });\n      rejected = 0;\n      calledReplay = Replay([1, 2, 3]);\n      handler = function(v) {\n        assert.equal(v, \"a\");\n        assert.equal(called, calledReplay());\n        rejected += 1;\n        if (rejected === 3) {\n          return done();\n        }\n      };\n      fn(\"a\").then(function() {\n        return assert(false);\n      }, handler).done();\n      return setTimeout(function() {\n        fn(\"a\").then(function() {\n          return assert(false);\n        }, handler).done();\n        return setTimeout(function() {\n          return fn(\"a\").then(function() {\n            return assert(false);\n          }, handler).done();\n        });\n      });\n    });\n    return it(\"should cache after a failure\", function(done) {\n      var called, calledReplay, completed, fn, handler;\n      called = 0;\n      fn = MemoizePromise(function(v) {\n        var deferred;\n        deferred = Q.defer();\n        called += 1;\n        if (called === 2) {\n          deferred.resolve(v);\n        } else {\n          deferred.reject(v);\n        }\n        return deferred.promise;\n      });\n      completed = 0;\n      calledReplay = Replay([1, 2, 2]);\n      handler = function(v) {\n        assert.equal(v, \"a\");\n        assert.equal(called, calledReplay());\n        completed += 1;\n        if (completed === 3) {\n          return done();\n        }\n      };\n      fn(\"a\").then(function() {\n        return assert(false);\n      }, handler).done();\n      return setTimeout(function() {\n        fn(\"a\").then(handler, function() {\n          return assert(false);\n        }).done();\n        return setTimeout(function() {\n          return fn(\"a\").then(handler, function() {\n            return assert(false);\n          }).done();\n        });\n      });\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.1.0",
  "entryPoint": "main",
  "remoteDependencies": [
    "https://cdnjs.cloudflare.com/ajax/libs/q.js/1.0.1/q.min.js"
  ],
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/memoize_promise",
    "homepage": null,
    "description": "Memoize promises, auto-invalidating on rejected ones.",
    "html_url": "https://github.com/distri/memoize_promise",
    "url": "https://api.github.com/repos/distri/memoize_promise",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});