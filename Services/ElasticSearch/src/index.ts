import { Client } from "elasticsearch";
import * as zmq from "zeromq";

const ELASTIC_SEARCH_ENDPOINT = "http://localhost:9200";
const PROJECT_INDEX = "projects";
const ZERO_MQ_ENDPOINT = "tcp://127.0.0.1:3000";
const ZERO_MQ_TOPIC = "POSTS";

const client = new Client({
  hosts: [ELASTIC_SEARCH_ENDPOINT],
});

client.ping(
  {
    requestTimeout: 30000,
  },
  function (error) {
    // at this point, eastic search is down, please check your Elasticsearch service
    if (error) {
      console.error("Elasticsearch cluster is down!");
    } else {
      console.log("Everything is ok");
    }
  }
);

client.indices.create(
  {
    index: PROJECT_INDEX,
  },
  function (error, response, status) {
    if (error) {
      console.log(error);
    } else {
      console.log("created a new index", response);
    }
  }
);

// client
// .search({ index: PROJECT_INDEX, q: "testSearching", type: PROJECT_INDEX })
// .then((results) => {
//   console.log(JSON.stringify(results, null, 2));
// })
// .catch((err) => {
//   console.log(err);
// });

async function run() {
  const sock = new zmq.Subscriber();

  sock.connect(ZERO_MQ_ENDPOINT);
  sock.subscribe(ZERO_MQ_TOPIC);

  for await (const [topic, msg] of sock) {
    var buf = msg.toString();
    const json = JSON.parse(buf);
    client.index(
      {
        index: PROJECT_INDEX,
        id: json._id,
        type: PROJECT_INDEX,
        body: {
          title: json.title,
          descriptions: json.description,
          comments: json.comments,
        },
      },
      (err: any, resp: any) => {
        console.log(err);
      }
    );
  }
}

run();
