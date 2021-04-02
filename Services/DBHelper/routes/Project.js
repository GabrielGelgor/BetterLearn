const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Project = mongoose.model("projects");

const zmq = require("zeromq");
const sock = new zmq.Publisher();

sock.bind("tcp://127.0.0.1:3000");
console.log("Publisher bound to port 3000");

const elasticsearch = require("elasticsearch");
const client = new elasticsearch.Client({
  hosts: ["http://search-cluster-ip-service:9200"],
});
const PROJECT_INDEX = "projects";

router.get("/api/getProjects", async (req, res) => {
  try {
    const projects = await Project.find({});
    return res.status(200).send(projects);
  } catch (error) {
    return;
  }
});

// Get project details. id is the id of the document.
router.get("/api/getProject/:id", async (req, res) => {
  try {
    const projectID = req.params.id;
    await Project.findById(projectID, (err, doc) => {
      if (err) return res.status(500).send({ resp: err });
      if (doc) return res.status(200).send(doc);
      return res.status(404).send({ resp: `Project ${projectID} not found` });
    });
  } catch (error) {
    return;
  }
});

// Update project details.
// BODY : Pass JSON with the project's document fields you wish to change.
router.post("/api/updateProject/:id", async (req, res) => {
  try {
    const projectID = req.params.id;
    await Project.findByIdAndUpdate(projectID, { ...req.body }, (err, doc) => {
      if (err)
        return res
          .status(500)
          .send({ resp: "Error in query, check fields!", error: err });
      if (doc) return res.status(200).send({ resp: doc });
      return res.status(404).send({ resp: `Project ${projectID} not found` });
    });
  } catch (error) {
    return;
  }
});

// Delete project
router.delete("/api/deleteProject/:id", async (req, res) => {
  try {
    const projectID = req.params.id;
    await Project.findByIdAndDelete(projectID, (err, doc) => {
      if (err)
        return res
          .status(500)
          .send({ resp: "Error in query, check fields!", error: err });
      if (doc) return res.status(200).send({ resp: doc });
      return res.status(404).send({ resp: `Project ${projectID} not found` });
    });
  } catch (error) {
    return;
  }
});

// Add new project. Post data format:
/**
 * {
 *  title : String, <- REQUIRED
 *  owner : String, <- REQUIRED, id of creator
 *  contributors : [String], <- id of non-creator contributors
 *  description : String,
 * }
 */
// Note that the addition of the project and the updating of the user profile should be done separate. Make sure to do that!

router.post("/api/addProject", async (req, res) => {
  try {
    let exists = await new Project(req.body).save(async (err, doc) => {
      if (err) return res.status(500).send({ resp: err });
      await sock.send(["POSTS", JSON.stringify(doc)]);
      console.log("sending a multipart message envelope");
      return res.status(200).send({ resp: doc });
    });
  } catch (error) {
    return;
  }
});

router.get("/search", async (req, res) => {
  const search = req.body.q;
  console.log(search);

  client
    .search({ index: PROJECT_INDEX, q: search, type: PROJECT_INDEX })
    .then((results) => {
      // console.log(JSON.stringify(results, null, 2));
      res.send(results);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports.router = router;
