/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */

import graphTypes from "./graphTypes.js";
import nodeMap from "./nodeMap.js";

const _isSubjectReference = graphTypes.isSubjectReference;
const _createMergedNodeMap = nodeMap.createMergedNodeMap;

const api = {};

/**
 * Performs JSON-LD flattening.
 *
 * @param input the expanded JSON-LD to flatten.
 *
 * @return the flattened output.
 */
api.flatten = input => {
  const defaultGraph = _createMergedNodeMap(input);

  // produce flattened output
  const flattened = [];
  const keys = Object.keys(defaultGraph).sort();
  for(let ki = 0; ki < keys.length; ++ki) {
    const node = defaultGraph[keys[ki]];
    // only add full subjects to top-level
    if(!_isSubjectReference(node)) {
      flattened.push(node);
    }
  }
  return flattened;
};

const flatten = api.flatten;
export { flatten };

