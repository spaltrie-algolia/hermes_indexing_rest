
const variants = [
  {
    "objID": "V60572CV018",
    "color": "Tan",
    "cur_rank": 1,
    "img": "https://assets.hermes.com/is/image/hermesproduct/60572CV018_front_wm_1",
    "rank": 1,
    "title": "Trait d'Hermès, Crayon de couleurs pour les lèvres, Beige Thé"
  },
  {
     "objID": "V60572CV040",
     "color": "PINK",
    "cur_rank": 2,
    "img": "https://assets.hermes.com/is/image/hermesproduct/crayon-de-couleurs-pour-les-levres-rose-lipstick--60572CV040-front-wm-1-0-0-800-800_g.jpg",
    "rank": 2,
    "title": "Trait d'Hermès, Crayon de couleurs pour les lèvres, Rose Lipstick"
  },
  {
     "objID": "V60572CV042",
    "color": "PINK",
    "cur_rank": 3,
    "img": "https://assets.hermes.com/is/image/hermesproduct/crayon-de-couleurs-pour-les-levres-rose-jaipur--60572CV042-front-wm-1-0-0-800-800_g.jpg",
    "rank": 3,
    "title": "Trait d'Hermès, Crayon de couleurs pour les lèvres, Rose Jaïpur"
  },
  {
     "objID": "V60572CV079",
    "color": "RED",
    "cur_rank": 4,
    "img": "https://assets.hermes.com/is/image/hermesproduct/crayon-de-couleurs-pour-les-levres-rouge-erable--60572CV079-front-wm-1-0-0-800-800_g.jpg",
    "rank": 4,
    "title": "Trait d'Hermès, Crayon de couleurs pour les lèvres, Rouge Érable"
  },
  {
     "objID": "V60572CV097",
    "color": "VIOLET",
    "cur_rank": 5,
    "img": "https://assets.hermes.com/is/image/hermesproduct/crayon-de-couleurs-pour-les-levres-pourpre-figue--60572CV097-front-wm-1-0-0-800-800_g.jpg",
    "rank": 5,
    "title": "Trait d'Hermès, Crayon de couleurs pour les lèvres, Pourpre Figue"
  }
];

const algoliasearch = require('algoliasearch');

const appID = "640GUGFBUQ";
const apiKey = "ccc2074c4b2d7d2a74924811ca55d2ce"
const indexNameRules = "hermes_variants_fr_FR_ungrouped_main_variant"
const indexName = "hermes_variants_fr_FR"
const defaultVariantsOrder = ["V60572CV018", "V60572CV040", "V60572CV042", "V60572CV079", "V60572CV097"];


async function getRuleData(ruleID) {
  const url = `https://${appID}.algolia.net/1/indexes/${indexNameRules}/rules/${ruleID}`;
  response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "x-algolia-application-id": appID,
      "x-algolia-api-key": apiKey,
    }
  });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    if (json.enabled !== true) {
     return null;
    }
    else {
     return json.consequence.promote;
    }
}

async function updateData() {
  resp = await getRuleData("qr-1734428522119");
  //console.log("resp", resp)
  updateQuery = []
  rank = 1
  let remainVariants = defaultVariantsOrder;
  if (resp != null) {
     // rule activated
     for (p of resp) {
        const pinObj = p.objectIDs[0];
        let updateObj = {
           objectID: pinObj,
           rank: p.position + 1
        };
        if (rank == 1) {
           new_var_diodes = variants.filter(e => e.objID !== pinObj);
           new_var_diodes.unshift(variants.filter(e => e.objID === pinObj)[0]);  
           updateObj.variants = new_var_diodes;
           console.log("new_var_diodes", new_var_diodes)          
        }
        updateQuery.push(updateObj);
        remainVariants = remainVariants.filter(e => e !== pinObj)
        //console.log('remainVariants', remainVariants)
        rank++;
     }
  } 
  else {
     console.log("go to default ranking")
  }
  // Manage the default order
  for (obj of remainVariants) {  
     let updateObj = {
        objectID: obj,
        rank: rank++
     };
     if (rank == 1) {
        updateObj.variants = variants;
        console.log("new_var_diodes", new_var_diodes)    
     }      
     updateQuery.push(updateObj)
  }

     
  console.log("updateQuery", updateQuery)
  const client = algoliasearch(appID, apiKey);
  const index = client.initIndex(indexName);

  return index.partialUpdateObjects(updateQuery, {
     createIfNotExists: false
  }).wait().then(res => {
    console.log("Task Completed!", res)
    return (res)
  });
      
}


exports.handler = async (event, context) => {
  msg = await updateData();
  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: msg
    })
  }
}