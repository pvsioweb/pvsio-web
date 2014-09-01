/**
 * test suite for testing server functions
 * @author Patrick Oladimeji
 * @date 6/26/14 11:55:50 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, expect, describe, it, __dirname*/

var serverFuncs = require("../serverFunctions"),
	pvsio = require("../pvsprocess"),
	p = pvsio();
var path = require("path"),
	fs = require("fs"),
	exec = require("child_process").exec;

var writeFile = serverFuncs.writeFile,
	stat = serverFuncs.stat,
	//getFolderStructure = serverFuncs.getFolderStructure,
	mkdirRecursive	= serverFuncs.mkdirRecursive,
	createProject = serverFuncs.createProject,
	openProject = serverFuncs.openProject,
	listProjects = serverFuncs.listProjects;

var testid = new Date().getTime(),
	errLog = function (err) {console.log(err); };
describe("sever functions for manipulating file system and projects", function () {
	it("Testing stat function :this file exists and it is a file", function () {
		stat(path.join(__dirname , "serverFunc-spec.js"))
			.then(function (f) {
				expect(f).toBeDefined();
				expect(f.isDirectory()).toEqual(false);
				expect(f.isFile()).toEqual(true);
				expect(typeof f.isBlockDevice).toEqual("function");
				expect(typeof f.isCharacterDevice).toEqual("function");
				expect(typeof f.isFIFO).toEqual("function");
				expect(typeof f.isSocket).toEqual("function");
			}, errLog);
	});
	
	it("write file works", function (done) {
		writeFile(path.join(__dirname, "test.txt"), "hello")
			.then(function (res) {
				stat(res.filePath).then(function (f) {
					expect(f).toBeDefined();
					expect(f.isFile()).toEqual(true);
					fs.unlink(res.filePath, function () {
						done();
					});
				}, errLog);
			}, errLog);
	});
	it("mkdirRecursive function works", function (done) {
		var baseDir = path.join(__dirname, "__" + new Date().getTime() + "_folder");
		var testDir = path.join(baseDir, "foo", "bar");
		mkdirRecursive(testDir, function (err) {
			if (err) {console.log(err); }
			stat(testDir).then(function (f) {
				expect(f).toBeDefined();
				expect(f.isDirectory()).toEqual(true);
				exec("rm -r " + baseDir, function (err) {
					if (err) { console.log(err); }
					done();
				});
			});
		});
	});
	
	it("writing a file with specified nested folders (e.g., goo/foo/test.txt works", function (done) {
		writeFile(path.join(__dirname, "__testingfolder_one/two/three/test.txt"), "hello")
			.then(function (res) {
				stat(res.filePath).then(function (f) {
					expect(f).toBeDefined();
					expect(f.isFile()).toEqual(true);
					exec("rm -r " + path.join(__dirname, "__testingfolder_one"), function (err) {
						if (err) { console.log(err); }
						done();
					});
				}, errLog);
			}, errLog);
	});
	
	it("list projects returns a list of projects in public/projects directory", function (done) {
		listProjects().then(function (projects) {
			expect(projects).toContain("AlarisGP");
			done();
		});
	});
	
	it("openProject contains the right information", function (done) {
		openProject("AlarisGP").then(function (project) {
			expect(project).toBeDefined();
			expect(project.name).toEqual("AlarisGP");
			expect(project.folderStructure).toBeDefined();
			expect(project.projectFiles).toBeDefined();
			expect(project.projectFiles.length > 0).toEqual(true);
			done();
		});
	});
	
	it("createProject works as expected", function (done) {
		var projectName = "AlarisGP_" + testid;
		openProject("AlarisGP").then(function (project) {
			var data = {projectName: projectName,
						projectFiles: project.projectFiles};
			data.projectFiles.forEach(function (d) {
				d.filePath = d.filePath.replace("AlarisGP", projectName);
			});
			createProject(data, function (project) {
				if (project.err) {console.log(project.err); }
				console.log(project.name);
				//open the created project
				openProject(projectName).then(function (project) {
					expect(project.name).toEqual(projectName);
					expect(project.projectFiles).toBeDefined();
					expect(project.folderStructure).toBeDefined();
					//remove the folder
					exec("rm -r " + path.join(__dirname, "../", "public/projects", projectName), function (err) {
						if (err) {console.log(err);}
						done();
					});
				});
			}, p);
		}, errLog);
	});
});