/**
 * Language Specification
 * Default values
 */

const EError = require('es6-error');

class CompileError extends EError {

}

class NoLanguageFoundError extends EError {

}

module.exports = {
	/**
	 * The default task priority
	 * @type {Number}
	 */
	COMPILE_TASK_PRIORITY: 1,
	CompileError: CompileError,
	NoLanguageFoundError: NoLanguageFoundError
};
