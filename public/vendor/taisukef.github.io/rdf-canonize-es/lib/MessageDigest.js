/*
 * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
 */

//const crypto = require('crypto');

import { SHA256 } from "https://taisukef.github.io/sha256-es/SHA256.js";
import { hex } from "https://code4sabae.github.io/js/hex.js";

export const hash = (s) => hex.fromBin(SHA256.digest(new TextEncoder().encode(s)));
class MessageDigest {
  /**
   * Creates a new MessageDigest.
   *
   * @param algorithm the algorithm to use.
   */
  constructor(algorithm) {
    if (algorithm != "sha256") {
      throw new Error("not supported: " + algorithm);
    }
    //this.md = crypto.createHash(algorithm);
    this.msg = "";
  }

  update(msg) { // !! todo: fix!
    //this.md.update(msg, 'utf8');
    this.msg += msg;
  }

  digest() {
    //return this.md.digest('hex');
    return hash(this.msg);
  }
};

export { MessageDigest };
