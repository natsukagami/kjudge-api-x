/**
 * Provides a queue implementation for Task Scheduling
 * Supports handling multiple tasks, with priority order.
 */
const debug = require('debug')('kjudge:task:queue');

/**
 * Heap is a storage which supports quick insert and query priorized items.
 */
class Heap {
	// Constructor
	constructor() {
		/**
		 * The underlying array
		 * @type {Array}
		 */
		this.arr = [];
	}
	// Getters and Setters
	/**
	 * Gets the Heap's length
	 * @return {number}
	 */
	get length() { return this.arr.length; }
	// Private methods
	/**
	 * Swaps data at positions x and y.
	 * Complexity: O(1)
	 * @return {None}
	 */
	__swap(x, y) {
		let k = this.arr[x];
		this.arr[x] = this.arr[y];
		this.arr[y] = k;
	}
	/**
	 * Attempt to push the element up.
	 * Complexity: O(log(size))
	 * @param {number} id The id of the element to be pushed up
	 * @return {None}
	 */
	__push_up(id) {
		if (id == 0) return; // Already at root
		let parent = Math.round((id - 1) / 2);
		if (this.arr[id].priority > this.arr[parent].priority) {
			this.__swap(id, parent);
			this.__push_up(parent);
		}
	}
	/**
	 * Attempt to push the element down.
	 * Complexity: O(log(size))
	 * @param {number} id The id of the element to be pushed down
	 * @return {None}
	 */
	__push_down(id) {
		let getPriority = x => {
			if (x >= this.length) return -1;
			return this.arr[x].priority;
		};
		const leftChild = 2 * id + 1, rightChild = 2 * id + 2;
		let bestChild = (getPriority(leftChild) < getPriority(rightChild) ?
			rightChild : leftChild);
		if (getPriority(bestChild) < 0) return; // it has no children
		if (getPriority(id) < getPriority(bestChild)) {
			this.__swap(id, bestChild);
			this.__push_down(bestChild);
		}
	}
	// Public methods
	/**
	 * Push an item to the queue.
	 * Complexity: O(log(size))
	 * @param {any}    item     The item to be pushed
	 * @param {Number} priority The priority of the item.
	 * @return {None}
	 */
	push(item, priority) {
		this.arr.push({
			item: item,
			priority: priority
		});
		this.__push_up(this.length - 1);
	}
	/**
	 * Takes the item with the highest priority and pop it from the heap.
	 * Complexity: O(log(size))
	 * @return {any} The item with the highest priority.
	 */
	shift() {
		if (!this.length)
			throw new Error('Attempt to pop the heap when it\'s empty');
		let k = this.arr[0].item;
		this.__swap(0, this.length - 1);
		this.arr.pop();
		this.__push_down(0);
		return k;
	}
}

class TaskQueue {
	constructor() {
		/**
		 * The underlying queue of task
		 * @type {Heap}
		 */
		this.arr = new Heap();
		/**
		 * Stores id of all running tasks
		 * @type {[Symbol]}
		 */
		this.pending = [];
		// Starts queuing
		this.__queueCheck();
	}
	// Private methods
	/**
	 * Creates a promise that is fulfilled when the task is completed.
	 * @param {Task}   task          The task to be queued
	 * @param {Number} priority      The task's priority
	 * @return {Promise<task.run()>} The task results
	 */
	__createPromise(task, priority) {
		return new Promise((resolve) => {
			debug(`Task ${task.id} enqueued.`);
			this.arr.push(resolve, priority);
		}).then(() => {
			debug(`Task ${task.id} now running.`);
			this.pending.push(task.id);
			let x = task.run();
			x.then(() => {
				debug(`Task ${task.id} finished.`);
				this.pending.splice(this.pending.indexOf(task.id), 1);
			});
			return x;
		});
	}
	/**
	 * A queue checker, pushing item when idle.
	 * @return {None}
	 */
	__queueCheck() {
		if (this.pending.length < TaskQueue.concurrency && this.arr.length) {
			this.arr.shift()();
		}
		setTimeout(() => {
			this.__queueCheck();
		}, 10);
	}
	// Public methods
	/**
	 * Pushes the task into the queue.
	 * @param {Task}   task          The task to be queued
	 * @param {Number} priority      The task's priority
	 * @return {Promise<task.run()>} The task results
	 */
	push(task, priority) {
		return this.__createPromise(task, priority);
	}
}
/**
 * The number of tasks available for running
 * @type {Number}
 */
TaskQueue.concurrency = 7;

const queue = new TaskQueue();

module.exports = queue;
