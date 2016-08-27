var express = require('express');

var router = express.Router();

router.route('/login')
  .post(function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log('email='+email);
    console.log('pass='+password);

    // Simulate DB checks here.
    setTimeout(function() {
      if (password !== 'password1') {
        // Use HTTP status code 401 for wrong authentication credentials.
        res.status(401).json({ code: 'auth/wrong-password' }).end();
      } else {
        var id = Date.now();
        res.status(200).send({ email, id }).end();
      }
    }, 1000);
  });

module.exports = router;
