
var assert = require('assert');
var dep = require('../lib/dependencymanager');

suite('PackageManager', function() {
	
	suite('#install', function() {

		test('adds a package', function() {
			var packageA = new dep.Package('A');

			var man = new dep.DependencyManager();
			man.install(packageA);

			assert.strictEqual(man.installedPackages.length, 1);
		});

		test('adds all dependencies', function() {
			var packageA = new dep.Package('A'),
				packageB = new dep.Package('B');
			packageA.addDependency(packageB);
			packageB.addDependency(new dep.Package('C'));

			var man = new dep.DependencyManager();
			man.install(packageA);

			assert.strictEqual(man.installedPackages.length, 3);
		});

		test('does not add same package twice', function() {
			var packageA = new dep.Package('A'),
				packageA2 = new dep.Package('A');

			var man = new dep.DependencyManager();
			man.install(packageA);
			man.install(packageA2);

			assert.strictEqual(man.installedPackages.length, 1, 'Expected one package because the name of the packages are the same');
		});

	});


	suite('#uninstall', function() {

		test('removes unreferenced package', function() {
			var packageA = new dep.Package('A');

			var man = new dep.DependencyManager();
			man.install(packageA);

			man.uninstall(packageA);
			assert.strictEqual(man.installedPackages.length, 0);
		});

		test('does not remove referenced package', function() {
			var packageA = new dep.Package('A'),
				packageB = new dep.Package('B');

			packageB.addDependency(packageA);

			var man = new dep.DependencyManager();
			man.install(packageA);
			man.install(packageB);

			man.uninstall(packageA);

			assert(man.contains(packageA), 'Expected the manager to still contain packageA because it is still referenced by packageB');
		});

		test('does remove when referenced removed', function() {
			var packageA = new dep.Package('A'),
				packageB = new dep.Package('B');

			packageB.addDependency(packageA);

			var man = new dep.DependencyManager();
			man.install(packageA);
			man.install(packageB);

			man.uninstall(packageB);
			man.uninstall(packageA);

			assert(!man.contains(packageB));
			assert(!man.contains(packageA));
		});

	});

});