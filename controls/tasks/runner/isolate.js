/**
 * Run a program through isolate
 * This is actually a set of tasks
 */
const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const childProcess = require('child_process');
const debug = require('debug')('kjudge:runner:isolate');
const Task = require('../../task/task');
const Queue = require('../../task/queue');

// Check if isolate is installed
try {
	childProcess.execFileSync('isolate', ['--version']);
} catch (err) {
	throw new Error('isolate not found! Please check if it is installed.');
}

/**
 * An array of available boxes
 * @type {Array}
 */
let Id = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let Isolate = {
	/**
	 * The directory where sandboxes are located
	 * @type {String}
	 */
	DIRECTORY_DIR: '/var/lib/isolate',
	/**
	 * The default priority of the isolate task
	 * @type {Number}
	 */
	ISOLATE_TASK_PRIORITY: 3
};

/**
 * Prepares an isolate sandbox for use.
 * @param  {Number}          priority The priority of the task.
 * @return {Promise<Number>}          The sandbox id.
 */
function prepareTask(priority) {
	if (!Id.length) return Promise.delay(10).then(() => {
		return prepareTask();
	});
	let boxId = Id.shift();
	return Queue.push(new Task({
		command: 'isolate',
		args: ['--init', '--cg', '-b', boxId.toString()]
	}), priority).then((res) => {
		if (res.exitCode !== 0) {
			debug(`Box ${boxId} init failed: ${res.stderr}. Moving box back to queue`);
			Id.push(boxId);
			return Promise.reject(new Error(`Box ${boxId} init failed: ${res.stderr}`));
		}
		debug(`Box ${boxId} init successful.`);
		return boxId;
	});
}

/**
 * Runs a program within the isolate sandbox
 * @param  {Number} boxId            The id of the box
 * @param  {string} runCommand       The command to be run
 * @param  {string} submissionFolder The folder used to store the submission
 * @param  {Number} timeLimit        The time limit, in microseconds
 * @param  {Number} memoryLimit      The memory limit, in KBs
 * @param  {Number} priority         The priority of the task
 * @return {Promise<Object>}         The task results
 *  @property {Number} runningTime The running time of the task, in microseconds
 *  @property {Number} memoryUsed  The used memory of the task, in KBs
 *  @property {string} status      The status of the task
 */
function runTask(boxId, {
	runCommand,
	submissionFolder,
	timeLimit,
	memoryLimit
}, priority) {
	boxId = boxId.toString();
	const boxDir = path.join(Isolate.DIRECTORY_DIR, boxId, 'box');
	let promise = Queue.push(new Task({
		command: 'isolate',
		args: [
			'-b',
			boxId.toString(),
			'--cg',
			'--run',
			`--dir=${path.join(boxDir, 'env')}=${submissionFolder}:rw`,
			'-t', (timeLimit / 1000).toString(),
			'-w', (timeLimit / 1000 + 500).toString(),
			'-m', memoryLimit.toString(),
			'-i', path.join(boxDir, 'env', 'input.txt'),
			'-o', path.join(boxDir, 'env', 'output.txt'),
			'-M', path.join(submissionFolder, 'meta.txt'),
			path.join(boxDir, 'env', runCommand)
		]
	}), priority).then((res) => {
		debug(`isolate says "${res.stderr}"`);
		// Extract meta.txt
		return fs.readFileAsync(path.join(submissionFolder, 'meta.txt'), 'utf-8');
	}).then(meta => {
		// Get meta information
		let opt = { };
		meta.split('\n').forEach(line => {
			let [name, val] = line.split(':');
			opt[name] = val;
		});
		return opt;
	}).then(info => {
		return {
			runningTime: (Number(info['time-wall'] || info.time)) * 1000,
			memoryUsed: Number(info['cg-mem']),
			status: info.status || 'OK'
		};
	});
	promise.then(info => {
		debug(`Sandbox ${boxId} completed, time = ${info.runningTime}, mem =\
 ${info.memoryUsed}, status = ${info.status}`);
	});
	return promise;
}

/**
 * Cleans up the sandbox
 * @param  {Number} boxId    The box id
 * @param  {Number} priority The priority of the task
 * @return {Promise<>}       The task
 */
function cleanupTask(boxId, priority) {
	return Queue.push(new Task({
		command: 'isolate',
		args: ['-b', boxId.toString(), '--cleanup']
	}), priority).then(res => {
		if (res.exitCode !== 0) return Promise.reject(new Error(res.stderr));
		debug(`Sandbox ${boxId} cleaned up, ready to be put back in queue`);
		Id.push(boxId);
	});
}

/**
 * Runs the program in isolate sandbox
 * @param  {string} runCommand       The command to be run
 * @param  {string} submissionFolder The folder used to store the submission
 * @param  {Number} timeLimit        The time limit, in microseconds
 * @param  {Number} memoryLimit      The memory limit, in KBs
 * @param  {Number} priority         The priority of the task
 * @return {Promise<Object>}         The task results
 *  @property {Number} runningTime The running time of the task, in microseconds
 *  @property {Number} memoryUsed  The used memory of the task, in KBs
 *  @property {string} status      The status of the task
 */
Isolate.run = function({
	runCommand,
	submissionFolder,
	timeLimit,
	memoryLimit
}, priority = Isolate.ISOLATE_TASK_PRIORITY) {
	let boxId = null;
	let promise = prepareTask(priority).then(id => {
		boxId = id;
		return runTask(boxId, {
			runCommand,
			submissionFolder,
			timeLimit,
			memoryLimit
		}, priority + 1);
	});
	promise.then(() => {
		cleanupTask(boxId, priority + 2);
	});
	return promise;
};

module.exports = Isolate;
