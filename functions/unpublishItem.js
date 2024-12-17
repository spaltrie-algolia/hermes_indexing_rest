
const algoliasearch = require('algoliasearch');

const appID = "640GUGFBUQ";
const apiKey = "ccc2074c4b2d7d2a74924811ca55d2ce"
const indexNameRules = "hermes_variants_fr_FR_ungrouped_main_variant"
const indexName = "hermes_variants_fr_FR"
const defaultVariantsOrder = ["V60572CV018", "V60572CV040", "V60572CV042", "V60572CV079", "V60572CV097"];

async function updateData(objectID) {
      const client = algoliasearch(appID, apiKey);
      const index = client.initIndex(indexName);
      return index.partialUpdateObject({
        "objectID": objectID,
        "is_visible": false
      }, {
        createIfNotExists: false
     }).wait().then(res => {
       console.log("Task Completed!", res)
       return (res)
     });
}


exports.handler = async (event, context) => {
  console.log("event", event)
  params = event.queryStringParameters
  console.log("params.id", params.id)

  msg = await updateData(params.id);
  return {
    statusCode: 200,
    body: JSON.stringify({
      task: "UNpublished Item => " + params.id,
      msg: msg
    }, null, 4)
  }
  
}