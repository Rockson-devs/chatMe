const User = require('../model/user')
const bcrypt = require('bcrypt')

exports.loginUser = async (req, res)=> {
    const { username, password} = req.body

    User.findOne({ username: username }, (error, user)=>{
        if(user){
            bcrypt.compare(password, user.password, (error, same)=>{
                if(same){
                    req.session.userId = user._id
                    req.session.username = user.username
                    console.log(req.session.userId);
                    console.log(req.session.username);
                    res.redirect('/chat')
                } else{
                    res.redirect('/login')
                }
            })
        }
    })
}