import { Stats } from 'fs';

/**
 * Constants (defined in `stat.h`).
 */
const S_IFMT = 61440;   /* 0170000 type of file */
const S_IFIFO = 4096;   /* 0010000 named pipe (fifo) */
const S_IFCHR = 8192;   /* 0020000 character special */
const S_IFDIR = 16384;  /* 0040000 directory */
const S_IFBLK = 24576;  /* 0060000 block special */
const S_IFREG = 32768;  /* 0100000 regular */
const S_IFLNK = 40960;  /* 0120000 symbolic link */
const S_IFSOCK = 49152; /* 0140000 socket */
const S_IFWHT = 57344;  /* 0160000 whiteout */
const S_ISUID = 2048;   /* 0004000 set user id on execution */
const S_ISGID = 1024;   /* 0002000 set group id on execution */
const S_ISVTX = 512;    /* 0001000 save swapped text even after use */
const S_IRUSR = 256;    /* 0000400 read permission, owner */
const S_IWUSR = 128;    /* 0000200 write permission, owner */
const S_IXUSR = 64;     /* 0000100 execute/search permission, owner */
const S_IRGRP = 32;     /* 0000040 read permission, group */
const S_IWGRP = 16;     /* 0000020 write permission, group */
const S_IXGRP = 8;      /* 0000010 execute/search permission, group */
const S_IROTH = 4;      /* 0000004 read permission, others */
const S_IWOTH = 2;      /* 0000002 write permission, others */
const S_IXOTH = 1;      /* 0000001 execute/search permission, others */

function createMode(stat?: number | createMode.StatsMode) {
	return new createMode.Mode(stat);
}

namespace createMode {
	export type StatsMode = Pick<Stats, 'mode'>;

	export function isStatsMode(v: any): v is StatsMode {
		return v && typeof v.mode === 'number';
	}

	export class RWX {
		protected static r: number;
		protected static w: number;
		protected static x: number;
		private stat: StatsMode;

		constructor(stat: StatsMode) {
			this.stat = stat;
		}

		public get read(): boolean {
			return Boolean(this.stat.mode & (this.constructor as typeof RWX).r);
		}
		public set read(v: boolean) {
			if (v) {
				this.stat.mode |= (this.constructor as typeof RWX).r;
			} else {
				this.stat.mode &= ~(this.constructor as typeof RWX).r;
			}
		}

		public get write(): boolean {
			return Boolean(this.stat.mode & (this.constructor as typeof RWX).w);
		}
		public set write(v: boolean) {
			if (v) {
				this.stat.mode |= (this.constructor as typeof RWX).w;
			} else {
				this.stat.mode &= ~(this.constructor as typeof RWX).w;
			}
		}

		public get execute(): boolean {
			return Boolean(this.stat.mode & (this.constructor as typeof RWX).x);
		}
		public set execute(v: boolean) {
			if (v) {
				this.stat.mode |= (this.constructor as typeof RWX).x;
			} else {
				this.stat.mode &= ~(this.constructor as typeof RWX).x;
			}
		}
	}

	export class Owner extends RWX {
		protected static r = S_IRUSR;
		protected static w = S_IWUSR;
		protected static x = S_IXUSR;
	}

	export class Group extends RWX {
		protected static r = S_IRGRP;
		protected static w = S_IWGRP;
		protected static x = S_IXGRP;
	}

	export class Others extends RWX {
		protected static r = S_IROTH;
		protected static w = S_IWOTH;
		protected static x = S_IXOTH;
	}

	export class Mode {
		public owner: Owner;
		public group: Group;
		public others: Others;
		private stat: StatsMode;

		constructor(stat?: number | StatsMode) {
			if (typeof stat === 'number') {
				this.stat = { mode: stat };
			} else if (isStatsMode(stat)) {
				this.stat = stat;
			} else {
				this.stat = { mode: 0 };
			}
			this.owner = new Owner(this.stat);
			this.group = new Group(this.stat);
			this.others = new Others(this.stat);
		}

