/**
 * Dependency management (using reference counting)
 * 
 * TODO: circular references are not handled!
 */
(function() {
"use strict";

//setup module/exports
var dep;
if(typeof exports !== 'undefined') {
	dep = exports;
} else {
	dep = this.dep = {};
}

/**
 * Represents an instance of a package
 */
function Package(name) {
	this.name = name;
	this.dependencies = [];
}
Package.prototype = {
	addDependency: function(pkg) {
		if(!pkg) {
			throw 'package cannot be empty';
		}
		this.dependencies.push(pkg);
	}
};
dep.Package = Package;

/**
 * Stores the number of references to this package
 */
function PackageRef(pkg) {
	this.pkg = pkg;
	this.refCount = 0;
}

/**
 * Represents a manager of dependency
 */
function DependencyManager() {
	this.installedPackages = [];

	//keep a map of all packages by name
	this.installedPackageMap = {};
}
DependencyManager.prototype = {
	contains: function(pkg) {
		return typeof this.installedPackageMap[pkg.name] !== 'undefined';
	},
	install: function(pkg) {

		//if a package is already installed, then dont add it again
		if(this.installedPackageMap[pkg.name]) {
			return;
		}

		//install each of the dependencies
		if(pkg.dependencies) {
			var that = this;
			pkg.dependencies.forEach(function(pkg) {
				that.install(pkg);

				//increase the pkg reference count
				var pkgRef = that.installedPackageMap[pkg.name];
				pkgRef.refCount++;
			});
		}

		var pkgRef = new PackageRef(pkg);

		this.installedPackageMap[pkg.name] = pkgRef;
		this.installedPackages.push(pkgRef);
	},
	uninstall: function(pkg) {
		var pkgRef = this.installedPackageMap[pkg.name];

		//no need to do anything if the package isn't installed already
		if(!pkgRef) {
			return {
				success: true
			};
		}

		if(pkgRef.refCount > 0) {
			return {
				success: false,
				message: 'Still referenced'
			};
		}

		//delete the ref from the map
		delete this.installedPackageMap[pkg.name];

		//remove it from the array of packages
		var index = this.installedPackages.indexOf(pkgRef);
		if(index > -1) {
			this.installedPackages.splice(index, 1);
		}

		//decrement the reference count for each dependency
		var that = this;
		pkgRef.pkg.dependencies.forEach(function(dep) {
			var depRef = that.installedPackageMap[dep.name];
			depRef.refCount--;
		});

		return {
			success: true
		};
	}
};
dep.DependencyManager = DependencyManager;


}).call(this);