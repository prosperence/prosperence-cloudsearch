// This script indexes documents in Cloudsearch.
var csd = require(__dirname +'/cloudsearchifyDocuments.js');
var cloudsearchdomain = require(__dirname + "/../config/endpoints").cloudsearchdomain;
var request = require('request');
var api = "http://www.khanacademy.org/api/v1/";
var slug = "topic/core-finance";

var count = 0;
exports.indexDocuments = function(data) {
  var params = {
    contentType: 'application/json',

    // clean document data before indexing
    documents: csd.cloudsearchifyDocuments(data)
  };

  // send documents to be indexed into prosperence-cloudsearch domain
  return cloudsearchdomain.uploadDocuments(params, function(err, data) {
    if(err) {
      console.log(err, err.stack);
    }
    else {
      count += data.adds;
      console.log(count + " documents indexed!");
    }
  });
};

var recurse = function(newSlug){
  slug = newSlug || slug;

  var options = {
    "url": api + slug,
    "json": true
  };

  // make request to Khan Academy api to fetch all tutorials in core-finance section
  request(options, function(error, message, response){

    if(!error){
      // if response not array, make it an array
      if(!Array.isArray(response)){
        response = [response];
      }

      // response will be returned as an array of records, so iterate
      for(var i=0;i<response.length;i++){
        var record = response[i];
        i++;

        // if response object has sub topics (children), iterate over children
        if(record.children){
          record.children.forEach(function(child){

            // call recurse method on child slugs
            if(child.kind === "Video"){
              recurse("videos/" + child.id);
            } else {
              recurse("topic/" + child.id);
            }
          });
        }

        // if response object has YouTube video attached to it, index each record individually
        if(record.youtube_id){
          exports.indexDocuments(record);
        }
      }
    } else {
      console.log(error);
    }
  });
};

recurse();



