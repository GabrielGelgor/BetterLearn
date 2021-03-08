const express = require('express');
const router = express.Router();
const axios = require('axios');
const keys = require('../config/keys');

// For searching udemy for available courses
// Body format:
/** Term is the phrase you are searching for
 * { 
 *  "term" : String 
 * }
 */
router.post('/search/courses', async (req,res) => {
    try{
        const { term } = req.body;
        const config = {
            headers: {
                Authorization : keys.UDEMY_ENCODED
            }
        }

        let response = await axios.get(`https://www.udemy.com/api-2.0/courses/?page_size=10&search=${term}`, config);
        let data = response.data.results.map((course) => {
            return({
                title : course.title,
                url : course.url,
                thumbnail : course.image_480x270,
                description : course.headline
            });
        })
        
        res.status(200).send({ resp : data })
    }

    catch(error){
        res.status(500).send({ resp : error });
    }
});

module.exports.router = router;