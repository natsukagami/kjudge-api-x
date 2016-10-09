/**
 * The problem model
 */

class Problem {
	constructor({
		name,
		displayName,
		folder,
		useCompare = false,
		useGrader = false,
		tests = [],
		scoringMode,
		scoringDetails = [],
		timeLimit,
		memoryLimit
	}) {
		/**
		 * The problem name, written with only letters, numbers and dashes "_"
		 * @type {string}
		 */
		this.name = name;
		/**
		 * The problem's display name. Used as the name to be outputted.
		 * @type {string}
		 */
		this.displayName = displayName || name;
		/**
		 * The path to the problem's folder
		 * @type {string}
		 */
		this.folder = folder;
		/**
		 * Whether to use a custom comparator?
		 * @type {bool}
		 */
		this.useCompare = useCompare;
		/**
		 * Whether to use a pre-implemented grader?
		 * @type {bool}
		 */
		this.useGrader = useGrader;
		/**
		 * A set of Test models
		 * @type {[Test]}
		 */
		this.tests = tests;
		/**
		 * The scoring mode.
		 * @type {'sum' | 'groupMin' | 'groupMul'}
		 */
		this.scoringMode = scoringMode;
		/**
		 * The scoring details
		 * @type {Array / Number}
		 */
		this.scoringDetails = scoringDetails;
		/**
		 * The time limit of the problem
		 * @type {Number} (in miliseconds)
		 */
		this.timeLimit = timeLimit;
		/**
		 * The memory limit of the problem
		 * @type {Number} (in KBs)
		 */
		this.memoryLimit = memoryLimit;
	}
}

module.exports = Problem;