		private checkModeProperty(property: number, set?: boolean) {
			const { mode } = this.stat;
			if (set) {
				this.stat.mode = ((mode | S_IFMT) & property) | (mode & ~S_IFMT);
			}
			return (mode & S_IFMT) === property;
		}

		public isDirectory(v?: boolean) {
			return this.checkModeProperty(S_IFDIR, v);
		}

		public isFile(v?: boolean) {
			return this.checkModeProperty(S_IFREG, v);
		}

		public isBlockDevice(v?: boolean) {
			return this.checkModeProperty(S_IFBLK, v);
		}

		public isCharacterDevice(v?: boolean) {
			return this.checkModeProperty(S_IFCHR, v);
		}

		public isSymbolicLink(v?: boolean) {
			return this.checkModeProperty(S_IFLNK, v);
		}

		public isFIFO(v?: boolean) {
			return this.checkModeProperty(S_IFIFO, v);
		}

		public isSocket(v?: boolean) {
			return this.checkModeProperty(S_IFSOCK, v);
		}

		/**
		 * Returns an octal representation of the `mode`, eg. "0754".
		 *
		 * http://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation
		 *
		 * @return {String}
		 * @api public
		 */
		public toOctal(): string {
			const octal = this.stat.mode & 4095 /* 07777 */;
			return `0000${octal.toString(8)}`.slice(-4);
		}

		/**
		 * Returns a String representation of the `mode`.
		 * The output resembles something similar to what `ls -l` would output.
		 *
		 * http://en.wikipedia.org/wiki/Unix_file_types
		 *
		 * @return {String}
		 * @api public
		 */
		public toString(): string {
			const str = [];

			// file type
			if (this.isDirectory()) {
				str.push('d');
			} else if (this.isFile()) {
				str.push('-');
			} else if (this.isBlockDevice()) {
				str.push('b');
			} else if (this.isCharacterDevice()) {
				str.push('c');
			} else if (this.isSymbolicLink()) {
				str.push('l');
			} else if (this.isFIFO()) {
				str.push('p');
			} else if (this.isSocket()) {
				str.push('s');
			} else {
				const mode = this.valueOf();
				const err = new TypeError(`Unexpected "file type": mode=${  mode}`);
				//err.stat = this.stat;
				//err.mode = mode;
				throw err;
			}

			// owner read, write, execute
			str.push(this.owner.read ? 'r' : '-');
			str.push(this.owner.write ? 'w' : '-');
			if (this.setuid) {
				str.push(this.owner.execute ? 's' : 'S');
			} else {
				str.push(this.owner.execute ? 'x' : '-');
			}

			// group read, write, execute
			str.push(this.group.read ? 'r' : '-');
			str.push(this.group.write ? 'w' : '-');
			if (this.setgid) {
				str.push(this.group.execute ? 's' : 'S');
			} else {
				str.push(this.group.execute ? 'x' : '-');
			}

			// others read, write, execute
			str.push(this.others.read ? 'r' : '-');
			str.push(this.others.write ? 'w' : '-');
			if (this.sticky) {
				str.push(this.others.execute ? 't' : 'T');
			} else {
				str.push(this.others.execute ? 'x' : '-');
			}

			return str.join('');
		}

		public valueOf(): number {
			return this.stat.mode;
		}

		get setuid(): boolean {
			return Boolean(this.stat.mode & S_ISUID);
		}
		set setuid(v: boolean) {
			if (v) {
				this.stat.mode |= S_ISUID;
			} else {
				this.stat.mode &= ~S_ISUID;
			}
		}

		get setgid(): boolean {
			return Boolean(this.stat.mode & S_ISGID);
		}
		set setgid(v: boolean) {
			if (v) {
				this.stat.mode |= S_ISGID;
			} else {
				this.stat.mode &= ~S_ISGID;
			}
		}

		get sticky(): boolean {
			return Boolean(this.stat.mode & S_ISVTX);
		}
		set sticky(v: boolean) {
			if (v) {
				this.stat.mode |= S_ISVTX;
			} else {
				this.stat.mode &= ~S_ISVTX;
			}
		}
	}

	// So that `instanceof` checks work as expected
	createMode.prototype = Mode.prototype;
}

export = createMode;
