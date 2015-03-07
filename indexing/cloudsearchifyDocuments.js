// This script expects an array of json objects.
// It 1) adds id and type fields to each object, since Cloudsearch expects all JSON objects to have these fields, and
// 2) converts any value fields that are of type "object" to type string, since Cloudsearch cannot index json objects as field values.
var uuid = require('node-uuid');

exports.cloudsearchifyDocuments = function(khanDocument, categories) {
  var csAllDocuments = [];
  var document = {};

  document.relative_url = khanDocument.relative_url;
  document.keywords = khanDocument.keywords;
  document.ka_url = khanDocument.ka_url;
  document.duration = khanDocument.duration;
  document.title = khanDocument.title;
  document.description = khanDocument.description;
  document.node_slug = khanDocument.node_slug;
  document.url = khanDocument.url;
  document.image_url = khanDocument.image_url;
  document.youtube_id = khanDocument.youtube_id;

  // create category array literal field by splitting subdomains of video url
  document.category = categories.split("/");

  // add type and id to very document to index, as required by Cloudsearch.
  // generate random unique hash for each id
  var csDocument = {
    "type": "add",

    // set arbitrary unique id
    "id": uuid.v4()
  };

  csDocument["fields"] = document;
  csAllDocuments.push(csDocument);

  return JSON.stringify(csAllDocuments);
};
