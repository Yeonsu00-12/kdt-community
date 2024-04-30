import * as c from '../api/community.js';

export function getPosts(req, res) {
    try {
        const postsJson = c.getPosts();
        res.json(postsJson);
    }catch (error) {
        console.log(error);
        res.status(500).json({message : "server error"});
    }
}

export const createPost = (req, res) => {
    try {
        if(!req.body.title || !req.body.content) {
            throw new Error("title and content are required.");
        }
        const newPost = {
        title : req.body.title,
        content : req.body.content,
        image : req.file.path
        };
        c.createPost(newPost);
        res.status(201).json({message : "Post created", post: newPost});
    } catch(error) {
            console.log('failed to create Post : ', error);
            res.status(500).send('server error' + error.message);
    }
}


export const getPostDetail = (req, res) => {
    const post = c.detailPost(req.params.postId);

    res.json(post);
}

export const deletePost = (req, res) => {
    c.deletePost(req.params.postId);   
}