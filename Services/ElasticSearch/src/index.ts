import { Client } from "elasticsearch";
import * as zmq from "zeromq";
import axios from "axios";

const ELASTIC_SEARCH_ENDPOINT = "http://search-cluster-ip-service:9200";
const PROJECT_INDEX = "projects";
const ZERO_MQ_ENDPOINT = "tcp://dbhelper-cluster-ip-service:3000";
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
      // console.log(error);
    } else {
      console.log("created a new index", response);
    }
  }
);

const populateElasticSearch = async () => {
  let response = await axios.get(`http://dbhelper-cluster-ip-service:5555/api/getProjects`);
  console.log(JSON.stringify(response.data));
  return response.data.map((item) => {
    // console.log(item);
    client.index(
      {
        index: PROJECT_INDEX,
        id: item._id,
        type: PROJECT_INDEX,
        body: {
          title: item.title,
          descriptions: item.description,
          comments: item.comments,
        },
      },
      (err: any, resp: any) => {
        // console.log(err);
      }
    );
    return;
  });
};
populateElasticSearch();

async function run() {
  const sock = new zmq.Subscriber();
  console.log("RUNNING inside zmq");

  sock.connect(ZERO_MQ_ENDPOINT);
  sock.subscribe(ZERO_MQ_TOPIC);

  for await (const [topic, msg] of sock) {
    var buf = msg.toString();
    const json = JSON.parse(buf);
    console.log(json);
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
        // console.log(err);
      }
    );
  }
}

run();
