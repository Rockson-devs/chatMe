const User = require('../model/user')


exports.registerUser = (req, res)=>{
    User.create(req.body, (error, user)=>{
        if(error){
            console.log(error);
            return res.redirect('/register')
        }else res.redirect('/login')

    })
}