const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");

// create post
router.post("/", async (req, res) => {
    try {
        const post = await new Post(req.body);
        post.save();
        res.status(200).json("Post created successfullly");
    } catch (error) {
        res.status(500).json(error);
    }
})

// update post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("Post update successfully");
        } else {
            res.status(401).json("you can only update your post");
        }
    } catch (error) {
        res.status(501).json(error);
    }

})

// delete post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Post delete successfully");
        } else {
            res.status(401).json("you can delete only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// like and dislike a post 
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.like.includes(req.body.userId)) {
            await post.updateOne({ $push: { like: req.body.userId } });
            res.status(200).json("Post like");
        } else {
            await post.updateOne({ $pull: { like: req.body.userId } });
            res.status(200).json("Post dislike");
        }

    } catch (error) {
        res.status(500).json(error);
    }
})

// get post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})

// timeline post 
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentuser = await User.findById(req.params.userId);
        const userposts = await Post.find({ userId: currentuser._id });
        const friendposts = await Promise.all(
            currentuser.Following.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        );
        res.json(userposts.concat(...friendposts));
    } catch (error) {
        res.status(500).json(error);
    }
})

// get all user post 

router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const post = await Post.find({ userId: user._id });
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json(error);
    }
})
module.exports = router;