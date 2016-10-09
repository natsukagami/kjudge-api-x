/**
 * Compares the two output files
 * Both comparators will return a Promise of an Object with 2 properties
 *  - score: a number between 0 and 1 that indicates the score
 *  - comment: any additional comment
 */
const Promise = require('bluebird');
const Task = require('../task/task');
const Queue = require('../task/queue');

/**
 * Default priority for compare tasks
 * @type {Number}
 */
const COMPARE_TASK_PRIORITY = 7;

module.exports = {
	/**
	 * Compares using diff
	 * @param  {string}        output   Path to the output file
	 * @param  {string}        answer   Path to the answer file
	 * @param  {Number}        priority Priority of the task
	 * @return {Promise<Object>}          Whether both files are correct
	 *  @property {Number} score   The score [0..1] of the file
	 *  @property {string} comment Any additional comments
	 */
	diffCompare(output, answer, priority = COMPARE_TASK_PRIORITY) {
		return Queue.push(new Task({
			command: 'diff',
			args: ['-wq', output, answer]
		}), priority).then(res => {
			if (res.exitCode === 0) return {
				score: 1,
				comment: 'Output is Correct'
			};
			if (res.exitCode === 1) return {
				score: 0,
				comment: 'Output isn\'t Correct'
			};
			return Promise.reject(new Error(`Exited with code ${res.code},\
 stderr: ${res.stderr}`));
		});
	},
	/**
	 * Compare with a pre-built comparator.
	 * The comparator should be a statically-compiled binary file named 'compare'
	 * located within the problem folder. It is called with the following
	 * arguments:
	 *  ./compare [input] [output] [answer]
	 * And should output a real number between 0 and 1 indicating the score of the
	 * test, plus any comment should be written to stderr.
	 * The comparator exiting with a non-zero code is considered faulty.
	 * @param {Object}
	 *  @property {string} problemFolder The problem's folder, where the comparator
	 *  is located.
	 *  @property {string} input         Path to the input file
	 *  @property {string} output        Path to the output file
	 *  @property {string} answer        Path to the answer file
	 * @param  {Number}        priority   Priority of the task
	 * @return {Promise<Object>}          Whether both files are correct
	 *  @property {Number} score   The score [0..1] of the file
	 *  @property {string} comment Any additional comments
	 */
	comparatorCompare({
		problemFolder,
		input = '/dev/null',
		output = '/dev/null',
		answer = '/dev/null'
	}, priority = COMPARE_TASK_PRIORITY) {
		return Queue.push(new Task({
			command: './compare',
			args: [input, output, answer],
			cwd: problemFolder
		}), priority).then(res => {
			if (res.exitCode === 0) {
				return {
					score: Math.max(0, Math.min(1, Number(res.stdout))),
					comment: res.stderr
				};
			}
			return Promise.reject(new Error(`Exited with code ${res.code},\
 stderr: ${res.stderr}`));
		});
	}
};
