import { io } from "socket.io-client";


const socket = io();
const FormComment = document.querySelector('#form-comment');
const Comment = document.querySelector('#comment');
const room = '<%= movie.name %>';
socket.emit('join-room', room);
FormComment.addEventListener('submit',
    (e) => {
        e.preventDefault();
        const comment = Comment.value;
        // ten phong
        // comment
        // ten user 


        socket.emit('comment', room, {
            comment: comment,
            user: null
        });
        Comment.value = '';
    }
)

const comments = document.querySelector('#list-comment');
socket.on('user-comment', (comment) => {
    console.log(comment);
    const commentItem = document.createElement('li');
    commentItem.textContent = comment.comment;
    console.log(comment.room);
    comments.append(commentItem);
})