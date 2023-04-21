/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const XSD = 'http://www.w3.org/2001/XMLSchema#';

// TODO = Deprecated and will be removed later. Use LINK_HEADER_CONTEXT.
const LINK_HEADER_REL = 'http://www.w3.org/ns/json-ld#context';

const LINK_HEADER_CONTEXT = 'http://www.w3.org/ns/json-ld#context';

const RDF_LIST = RDF + 'List';
const RDF_FIRST = RDF + 'first';
const RDF_REST = RDF + 'rest';
const RDF_NIL = RDF + 'nil';
const RDF_TYPE = RDF + 'type';
const RDF_PLAIN_LITERAL = RDF + 'PlainLiteral';
const RDF_XML_LITERAL = RDF + 'XMLLiteral';
const RDF_JSON_LITERAL = RDF + 'JSON';
const RDF_OBJECT = RDF + 'object';
const RDF_LANGSTRING = RDF + 'langString';

const XSD_BOOLEAN = XSD + 'boolean';
const XSD_DOUBLE = XSD + 'double';
const XSD_INTEGER = XSD + 'integer';
const XSD_STRING = XSD + 'string';

export {
  LINK_HEADER_CONTEXT,
  RDF_LIST,
  RDF_FIRST,
  RDF_REST,
  RDF_NIL,
  RDF_TYPE,
  RDF_PLAIN_LITERAL,
  RDF_XML_LITERAL,
  RDF_JSON_LITERAL,
  RDF_OBJECT,
  RDF_LANGSTRING,
  XSD_BOOLEAN,
  XSD_DOUBLE,
  XSD_INTEGER,
  XSD_STRING,
};
