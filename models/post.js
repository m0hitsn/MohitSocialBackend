const { default: mongoose } = require("mongoose");
const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    disc: {
        type: String,
    },
    img: {
        type: String
    },
    like: {
        type: Array,
        default: [],
    },
    comment: {
        type: Array,
        default: [],
    },

},
    { timestamps: true }
);
const postModel = mongoose.model("post", postSchema);

module.exports = postModel;