/**
 * Job:
 * Do scoring
 */

/**
 * Gets the full verdict of the test.
 * @param  {string} code The standard verdict returned by isolate
 * @return {string}      The full human-readable verdict.
 */
function fullVerdict(code) {
	return {
		'RE': 'Runtime Error',
		'SG': 'Killed by Signal (Memory Limit Exceeded?)',
		'TO': 'Time Limit Exceeded',
		'MLE': 'Memory Limit Exceeded'
	}[code];
}

/**
 * Scores a submission, with 'sum' scoringMode
 * @param  {[Object]} results Test results
 * @param  {[Test]}   tests   Test information
 * @return {Object}           Score
 */
function sumScoring(results, tests) {
	let obj = {
		score: 0,
		maxScore: 0,
		tests: []
	};
	results.forEach((res, id) => {
		if (typeof res.status !== 'string') {
			obj.score += tests[id].score * res.status.score;
			obj.tests.push({
				runningTime: res.runningTime,
				memoryUsed: res.memoryUsed,
				score: tests[id].score * res.status.score,
				verdict: res.status.comment
			});
		} else {
			obj.tests.push({
				runningTime: res.runningTime,
				memoryUsed: res.memoryUsed,
				score: 0,
				verdict: fullVerdict(res.status),
				signal: res.status
			});
		}
		obj.maxScore += tests[id].score;
	});
	return obj;
}

/**
 * Scores a submission, that multiplies the whole subtask (group)'s score with
 * a calculated ratio that defaults at 1 and is updated through updFunc

 * @param  {[Object]}           results        Test results
 * @param  {[[Number, Number]]} scoringDetails How groups are divided and scored
 * @param  {Function}           updFunc        The ratio update function (oldRatio, score) => Number
 * @return {Object}                            Score
 */
function groupedRatioScoring(results, scoringDetails, updFunc) {
	let obj = {
		score: 0,
		maxScore: 0,
		tests: []
	};
	let cur = 0;
	scoringDetails.forEach(([num, total]) => {
		obj.maxScore += total;
		let sub = {
			score: 0,
			maxScore: total,
			tests: []
		};
		let ratio = 1.0;
		for (let i = 0; i < num; ++i, ++cur) {
			let res = results[cur];
			if (typeof res.status !== 'string') {
				ratio = updFunc(ratio, res.status.score);
				sub.tests.push({
					runningTime: res.runningTime,
					memoryUsed: res.memoryUsed,
					score: res.status.score,
					verdict: res.status.comment
				});
			} else {
				ratio = 0;
				sub.tests.push({
					runningTime: res.runningTime,
					memoryUsed: res.memoryUsed,
					score: 0,
					verdict: fullVerdict(res.status),
					signal: res.status
				});
			}
		}
		sub.score = total * ratio;
		obj.score += sub.score;
		obj.tests.push(sub);
	});
	return obj;
}

/**
 * Scores a submission, with 'groupMin' scoringMode
 * @param  {[Object]}           results        Test results
 * @param  {[[Number, Number]]} scoringDetails How groups are divided and scored
 * @return {Object}                            Score
 */
function groupMinScoring(results, scoringDetails) {
	return groupedRatioScoring(results, scoringDetails, Math.min);
}

/**
 * Scores a submission, with 'groupMul' scoringMode
 * @param  {[Object]}           results        Test results
 * @param  {[[Number, Number]]} scoringDetails How groups are divided and scored
 * @return {Object}                            Score
 */
function groupMulScoring(results, scoringDetails) {
	return groupedRatioScoring(results, scoringDetails, (oldRatio, score) => oldRatio * score);
}

/**
 * Scores a submission
 * @param  {Submission} submission The submission to be scored.
 * @param  {[Object]}   results    Test results.
 * @return {Object}                Score
 */
module.exports = function jobScoring(submission, results) {
	let problem = submission.problem;
	if (problem.scoringMode === 'sum') return sumScoring(results, problem.tests);
	if (problem.scoringMode === 'groupMin')
		return groupMinScoring(results, problem.scoringDetails);
	if (problem.scoringMode === 'groupMul')
		return groupMulScoring(results, problem.scoringDetails);
};
