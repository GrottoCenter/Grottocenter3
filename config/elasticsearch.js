const elasticsearch = require('elasticsearch');

let client = {};

if(process.env.NODE_ENV === 'demo') {
  client = new elasticsearch.Client({
    host: process.env.ES_HOST,
    log: 'trace'
  });
} else if(process.env.NODE_ENV === 'production') {
  client = new elasticsearch.Client({
    host: process.env.ES_HOST,
    log: 'error'
  });
} else {
  // In dev, we don't use a container for the server. So we don't have access to elasticsearchgrotto.
  client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });
}

module.exports.elasticsearchCli = client;