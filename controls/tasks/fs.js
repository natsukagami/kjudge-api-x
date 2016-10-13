/**
 * Provides filesystem-based tasks.
 */
const Promise = require('bluebird');
const debug = require('debug')('kjudge:misc:fs');
const Task = require('../task/task');
const Queue = require('../task/queue');

/**
 * All fs-related tasks defaultly take the lowest non-zero priority.
 * @type {Number}
 */
const FS_QUEUE_PRIORITY = 0;

module.exports = {
	/**
	 * Copies recursively.
	 * @param  {string}    source   The source.
	 * @param  {string}    dest     The destination.
	 * @param  {Number}    priority The priority of the task.
	 * @return {Promise<>}          The copy task.
	 */
	copy(source, dest, priority = FS_QUEUE_PRIORITY) {
		return Queue.push(new Task({
			command: 'cp',
			args: ['-a', source, dest]
		}), priority).then((res) => {
			debug(`Copying '${source}' to '${dest}' done with status ${res.exitCode}.`);
			if (res.exitCode === 0) return Promise.resolve();
			return Promise.reject(new Error(res.stderr));
		});
	},
	/**
	 * Moves recursively.
	 * @param  {string}    source   The source.
	 * @param  {string}    dest     The destination.
	 * @param  {Number}    priority The priority of the task.
	 * @return {Promise<>}          The move task.
	 */
	move(source, dest, priority = FS_QUEUE_PRIORITY) {
		return Queue.push(new Task({
			command: 'mv',
			args: ['-a', source, dest]
		}), priority).then((res) => {
			debug(`Moving '${source}' to '${dest}' done with status ${res.exitCode}.`);
			if (res.exitCode === 0) return Promise.resolve();
			return Promise.reject(new Error(res.stderr));
		});
	},
	/**
	 * Removes recursively.
	 * @param  {string}    source   The source to be removed.
	 * @param  {Number}    priority The priority of the task.
	 * @return {Promise<>}          The remove task.
	 */
	remove(source, priority = FS_QUEUE_PRIORITY) {
		return Queue.push(new Task({
			command: 'rm',
			args: ['-rd', source]
		}), priority).then((res) => {
			debug(`Removing '${source}' done with status ${res.exitCode}.`);
			if (res.exitCode === 0) return Promise.resolve();
			return Promise.reject(new Error(res.stderr));
		});
	},
	/**
	 * Creates a new folder.
	 * @param  {string}    source   The folder link.
	 * @param  {Number}    priority The priority of the task.
	 * @return {Promise<>}          The mkdir task.
	 */
	mkdir(source, priority = FS_QUEUE_PRIORITY) {
		return Queue.push(new Task({
			command: 'mkdir',
			args: [source, '-m', '777']
		}), priority).then((res) => {
			debug(`Creating folder '${source}' done with status ${res.exitCode}.`);
			if (res.exitCode === 0) return Promise.resolve();
			return Promise.reject(new Error(res.stderr));
		});
	},
	/**
	 * Chmods a file / folder.
	 * @param  {string}    source   The file / folder link.
	 * @param  {string}    mode     The new permission.
	 * @param  {Number}    priority The priority of the task.
	 * @return {Promise<>}          The chmod task.
	 */
	chmod(source, mode, priority = FS_QUEUE_PRIORITY) {
		return Queue.push(new Task({
			command: 'chmod',
			args: ['-R', mode, source]
		}), priority).then((res) => {
			debug(`Chmodding '${source}' to '${mode}' done with status ${res.exitCode}.`);
			if (res.exitCode === 0) return Promise.resolve();
			return Promise.reject(new Error(res.stderr));
		});
	}
};
