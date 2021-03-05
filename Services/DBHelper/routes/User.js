const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app) => {
    // Get user profile
    app.get('/api/getUser/:id', async (req,res) => {
        try { 
            const userID = req.params.id;                                       // Call database to check for the user
            let existingUser = await User.findOne({ id : userID });

            if (existingUser){                                                  // Check if user exists
                return res.status(200).send(existingUser);
            }
            
            res.status(404).send({ resp : "User not found"});                   // If not, send 404
        }
        catch(error){
            return res.status(404).send({ resp : error });                             
        }
    })

    // Update user profile
    // BODY : Pass JSON with the fields you wish to update and their new vals. Remember, user ID is immutable
    app.post('/api/updateUser/:id', async (req,res) => {        
        try{
            const userID = req.params.id;
            let existingUser = await User.findOne({ id : userID });             // Check for existing document

            if (existingUser){
                await User.findOneAndUpdate({ id : userID }, { ...req.body }, { upsert : true }, (err, doc) => {
                    if (err) return res.status(500).send({ resp : err });       // If it exists, apply update
                    return res.status(200).send({ resp : doc });
                });
                return;
            }

            return res.status(404).send({ resp : `User ${userID} not found` }); // If not, return 404
        }
        catch(error){
            return;//res.status(500).send({ resp : error });
        }
    })

    // Delete user profile
    app.delete('/api/deleteUser/:id', async (req,res) => {
        try{
            const userID = req.params.id;
            let existingUser = await User.findOneAndDelete({ id : userID });    // Find and delete the user.

            if (existingUser){
                return res.status(200).send({ resp : "OK" });
            }

            res.status(404).send({ resp : `User ${userID} not found`});         // User not found
        }
        catch (error) {
            res.status(500).send({ resp : error });
        }
    })

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
    app.post('/api/addUser', async (req,res) => {
        try{
            await new User(req.body).save(                                      // Insert the new User. Mongoose model handles validation.
                (err,doc) => {
                    if (err) return res.status(500).send({ resp : err });
                    return res.status(200).send({ resp : doc });
                }
            );
        }
        catch(error){
            return;//res.status(500).send({ resp : error });
        }
    })

}