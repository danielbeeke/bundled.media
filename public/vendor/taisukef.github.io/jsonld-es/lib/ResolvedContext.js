/*
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import { LRUCache as LRU } from "https://taisukef.github.io/lru-cache-es/LRUCache.js";

const MAX_ACTIVE_CONTEXTS = 10;

class ResolvedContext {
  /**
   * Creates a ResolvedContext.
   *
   * @param document the context document.
   */
  constructor({document}) {
    this.document = document;
    // TODO: enable customization of processed context cache
    // TODO: limit based on size of processed contexts vs. number of them
    this.cache = new LRU({max: MAX_ACTIVE_CONTEXTS});
  }

  getProcessed(activeCtx) {
    return this.cache.get(activeCtx);
  }

  setProcessed(activeCtx, processedCtx) {
    this.cache.set(activeCtx, processedCtx);
  }
};

export { ResolvedContext };
