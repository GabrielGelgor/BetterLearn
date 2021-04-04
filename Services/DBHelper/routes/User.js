const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = mongoose.model("users");

// Get user profile
router.get("/api/getUser/:id", async (req, res) => {
  try {
    const userID = req.params.id; // Call database to check for the user
    await User.findOne({ id: userID }, (err, doc) => {
      if (err) return res.status(500).send({ resp: err });
      if (doc) return res.status(200).send(doc);
      return res.status(404).send({ resp: `User ${userID} not found` });
    });
  } catch (error) {
    return;
  }
});

// Update user profile
// BODY : Pass JSON with the fields you wish to update and their new vals. Remember, user ID is immutable
router.post("/api/updateUser/:id", async (req, res) => {
  try {
    const userID = req.params.id;
    await User.findOneAndUpdate(
      { id: userID },
      { ...req.body },
      { new: true },
      (err, doc) => {
        if (err) return res.status(500).send({ resp: err });
        if (doc) return res.status(200).send({ resp: doc });
        return res.status(404).send({ resp: `User ${userID} not found` });
      }
    );
  } catch (error) {
    return;
  }
});

// Delete user profile
router.delete("/api/deleteUser/:id", async (req, res) => {
  try {
    const userID = req.params.id;
    await User.findOneAndDelete({ id: userID }, (doc, err) => {
      if (err) return res.status(500).send({ resp: err });
      if (doc) return res.status(200).send({ resp: doc });
      return res.status(404).send({ resp: `User ${userID} not found` });
    });
  } catch (error) {
    return;
  }
});

// Add user profile
// With the new user page, you pass forward the following information:
/**
 * {
 *  id, <- REQUIRED
 *  userName, <- REQUIRED
 *  techs (string array of technologies chosen),
 *  bio (string, user bio)
 * }
 */
router.post("/api/addUser", async (req, res) => {
  try {
    await new User(req.body).save(
      // Insert the new User. Mongoose model handles validation.
      (err, doc) => {
        if (err) return res.status(500).send({ resp: err });
        return res.status(200).send({ resp: doc });
      }
    );
  } catch (error) {
    return;
  }
});

module.exports.router = router;
