/**
 * The Test model.
 */

class Test {
	constructor({
		inputFile,
		outputFile,
		score
	}) {
		/**
		 * The input file of the test
		 * @type {string}
		 */
		this.inputFile = inputFile;
		/**
		 * The output file of the test
		 * @type {string}
		 */
		this.outputFile = outputFile;
		/**
		 * The maximum score of the test
		 * @type {Number}
		 */
		this.score = score;
	}
}

module.exports = Test;
