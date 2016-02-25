#!/usr/bin/env
"use strict"

var
  promisify= require("es6-promisify"),
  resolve= promisify(require("resolve")),
  readFile= promisify(require("fs").readFile),
  jsonify= JSON.parse

function extractPackageScript(pkg, script, opts){
	var
	  _resolve= opts && opts.resolve || resolve,
	  _getScript= opts && opts.getScript || getScript
	return _resolve(pkg).then(_getScript(script))
}

function getScript(script){
	return function(module){
		return Promise
			.resolve(module+ path.sep+ "package.json")
			.then(script => readFile(script, "utf8"))
			.then(jsonify)
			.then(packageJson => packageJson.scripts[script])
	}
}

module.exports= extractPackageScript
module.exports.extractPackageScript= extractPackageScript
module.exports.resolve= resolve
module.exports.getScript= getScript
