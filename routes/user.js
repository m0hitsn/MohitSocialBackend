const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");


// get all user for search 

router.get("/search", async (req, res) => {
    try {
        const users = await User.find({});
        const allUser = [];
        users.map((u) => {
            const { _id, username, ProfilePicture } = u;
            allUser.push({ _id, username, ProfilePicture });
        })
        res.status(200).json(allUser);
    } catch (err) {
        res.status(500).json(err);
    }
})

// get user 
router.get("/", async (req, res) => {

    try {
        const userId = req.query.userId;
        const username = req.query.username;
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
        const { password, createdAt, updatedAt, isAdmin, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        res.status(500).json(error);
    }
})

// update user
router.put("/:id", async (req, res) => {
    try {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const user = await User.findByIdAndUpdate(req.body.userId, {
                $set: req.body,
            });
            res.status(200).json("Account update successfully");
        } else {
            res.status(401).json("you can update only your account");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// delete user 
router.delete("/:id", async (req, res) => {
    try {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account delete successfully");
        } else {
            res.status(401).json("you can delete only your account");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})



// get friends
router.get("/friend/:Id", async (req, res) => {
    try {
        const user = await User.findById(req.params.Id);
        const FriendsId = user.Following.concat(user.Followers);
        let uniqueFriendsId = [...new Set(FriendsId)];

        const friends = await Promise.all(
            uniqueFriendsId.map((friendsId) => {
                return User.find({ _id: friendsId });
            }),
        );

        const friendList = [];
        friends.map((friend) => {
            const [{ _id, username, ProfilePicture }] = friend;
            friendList.push({ _id, username, ProfilePicture });
        })
        res.status(200).json(friendList);
    } catch (error) {
        res.status(500).json(error);
    }
})

// get following
router.get("/Following/:Id", async (req, res) => {
    try {
        const user = await User.findById(req.params.Id);
        const FriendsId = user.Following;

        const friends = await Promise.all(
            FriendsId.map((friendsId) => {
                return User.find({ _id: friendsId });
            }),
        );

        const friendList = [];
        friends.map((friend) => {
            const [{ _id, username, ProfilePicture }] = friend;
            friendList.push({ _id, username, ProfilePicture });
        })
        res.status(200).json(friendList);
    } catch (error) {
        return res.status(500).json(error);
    }
})


// get all user exect which you follow 

router.get("/notfriend/:id", async (req, res) => {
    const Allusers = await User.find({});
    const currentUser = await User.findOne({ _id: req.params.id })
    const FriendsId = currentUser.Following.concat(req.params.id);

    const notfriend = await Promise.all(
        Allusers.filter(user => !FriendsId.includes(user._id.valueOf()))
    )

    res.status(200).json(notfriend);
})



// req.params.id is the user id which we want to follow or unfollow
// req.body.id is the user itself id

// follow
router.put("/:id/follow", async (req, res) => {
    try {
        if (req.body.userId !== req.params.id) {

            const currentuser = await User.findById(req.body.userId);
            const user = await User.findById(req.params.id);
            if (!currentuser.Following.includes(req.params.id)) {
                await currentuser.updateOne({ $push: { Following: req.params.id } });
                await user.updateOne({ $push: { Followers: req.body.userId } });
                res.status(200).json("Successfully follow");
            } else {
                res.status(200).json("you already follow this user");
            }

        } else {
            res.status(404).json("You can't follow your Account");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// unfollow
router.put("/:id/unfollow", async (req, res) => {
    try {
        if (req.body.userId !== req.params.id) {
            const currentuser = await User.findById(req.body.userId);
            const user = await User.findById(req.params.id);
            if (currentuser.Following.includes(req.params.id)) {
                await currentuser.updateOne({ $pull: { Following: req.params.id } });
                await user.updateOne({ $pull: { Followers: req.body.userId } });
                res.status(200).json("Successfully unfollow");
            }
            else {
                res.status(200).json("you already unfollow this user");
            }
        } else {
            res.status(404).json("You can't unfollow your Account");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})
module.exports = router;