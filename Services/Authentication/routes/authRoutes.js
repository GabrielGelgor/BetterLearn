const passport = require('passport');

//route handler to put the user into the passportJS flow
module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  //route for when a user returns from auth
  app.get('/auth/google/callback', 
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/dashboard');
    }
  );


  //assists redux in deciding if the user is logged in or not
  app.get('/api/current_user', (req, res) => {

  	res.send(req.user)
  });


  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};