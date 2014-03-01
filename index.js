
/**
 * Module exports.
 */

module.exports = Mode;

/**
 * Constants (defined in `stat.h`).
 */

var S_IFMT = 61440;   /* 0170000 type of file */
var S_IFIFO = 4096;   /* 0010000 named pipe (fifo) */
var S_IFCHR = 8192;   /* 0020000 character special */
var S_IFDIR = 16384;  /* 0040000 directory */
var S_IFBLK = 24576;  /* 0060000 block special */
var S_IFREG = 32768;  /* 0100000 regular */
var S_IFLNK = 40960;  /* 0120000 symbolic link */
var S_IFSOCK = 49152; /* 0140000 socket */
var S_IFWHT = 57344;  /* 0160000 whiteout */
var S_ISUID = 2048;   /* 0004000 set user id on execution */
var S_ISGID = 1024;   /* 0002000 set group id on execution */
var S_ISVTX = 512;    /* 0001000 save swapped text even after use */
var S_IRUSR = 256;    /* 0000400 read permission, owner */
var S_IWUSR = 128;    /* 0000200 write permission, owner */
var S_IXUSR = 64;     /* 0000100 execute/search permission, owner */
var S_IRGRP = 32;     /* 0000040 read permission, group */
var S_IWGRP = 16;     /* 0000020 write permission, group */
var S_IXGRP = 8;      /* 0000010 execute/search permission, group */
var S_IROTH = 4;      /* 0000004 read permission, others */
var S_IWOTH = 2;      /* 0000002 write permission, others */
var S_IXOTH = 1;      /* 0000001 execute/search permission, others */

/**
 * `Mode` class.
 *
 * @param {fs.Stat} stat a "stat" object (anything with a `mode` Number property)
 * @api public
 */

function Mode (stat) {
  if (!(this instanceof Mode)) return new Mode(stat);
  if (!stat) throw new TypeError('must pass in a "stat" object');
  if ('number' != typeof stat.mode) stat.mode = 0;
  this.stat = stat;
  this.owner = new Owner(stat);
  this.group = new Group(stat);
  this.others = new Others(stat);
}

/**
 * Returns the Number value of the `mode`.
 *
 * @return {Number}
 * @api public
 */

Mode.prototype.valueOf = function () {
  return this.stat.mode;
};

Mode.prototype._checkModeProperty = function (property, set) {
  if (set) {
    this.stat.mode = (this.stat.mode | S_IFMT) & property;
  }
  return (this.stat.mode & S_IFMT) === property;
};

Mode.prototype.isDirectory = function (v) {
  return this._checkModeProperty(S_IFDIR, v);
};

Mode.prototype.isFile = function (v) {
  return this._checkModeProperty(S_IFREG, v);
};

Mode.prototype.isBlockDevice = function (v) {
  return this._checkModeProperty(S_IFBLK, v);
};

Mode.prototype.isCharacterDevice = function (v) {
  return this._checkModeProperty(S_IFCHR, v);
};

Mode.prototype.isSymbolicLink = function (v) {
  return this._checkModeProperty(S_IFLNK, v);
};

Mode.prototype.isFIFO = function (v) {
  return this._checkModeProperty(S_IFIFO, v);
};

Mode.prototype.isSocket = function (v) {
  return this._checkModeProperty(S_IFSOCK, v);
};

function Owner (stat) {
  define(this, 'read',
    function () {
      return Boolean(stat.mode & S_IRUSR);
    },
    function (v) {
      if (v) {
        stat.mode |= S_IRUSR;
      } else {
        stat.mode &= ~S_IRUSR;
      }
    }
  );
  define(this, 'write',
    function () {
      return Boolean(stat.mode & S_IWUSR);
    },
    function (v) {
      if (v) {
        stat.mode |= S_IWUSR;
      } else {
        stat.mode &= ~S_IWUSR;
      }
    }
  );
  define(this, 'execute',
    function () {
      return Boolean(stat.mode & S_IXUSR);
    },
    function (v) {
      if (v) {
        stat.mode |= S_IXUSR;
      } else {
        stat.mode &= ~S_IXUSR;
      }
    }
  );
}

function Group (stat) {
  define(this, 'read',
    function () {
      return Boolean(stat.mode & S_IRGRP);
    },
    function (v) {
      if (v) {
        stat.mode |= S_IRGRP;
      } else {
        stat.mode &= ~S_IRGRP;
      }
    }
  );
  define(this, 'write',
    function () {
      return Boolean(stat.mode & S_IWGRP);
    },
    function (v) {
      if (v) {
        stat.mode |= S_IWGRP;
      } else {
        stat.mode &= ~S_IWGRP;
      }
    }
  );
  define(this, 'execute',
    function () {
      return Boolean(stat.mode & S_IXGRP);
    },
    function (v) {
      if (v) {
        stat.mode |= S_IXGRP;
      } else {
        stat.mode &= ~S_IXGRP;
      }
    }
  );
}

function Others (stat) {
  define(this, 'read',
    function () {
      return Boolean(stat.mode & S_IROTH);
    },
    function (v) {
      if (v) {
        stat.mode |= S_IROTH;
      } else {
        stat.mode &= ~S_IROTH;
      }
    }
  );
  define(this, 'write',
    function () {
      return Boolean(stat.mode & S_IWOTH);
    },
    function (v) {
      if (v) {
        stat.mode |= S_IWOTH;
      } else {
        stat.mode &= ~S_IWOTH;
      }
    }
  );
  define(this, 'execute',
    function () {
      return Boolean(stat.mode & S_IXOTH);
    },
    function (v) {
      if (v) {
        stat.mode |= S_IXOTH;
      } else {
        stat.mode &= ~S_IXOTH;
      }
    }
  );
}

function define (obj, name, get, set) {
  Object.defineProperty(obj, name, {
    enumerable: true,
    configurable: true,
    get: get,
    set: set
  });
}