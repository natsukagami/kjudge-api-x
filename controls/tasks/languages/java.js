/**
 * Language Specification for Java
 */
const Promise = require('bluebird');
const path = require('path');
const Task = require('../../task/task');
const Queue = require('../../task/queue');
const Defaults = require('./defaults');

module.exports = {
	/**
	 * The extension for C++ source code
	 * @type {String}
	 */
	ext: '.java',
	/**
	 * Creates a compile task, which compiles a java file into an object
	 * @param {string}     problemName The problem name, which the file's name
	 * should be, and will be the output file's name.
	 * @param {Object}     options
	 *  @property {string} submissionFolder The submission's folder
	 *  @property {string} problemFolder    The problem's folder
	 *  @property {bool}   useGrader        Whether the compilation needs a grader
	 *  file
	 *  @property {Number} priority         The priority of the task
	 * @return {Promise<string>}       The compile task, with compiler warnings.
	 */
	compile(problemName, {
		submissionFolder,
		problemFolder,
		useGrader = false
	}, priority = Defaults.COMPILE_TASK_PRIORITY) {
		let args = ['--main=Main', '-O3', '-o', problemName, `${problemName}.java`];
		if (useGrader)
			args = ['--main=grader', '-O3', '-o', problemName, `${problemName}.java`,
		path.join(problemFolder, 'grader.java')];
		return Queue.push(new Task({
			command: 'gcj',
			args: args,
			cwd: submissionFolder
		}), priority).then(res => {
			if (res.exitCode === 0) return Promise.resolve(res.stderr);
			return Promise.reject(new Defaults.CompileError(res.stderr));
		});
	},
	/**
	 * Creates a compile task for comparator
	 * @param {Object}     options
	 *  @property {string} problemFolder    The problem's folder
	 *  @property {Number} priority         The priority of the task
	 * @return {Promise<string>}         The compile task, with compiler warnings.
	 */
	comparatorCompile({
		problemFolder
	}, priority = Defaults.COMPILE_TASK_PRIORITY) {
		return Queue.push(new Task({
			command: 'gcj',
			args: ['--main=Main', '-O3', '-o', 'compare', 'compare.java'],
			cwd: problemFolder
		}), priority).then(res => {
			if (res.exitCode === 0) return Promise.resolve(res.stderr);
			return Promise.reject(new Defaults.CompileError(res.stderr));
		});
	},
	/**
	 * The run command of the executable.
	 * @param  {string} problemName The name of the problem
	 * @param  {string} cwd         The folder of the executable
	 * @return {string}             The executable command
	 */
	runCommand(problemName, cwd = './') {
		if (cwd === './') return cwd + problemName;
		return path.join(cwd, problemName);
	}
};
