import fs from 'fs';
import path from 'path';

let __dirname = path.resolve();
const postFilePath = path.join(__dirname, '/api/communityDetail.json');

export const getPosts = () => {
    const postFile = fs.readFileSync(postFilePath,'utf8');
    const postData = JSON.parse(postFile);
    return postData;
}

export const createPost = async (newPost) => {
        try{
        const postFile = fs.readFileSync(postFilePath,'utf8');
        const parsedData = JSON.parse(postFile);
        const postData = parsedData.data;

        const newPostId = postData[postData.length-1] ? parseInt(postData[postData.length -1].id) +1 : 1;
        const currentData = new Date();
        const formattedDate = currentData.toISOString().replace('T', ' ').split('.')[0];

        if(!Array.isArray(postData)) {
            throw new Error("Data is not an array");
        }

        const post = {
            id: newPostId,
            title : newPost.title,
            content : newPost.content,
            author : {
                nickname : newPost.nickname,
                profile : newPost.profile,
            },
            date : formattedDate,
            likely : 0,
            check : 0,
            comment : 0
        };

        postData.push(post);
        fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2), 'utf8');
    }catch (error) {
        console.log('failed to create post : ', error);
        throw error;
    }
}

export const detailPost = (postId) => {
    const postFile = fs.readFileSync(__dirname + '/api/communityDetail.json','utf8');
    const postData = JSON.parse(postFile);

    const post = postData.find(p => p.id === parseInt(postId));
    if(post) {
        console.log(post.comments);
        return post;
    }else {
        console.log('post not found');
        return null;
    }
};