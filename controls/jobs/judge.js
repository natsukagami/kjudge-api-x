/**
 * Job:
 * Run judge on a submission
 */

const Promise = require('bluebird');
const debug = require('debug')('kjudge:jobs:judge');

const LangDefaults = require('../tasks/languages/defaults');
const JobTest = require('./testRun');
const JobScoring = require('./scoring');

/**
 * Judges a submission
 * @param  {Submission} submission The submission to be judged.
 * @return {Promise<Object>}       The result object.
 */
module.exports = function jobJudge(submission) {
	let submissionLanguage = null;
	let problem = submission.problem;
	debug(`Judging submission ${submission.id} for problem ${problem.displayName}`);
	let promise = Promise.resolve()
	.then(() => {
		// Get the submission's language
		return submission.getLanguage();
	})
	.then(lang => {
		// Compile it
		submissionLanguage = lang;
		return lang.compile(problem.name, {
			submissionFolder: submission.folder,
			problemFolder: problem.folder,
			useGrader: problem.useGrader
		});
	})
	.then(() => {
		// Run tests
		return Promise.all(problem.tests.map((item, id) => {
			return JobTest({
				problem: problem,
				submission: submission,
				language: submissionLanguage,
				testId: id
			});
		}));
	})
	.then(res => {
		return JobScoring(submission, res);
	})
	.catch(LangDefaults.CompileError, err => {
		return 'Compile Error: \n' + err.message;
	});
	promise.finally(() => {
		debug(`Done submission ${submission.id} for problem ${problem.displayName}`);
	});
	return promise;
};
