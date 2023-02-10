const router = require("express").Router();
const Message = require("../models/Message");

// new message
router.post("/", async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        res.status(500).json(error);
    }
})

// get message
router.get("/:conversationId", async (req, res) => {
    try {
        const getMessage =await Message.find({ coversationId: req.params.conversationId })
        res.status(200).json(getMessage);
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router;