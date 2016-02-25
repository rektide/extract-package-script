#!/usr/bin/env
"use strict"

var
  path= require("path"),
  promisify= require("es6-promisify"),
  resolve= promisify(require("resolve")),
  readFile= promisify(require("fs").readFile)

function extractPackageScript(pkg, script, opts){
	var
	  _resolve= opts && opts.resolve || resolve,
	  _getScript= opts && opts.getScript || getScript
	return _resolve(pkg).then(_getScript(script))
}

function getScript(script, opts){
	var
	  packageFile= opts&& opts.packageFile|| module.exports.packageFile,
	  jsonify= opts&& opts.jsonify|| module.exports.jsonify
	return function(module){
		return Promise
			.resolve(module+ path.sep+ packageFile)
			.then(script => readFile(script, "utf8"))
			.then(jsonify)
			.then(packageJson => packageJson.scripts[script])
	}
}

module.exports= extractPackageScript
module.exports.extractPackageScript= extractPackageScript

module.exports.resolve= resolve

module.exports.getScript= getScript
module.exports.jsonify= JSON.parse
module.exports.packageFile = "package.json"

module.exports.main= main
module.exports.argPkg= ()=> process.argv[2]
module.exports.argScript= ()=> process.argv[3]
module.exports.isRunning= false
module.exports.log= console.log.bind(console)
module.exports.warn= ()=> {
	process.on("unhandledRejection", err=> {
		console.error(err, err.stack)
		process.exit(1)
	})
}

function main(){
	var result= Promise.all([
			module.exports.argPkg(),
			module.exports.argScript()])
		.then(args=> {
			return extractPackageScript(args[0], args[1])
		})
	if(module.exports.isRunning){
		var capture= result
		result= result.then(module.exports.log).then(()=> capture)
	}
	return result
}

if(require.main === module){
	module.exports.isRunning= true
	Promise.resolve(module.exports.warn()).then(()=> {
		setTimeout(()=> {
			module.exports.main()
		}, 0)
	})
}
