const mongoose = require('mongoose');
const Project = mongoose.model('projects')

module.exports = (app) => {
    // Get project details
    app.get('/api/getProject/:id', async (req,res) => {
        try{
            const projectID = req.params.id;
            let existingProject = await Project.findById(projectID);

            if (existingProject) return res.status(200).send(existingProject);
            return res.status(404).send({ resp : `Project ${projectID} not found` });

        }
        catch(error){
            return res.status(500).send({ resp : error });
        }
    })

    // Update project details.
    // BODY : Pass JSON with the project's document fields you wish to change.
    app.post('/api/updateProject/:id', async (req,res) => {
        try{
            const projectID = req.params.id;
            await Project.findByIdAndUpdate(projectID, { ...req.body }, (err,doc) => {
                if (err) return res.status(500).send({ resp : "Error in query, check fields!", error : err });
                if (doc) return res.status(200).send({ resp : doc });
                return res.status(404).send(({ resp : `Project ${projectID} not found`}));
            });
        }
        catch(error){
            return;
        }
    })

    // Delete project
    app.delete('/api/deleteProject/:id', async (req,res) => {
        try {
            const projectID = req.params.id;
            await Project.findByIdAndDelete(projectID, {}, (err,doc) => {
                if (err) return res.status(500).send({ resp : "Error in query, check fields!", error : err });
                if (doc) return res.status(200).send({ resp : doc });
                return res.status(404).send(({ resp : `Project ${projectID} not found`}));
            });
        }
        catch(error) {
            return res.status(500).send({ resp : error });
        }
    })

    // Add new project. Post data format:
    /**
     * {
     *  title : String, <- REQUIRED
     *  owner : String, <- REQUIRED, id of creator
     *  contributors : [String], <- id of non-creator contributors
     *  description : String,
     * }
     */

    app.post('/api/addProject', async (req,res) => {
        try{
            await new Project(req.body).save(
                (err, doc) => {
                    if (err) return res.status(500).send({ resp : err });
                    return res.status(200).send({ resp : doc });
                }
            );
        }
        catch(error){
            return res.status(500).send({ resp : error });
        }
    });
}