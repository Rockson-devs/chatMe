const NewMessage = require('../model/chats')

exports.getChatPage = async (req, res) => {
    const allMessages = await NewMessage.find({})
    res.render('chat', {
        allMessages
    })
}

exports.saveChats = async (req, res)=>{
    NewMessage.create(req.body), (error, newMessage)=> {
        
        console.log(newMessage);
    }
    const allMessages =  await NewMessage.find({})

    res.render ('chat', {
        allMessages
    })
}