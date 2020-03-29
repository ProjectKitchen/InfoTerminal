const User = require('../database/models/User')
 
module.exports = (req, res) => {
    console.log ("trying to store user");
    User.create(req.body, (error, user) => {
        if (error) {
            console.log ("error storing user, retry");
            const registrationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('registrationErrors', registrationErrors)
            return res.redirect('/auth-register');
        }
        res.redirect('/');
    })
}
