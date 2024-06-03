import db_info from '../config/mysql.js';
import path from 'path';

export const getPosts = async () => {
    try {
        const query = `
            SELECT 
                posts.postId, 
                posts.userId, 
                posts.title, 
                posts.content, 
                posts.image, 
                posts.likes, 
                posts.commentCount, 
                posts.views, 
                posts.created_At, 
                posts.updated_At,
                users.nickname,
                users.profileImage
            FROM posts
            JOIN users ON posts.userId = users.userId
        `;
        const [results] = await db_info.query(query);
        return results;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Error fetching posts: ' + error);
    }
};

export const createPost = async ({ title, content, userId, image }) => {
    try {
        const imageUrl = path.join('uploads','image', image);
        const query = 'INSERT INTO posts (title, content, userId, image, created_At, updated_At, likes, views, commentCount) VALUES (?, ?, ?, ?, NOW(), NOW(), 0, 0, 0)';
        const [result] = await db_info.query(query, [title, content, userId, imageUrl]);
        return {
            id : result.insertId,
            title,
            image : imageUrl,
            content
        };
    } catch (error) {
        console.error('Error newPost update: ', error);
        throw new Error(error);
    }
};

export const detailPost = async (postId) => {
    try {
        // Fetch post details along with the author's nickname and profile image
        const postQuery = `
            SELECT p.*, u.nickname as authorNickname, u.profileImage as authorProfile
            FROM posts p
            JOIN users u ON p.userId = u.userId
            WHERE p.postId = ?`;

        // Fetch comments related to the post along with the commenter's nickname and profile image
        const commentsQuery = `
            SELECT c.*, u.nickname, u.profileImage as userProfile
            FROM comments c
            JOIN users u ON c.userId = u.userId
            WHERE c.postId = ?`;

        const [postResults] = await db_info.query(postQuery, [postId]);
        const [commentsResults] = await db_info.query(commentsQuery, [postId]);

        const post = postResults.length > 0 ? postResults[0] : null;

        if (post) {
            post.comments = commentsResults;
        }

        return post;
    } catch (error) {
        throw new Error(error);
    }
};

export const updatePost = async (postId,{title, content, image}) => {
    try{
        const query = `UPDATE posts SET title = ? , content = ?, image = ?, updated_At = NOW() WHERE postId = ?`;
        await db_info.query(query,[title, content, image, postId]);
    }catch(error) {
        console.log('Error update post : ',error);
        throw new Error(error);
    }
}

export const deletePost = async (postId) => {
    try {
        const query = 'DELETE FROM posts WHERE postId = ?';
        await db_info.query(query, [postId]);
    } catch (error) {
        console.error('Error deleting post: ', error);
        throw new Error(error);
    }
};

export const incrementViewCount = async (postId) => {
    try {
        const query = 'UPDATE posts SET views = views + 1 WHERE postId = ?';
        await db_info.query(query,[postId]);
    } catch(error) {
        throw new Error('Error incrementing view count : ' + error);
    }
}

export const incrementCommentCount = async (postId) => {
    try {
        const query = 'UPDATE posts SET commentCount = commentCount + 1 WHERE postId = ?';
        await db_info.query(query,[postId]);
    } catch(error) {
        throw new Error('Error incrementing view count : ' + error);
    }
}

export const addComment = async (comment) => {
    try {
        const query = 'INSERT INTO comments (postId, userId, comment, created_At, updated_At) VALUES (?, ?, ?, NOW(), NOW())';
        const [result] = await db_info.query(query, [comment.postId, comment.userId, comment.comment]);
        await incrementCommentCount(comment.postId);
        return result.insertId;
    } catch(error) {
        throw new Error('Error adding comment : ' + error);
    }
};

export const updateComment = async (commentId, comment) => {
    try {
        const query = 'UPDATE comments SET comment = ?, updated_At = NOW() WHERE commentId = ?';
        await db_info.query(query, [comment, commentId]);
    } catch(error){
        throw new Error('Error updating comment : ' + error);
    }
};

export const deleteComment = async(commentId) => {
    try {
        const query = 'DELETE FROM comments WHERE commentId = ?';
        await db_info.query(query, [commentId]);
    } catch(error) {
        throw new Error('Error deleted comment : ' + error);
    }
}