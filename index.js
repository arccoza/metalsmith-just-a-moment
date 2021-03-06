var moment = require('moment');
var match = require('multimatch');


module.exports = exports = function(options){
  var visited = new Map();
  var defaults = {
    pattern: ['**/*.md'],
    scanFiles: true,
    scanMetadata: true,
    asUTC: false
  }
  options = options ? Object.assign(defaults, options) : defaults;
  options.pattern = Array.isArray(options.pattern) ? options.pattern : [options.pattern];

  var recur = function(obj) {
    var self = recur;
    var m = null;

    if(Array.isArray(obj) && !visited.has(obj)) {
      visited.set(obj, true);
      // console.log('-- array --');
      for(var i = 0, v; v = obj[i++];) {
        // console.log('----------------------', i - 1, v);
        v = self(v);
        obj[i - 1] = v;
      }
    }
    else if(obj instanceof Date) {
      // console.log('-- value --');
      // console.log(obj);
      if(options.asUTC)
        m = moment.utc(obj);
      else
        m = moment(obj);
      // return m.isValid() ? m : obj;
      return m;
    }
    else if(moment.isMoment(obj)) {
      return obj;
    }
    else if(obj && typeof obj === 'object' && !visited.has(obj) && !(obj instanceof Buffer || obj instanceof ArrayBuffer)) {
      visited.set(obj, true);
      // console.log('-- object --');
      for(k in obj) {
        if(obj.hasOwnProperty(k)) {
          var v = obj[k];
          // console.log('----------------------', k, v);
          v = self(v);
          obj[k] = v;
        }
      }
    }
    
    // console.log('-- return --');
    return obj;
  }

  return function metalsmithMoment(files, metalsmith, done) {
    if(options.scanFiles) {
      var fa = match(Object.keys(files), options.pattern);
      var fo = {};
      for(var i = 0, f; f = fa[i++];) {
        fo[f] = files[f];
      }
      recur(fo);
    }
    
    if(options.scanMetadata)
      recur(metalsmith._metadata);

    done();
  }
}