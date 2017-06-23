const Problem = require('./controls/models/problem');
const Submission = require('./controls/models/submission');
const Test = require('./controls/models/test');
const JobJudge = require('./controls/jobs/judge');

/*
 * Sets any configurations and return the main module.
 * Or, one can call the main modules from the exports object itself.
 */
module.exports = function({
	isolateDirectory = process.env.ISOLATE || '/var/lib/isolate'
} = {}) {
	require('./controls/tasks/runner/isolate').DIRECTORY_DIR = isolateDirectory;
	return {
		Problem: Problem,
		Submission: Submission,
		Test: Test,
		Judge: JobJudge
	};
};

module.exports.Problem = Problem;
module.exports.Submission = Submission;
module.exports.Test = Test;
module.exports.Judge = JobJudge;

// let problem = new Problem({
// 	name: 'kcon',
// 	displayName: 'K-consecutive',
// 	folder: '/home/natsukagami/MEGASync/doituyen_2016/20161007/kcon',
// 	useGrader: false,
// 	scoringMode: 'groupMin',
// 	scoringDetails: [[10, 20], [10, 20], [15, 30], [15, 30]],
// 	timeLimit: 2000,
// 	memoryLimit: 262144
// });
//
// for (let i = 1; i <= 50; ++i) {
// 	problem.tests.push(new Test({
// 		inputFile: path.join(problem.folder, `${(i < 10 ? '0' + i : i)}.in`),
// 		outputFile: path.join(problem.folder, `${(i < 10 ? '0' + i : i)}.out`)
// 	}));
// }
//
// let submission = new Submission({
// 	folder: '/home/natsukagami/MEGASync/doituyen_2016/20161007/kcon/sub',
// 	problem: problem
// });
//
// JobJudge(submission).then(res => {
// 	console.log(res);
// });
