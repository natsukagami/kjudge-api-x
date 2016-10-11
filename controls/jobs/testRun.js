/**
 * Job:
 * Runs a test
 * A test running job consists of a set of jobs.
 *  - Creating a temp folder, and move the executable in
 *  - Copying the input file to the submission folder
 *  - Running the program with the input file
 *  - Compare it to the output file
 *  - Returns the results
 */

const Promise = require('bluebird');
const path = require('path');
const randomstring = () => {
	return require('randomstring').generate({
		length: 12,
		charset: 'alphabetic'
	});
};
const debug = require('debug')('kjudge:jobs:test');

const TaskFs = require('../tasks/fs');
const TaskRunner = require('../tasks/runner/isolate');
const TaskComparators = require('../tasks/comparators');

/**
 * Job priority
 * @type {Number}
 */
const RUN_PRIORITY = 3;

/**
 * Runs a test
 * @param {Problem}    problem    The test's problem
 * @param {Submission} submission The submission
 * @param {Language}   language   The language
 * @param {Number}     testId     The id of the test
 * @return {Promise<Object>}         The task results
 *  @property {Number} runningTime The running time of the task, in microseconds
 *  @property {Number} memoryUsed  The used memory of the task, in KBs
 *  @property {string | Object} status      The status of the task
 *   @property {Number} score      The test's score (0..1)
 *   @property {string} comment    Any additional comments.
 */
module.exports = function testRun({
	problem,
	submission,
	language,
	testId
}, priority = 0) {
	debug(`Running test ${testId} of problem ${problem.displayName} for submission \
${submission.id}...`);
	let test = problem.tests[testId];
	let runCommand = language.runCommand(problem.name);
	let jobDir = null;
	let promise = Promise.resolve()
	.then(() => {
		jobDir = path.join('/tmp', randomstring());
		return TaskFs.mkdir(jobDir, priority + 2);
	})
	.then(() => {
		return Promise.all([
			TaskFs.copy(
				test.inputFile,
				path.join(jobDir, 'input.txt'),
				priority + 2
			),
			TaskFs.copy(
				path.resolve(submission.folder) + path.sep + '.',
				jobDir,
				priority + 2
			)
		]);
	})
	.then(() => {
		return TaskRunner.run({
			runCommand: runCommand,
			submissionFolder: jobDir,
			timeLimit: problem.timeLimit,
			memoryLimit: problem.memoryLimit
		}, RUN_PRIORITY + priority);
	})
	.then(res => {
		if (res.status !== 'OK') return res;
		if (problem.useCompare)
			return TaskFs.copy(
				test.outputFile,
				path.join(jobDir, 'answer.txt'),
				priority + 6
			).then(() => {
				return TaskComparators.comparatorCompare({
					problemFolder: problem.folder,
					input: path.join(jobDir, 'input.txt'),
					output: path.join(jobDir, 'output.txt'),
					answer: path.join(jobDir, 'answer.txt')
				}, priority + 7);
			}).then(diff => {
				res.status = diff;
				return res;
			});
		else
			return TaskComparators.diffCompare(
				path.join(jobDir, 'output.txt'),
				test.outputFile,
				priority + 7
			).then(diff => {
				res.status = diff;
				return res;
			});
	})
	.catch(err => {
		return Promise.reject(new Error('Test run failed: ' + err.message));
	});
	promise.then(() => {
		debug(`Done test ${testId} of problem ${problem.displayName} for submission \
${submission.id}...`);
		return TaskFs.remove(jobDir, 8);
	});
	return promise;
};
