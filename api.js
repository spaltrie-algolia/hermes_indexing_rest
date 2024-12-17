exports.handler = async (event, context) => {
   if (event.httpMethod === 'GET') {
     try {
       // Process the GET request as needed
       //const data = require('./db.json');
 
       return {
         statusCode: 200,
         body: JSON.stringify({'objectID':'1234'}),
       };
     } catch (error) {
       // Return an error response if there was an issue processing the request
       return {
         statusCode: 500,
         body: JSON.stringify({ error: 'Failed to process GET request' }),
       };
     }
   }
 };