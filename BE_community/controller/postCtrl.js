import * as c from '../api/community.js';

export async function getPosts(req, res) {
    try {
        const posts = await c.getPosts();
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const imageFilename = req.file ? req.file.filename : null;

        if (!imageFilename) {
            return res.status(400).send({ error: 'image is required.' });
        }

        if (!title || !content) {
            throw new Error("title and content are required.");
        }

        const newPost = {
            title,
            content,
            userId,
            image : imageFilename
        };

        const postId = await c.createPost(newPost);
        newPost.id = postId;
        res.status(201).json({ message: "Post created", post: newPost });
    } catch (error) {
        console.log('failed to create Post : ', error);
        res.status(500).send('server error: ' + error.message);
    }
};

export async function getPostDetails(req, res) {
    try {
        const postId = req.params.postId; // Get the postId from the URL parameter
        await c.incrementViewCount(postId);
        const post = await c.detailPost(postId);
        if (post) {
            res.json({ data: post });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error('Error fetching post details:', error); // Log the actual error
        res.status(500).json({ message: "server error" });
    }
}

export const updatePost = async (req,res) => {
    try{
        const postId = req.params.postId;
        const {title, content} = req.body;
        const imageFilename = req.file ? req.file.filename : null;

        if(!title || !content) {
            throw new Error("title and content are required.");
        }

        const updatedPost = {
            title,
            content,
            image : imageFilename ? `uploads/image/${imageFilename}` : null 
        };

        await c.updatePost(postId, updatedPost);

        res.status(200).json({message : "post updated successfully"});
    }catch(error) {
        console.log('failed to update Post : ', error);
        res.status(500).send('server error : ' + error.message);
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        await c.deletePost(postId);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log('failed to delete Post : ', error);
        res.status(500).json({ message: 'failed to delete post' });
    }
};

export const addComment = async(req, res) => {
    try {
        const {postId, userId, comment} = req.body;
        if (!postId || !userId || !comment) {
            throw new Error("postId, userId, and comment are required.");
        }

        const commentId = await c.addComment({ postId, userId, comment });
        res.status(201).json({ message: "Comment added", commentId });
    } catch (error) {
        console.log('failed to add comment: ', error);
        res.status(500).send('server error: ' + error.message);
    }
};

export const updateComment = async (req, res) => {
    try {
        const { commentId, comment } = req.body;
        console.log('Incoming request to update comment:', req.body); // Add this line to log the request body
        if (!commentId || !comment) {
            throw new Error("commentId and comment are required.");
        }

        await c.updateComment(commentId, comment);
        res.status(200).json({ message: "Comment updated" });
    } catch (error) {
        console.log('failed to update comment: ', error);
        res.status(500).send('server error: ' + error.message);
    }
};

export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        if (!commentId) {
            throw new Error("commentId is required.");
        }

        await c.deleteComment(commentId);
        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        console.log('failed to delete comment: ', error);
        res.status(500).send('server error: ' + error.message);
    }
};