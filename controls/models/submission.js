/**
 * The submission model
 */
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const Languages = require('../tasks/languages/all');
const LangDefaults = require('../tasks/languages/defaults');

class Submission {
	constructor({
		folder,
		problem
	}) {
		/**
		 * The submission's folder
		 * @type {string}
		 */
		this.folder = folder;
		/**
		 * The submission's problem
		 * @type {Problem}
		 */
		this.problem = problem;
		/**
		 * The submission's id
		 * @type {Number}
		 */
		this.id = ++Submission.ID;
	}
	/**
	 * Gets the submission's language
	 * @return Promise<Language>
	 */
	getLanguage() {
		return Promise.any(Languages.map(item => {
			return fs.accessAsync(
				path.join(this.folder, this.problem.name + item.ext),
				fs.constants.F_OK
			).then(() => { return item; });
		})).catch(Promise.AggregateError, () => {
			return Promise.reject(new LangDefaults.NoLanguageFoundError('No suitable language found'));
		});
	}
}

Submission.ID = 0;

module.exports = Submission;
