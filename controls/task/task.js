/*
 * Control - Task
 * Task serves as the unit level operation of kjudge-api-x. A task is actually a
 * direct fork from node.js to Linux programs (and others e.g isolate).
 * Performing a task is actually forking the outside program and then fetch its
 * results.
 */

const debug = require('debug');
const Promise = require('bluebird');
const childProcess = require('child_process');

/**
 * A common external command wrapper that runs and returns a command's output.
 */
class Task {
	/**
	 * Task Constructor
	 * @param {string}   command The command to be executed
	 * @param {string[]} args    The list of arguments to be executed. Defaults to
	 * nothing
	 * @param {string}   cwd     Current working directory. Defaults to the kjudge
	 * process.
	 */
	constructor({ command, args = [], cwd = '' }) {
		/**
		 * The command of the task
		 * @type {string}
		 */
		this.command = command;
		/**
		 * The list of arguments of the command.
		 * @type {string[]}
		 */
		this.args = args;
		/**
		 * The current working directory of the command.
		 * @type {string}
		 */
		this.cwd = cwd;
		/**
		 * The id of the task
		 * @type {Number}
		 */
		this.id = ++Task.Index;
		/**
		 * @method A debug function, made specifically for the task
		 * @param {string} message
		 */
		this.debug = debug(`kjudge:task:${this.id}`);
	}
	/**
	 * Runs the task
	 * @return {Promise.<Object>}
	 * @property {string} stdout   The output of the task
	 * @property {string} stderr   The error stream of the task
	 * @property {Number} exitCode The exit code of the program
	 */
	run() {
		return new Promise((resolve) => {
			this.debug(`Running '${this.command} ${this.args.join(' ')}'...`);
			childProcess.execFile(this.command, this.args, {
				cwd: this.cwd,
				maxBuffer: 64 * 1024 * 1024
			}, (err, stdout, stderr) => {
				this.debug('Task ended');
				resolve({
					stdout: stdout,
					stderr: stderr,
					exitCode: (err === null ? 0 : err.code || err.signal)
				});
			});
		});
	}
}
/**
 * The index used for task numbering
 * @type {Number}
 */
Task.Index = 0;

module.exports = Task;
