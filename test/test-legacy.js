let assert = require('assert');
let Mode = require('../src');

describe('stat-mode (JavaScript)', function() {
	it('should export the `Mode` constructor', function() {
		assert.equal('function', typeof Mode);
		assert.equal('createMode', Mode.name);
	});

	describe('Mode', function() {
		it('should return a `Mode` instance with `new`', function() {
			let m = new Mode();
			assert(m instanceof Mode);
		});

		it('should return a `Mode` instance without `new`', function() {
			let m = Mode();
			assert(m instanceof Mode);
		});

		[
			{
				mode: 33188 /* 0100644 */,
				octal: '0644',
				string: '-rw-r--r--',
				type: 'file'
			},
			{
				mode: 16877 /* 040755 */,
				octal: '0755',
				string: 'drwxr-xr-x',
				type: 'directory'
			},
			{
				mode: 16832 /* 040700 */,
				octal: '0700',
				string: 'drwx------',
				type: 'directory'
			},
			{
				mode: 41325 /* 0120555 */,
				octal: '0555',
				string: 'lr-xr-xr-x',
				type: 'symbolicLink'
			},
			{
				mode: 8592 /* 020620 */,
				octal: '0620',
				string: 'crw--w----',
				type: 'characterDevice'
			},
			{
				mode: 24960 /* 060600 */,
				octal: '0600',
				string: 'brw-------',
				type: 'blockDevice'
			},
			{
				mode: 4516 /* 010644 */,
				octal: '0644',
				string: 'prw-r--r--',
				type: 'FIFO'
			}
		].forEach(function(test) {
			let m = new Mode(test);
			let isFn =
				`is${  test.type[0].toUpperCase()  }${test.type.substring(1)}`;
			let strMode = m.toString();
			let opposite = test.type == 'file' ? 'isDirectory' : 'isFile';
			let first = test.type == 'file' ? 'd' : '-';
			describe(`input: 0${  test.mode.toString(8)}`, function() {
				describe('#toString()', function() {
					it(`should equal "${  test.string  }"`, function() {
						assert.equal(m.toString(), test.string);
					});
				});
				describe('#toOctal()', function() {
					it(`should equal "${  test.octal  }"`, function() {
						assert.equal(m.toOctal(), test.octal);
					});
				});
				describe(`#${  isFn  }()`, function() {
					it(`should return \`true\` for #${  isFn  }()`, function() {
						assert.ok(m[isFn]());
					});
					it(
						`should remain "${
							strMode
							}" after #${
							isFn
							}(true) (gh-2)`,
						function() {
							assert.equal(true, m[isFn](true));
							assert.equal(strMode, m.toString());
						}
					);
				});
				describe(`#${  opposite  }(true)`, function() {
					it(
						`should return \`false\` for \`#${  opposite  }(true)\``,
						function() {
							assert.equal(false, m[opposite](true));
						}
					);
					it(
						`should be "${
							first
							}${m.toString().substring(1)
							}" after #${
							opposite
							}(true) (gh-2)`,
						function() {
							assert.equal(
								first + m.toString().substring(1),
								m.toString()
							);
						}
					);
				});
			});
		});
	});
});
