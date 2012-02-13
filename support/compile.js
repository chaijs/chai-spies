var fs = require('fs')
  , path = require('path')
  , join = path.join
  , folio = require('folio');

var appfiles = []
  , basepath = join(__dirname, '..', 'lib');

function iteratePath (p) {
  var self = this
    , files = fs.readdirSync(p);
  files.forEach(function (filename) {
    var file = path.join(p, filename)
      , stat = fs.statSync(file);
    if (stat.isDirectory()) {
      iteratePath(file);
    } else if (stat.isFile()) {
      if (path.extname(file) == '.js')
        appfiles.push(file);
    }
  });
};

iteratePath(basepath);

var applicationJs = new folio.Glossary(appfiles, {
  compilers: {
    js: function (name, source, filename) {
      var title = filename.replace(basepath + '/', '').replace('.js', '')
        , buf = '\nrequire.register("' + title + '", function (module, exports, require) {\n';
      buf += source;
      buf += '\n}); // module ' + name;
      return buf;
    }
  }
});

var prefix = fs.readFileSync(join(__dirname, 'browser', 'prefix.js'), 'utf8')
  , suffix = fs.readFileSync(join(__dirname, 'browser', 'suffix.js'), 'utf8')

applicationJs.compile(function (err, src) {
  var content = prefix + src + suffix;
  fs.writeFileSync(join(__dirname, '..', 'chai-spies.js'), content, 'utf8');
  console.log('completed: chai-spies.js');
});
