import assert from 'assert';
import createMode, { Mode } from '../src';

describe('stat-mode (TypeScript)', () => {
	describe('default export', () => {
		it('should be a function named "createMode()"', () => {
			assert.equal('function', typeof createMode);
			assert.equal('createMode', createMode.name);
		});
		it('should create a `Mode` instance without `new`', () => {
			const m = createMode();
			assert(m instanceof Mode);
			assert(m instanceof createMode);
		});
	});

	describe('Mode', () => {
		it('should export the `Mode` constructor', () => {
			assert.equal('function', typeof Mode);
			assert.equal('Mode', Mode.name);
		});
		it('should create a `Mode` instance with `new`', () => {
			const m = new Mode();
			assert(m instanceof Mode);
			assert(m instanceof createMode);
		});
	});
});
