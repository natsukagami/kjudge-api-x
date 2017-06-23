const files = require('../proto/files_pb');
const worker = require('../proto/worker_pb');
const Path = require('path');
const grpc = require('grpc');
const fs = require('fs');
const util = require('util');
const debug = require('debug')('kjudge:server_api');
const LangDefaults = require('./tasks/languages/defaults');

const FilesClient = require('../proto/files_grpc_pb').FilesClient;
const filesClient = new FilesClient(
	'localhost:25001',
	grpc.credentials.createInsecure()
);

const PoolClient = require('../proto/worker_grpc_pb').PoolClient;
const poolClient = new PoolClient(
	'localhost:25002',
	grpc.credentials.createInsecure()
);

// A cache that maps file dir <-> digest
const cache = new Map();

/**
 * Returns a path's digest.
 * @param {string} path The path to be received.
 * @returns {string} The returned file's digest.
 */
async function getDigest(path) {
	path = Path.normalize(path);
	if (cache.has(path)) return cache.get(path);
	// Upload me
	debug(`Uploading ${path}`);
	const file = new files.File();
	const content = await util.promisify(fs.readFile)(path);
	file.setContent(content);
	const digest = await util.promisify(filesClient.upload)(file);
	cache.set(path, digest);
	return digest;
}

// Warning: C++ only.
async function compile(problemName, {
	submissionFolder,
	problemFolder,
	useGrader = false
}) {
	const compileTask = new worker.Compilation;
	compileTask.setSource(await getDigest(Path.join(submissionFolder, `${problemName}.cpp`)));
	if (useGrader) {
		compileTask.setGrader(await getDigest(Path.join(problemFolder, 'grader.cpp')));
		compileTask.setHeader(await getDigest(Path.join(problemFolder, `${problemName}.h`)));
		compileTask.setHeaderName(`${problemName}.h`);
	}
	const result = await poolClient.Compile(compileTask);
	if (result.getSuccess()) {
		return result.getExecutable();
	} else {
		throw new LangDefaults.CompileError(result.getStderr());
	}
}

async function testRun({
	problem,
	submission,
	executable,
	testId
}) {
	debug(`Running test ${testId} of problem ${problem.displayName} for submission ${submission.id}...`);
	let test = problem.tests[testId];
	let task = new worker.Testrun();
	task.setExecutable(executable);
	task.setInput(await getDigest(test.inputFile));
	task.setOutput(await getDigest(test.outputFile));
	task.setTime(problem.timeLimit);
	task.setMem(problem.memoryLimit);
	if (problem.useCompare) {
		task.setCompare(await getDigest(Path.join(problem.folder, 'compare')));
	}
	const result = await util.promisify(poolClient.Run)(task);
	return {
		runningTime: result.Time,
		memoryUsed: result.Mem,
		score: result.Score,
		comment: result.Verdict
	};
}

module.exports = {
	compile: compile,
	testrun: testRun
};