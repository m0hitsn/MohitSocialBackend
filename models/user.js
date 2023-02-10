const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 20,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        max: 50,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: 6,
        required: true,
    },
    ProfilePicture: {
        type: String,
        default: "",
    },
    CoverPicture: {
        type: String,
        default: "",
    },
    Followers: {
        type: Array,
        default: [],
    },
    Following: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    disc: {
        type: String,
        max: 100,
        default: "",

    },
    city: {
        type: String,
        max: 20,
        default: "",
    },
    from: {
        type: String,
        default: "",
    },
    relationship: {
        type: String,
        default: "",
    }
},
    { timestamps: true }
)

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;