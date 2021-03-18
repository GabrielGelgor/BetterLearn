const passport = require('passport');
const axios = require('axios');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');


passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      //console.log('access token', accessToken);
      //console.log('refresh token', refreshToken);
      //console.log('profile', profile);
      //console.log(profile)
      console.log("here is the id: ", profile.id);
      //console.log("here is the first email --> ", profile.emails[0].value);

      //search.date
      //variablename.data

      passport.serializeUser((currentUser, done) => {

        done(null, currentUser.id);
      });


      passport.deserializeUser((id, done) => {

        axios.get(`http://localhost:5555/api/getUser/${id}`)
          .then(user => {
            let currentUser = user.data;
            done(null, currentUser);
        });

      });


      //Saving the response code from the getUser endpoint
      responseStatus = null;
      await axios.get(`http://localhost:5555/api/getUser/${profile.id}`)
        .then(({ response }) => {})
        .catch(({ response }) => { 
          responseStatus = response.status;
       });

      console.log(responseStatus);


      //check if user exists in db at the /api/getUser/:id endpoint
      //if it is null it means no error code was caught and the user exists
      if ( responseStatus == null ){
        console.log('userfound!!!!!!!!!!!')

        //make a user object
        let currentUser = await axios.get(`http://localhost:5555/api/getUser/${profile.id}`);
        currentUser = currentUser.data;

        //after done call is executed user will be logged in
        done(null, currentUser);
      }


      else if ( responseStatus == 404 ){
        console.log('user not found, but dw we gonna make u an account')

        //creating account using /api/addUser endpoint and sending it the required data
        await axios.post('http://localhost:5555/api/addUser', {
            id: profile.id,
            userName: profile.emails[0].value
        })
        .finally(console.log("made a user"));

        //make a user object
        let currentUser = await axios.get(`http://localhost:5555/api/getUser/${profile.id}`);
        currentUser = currentUser.data;

        //after done call is executed user will be logged in
        done(null, currentUser);
      }

    }
  )
);