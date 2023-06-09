import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar'
import profile from "../../assets/images/pp2.png"
import postimg from "../../assets/images/post.jpg"
import postlike from "../../assets/images/love.svg"
import postunlike from "../../assets/images/love-black.png"
import postcomment from "../../assets/images/comment.svg"
import './Post.css'
import { Button, Input } from "antd";
import firebase from 'firebase/compat/app'
import 'firebase/compat/database';
import { db } from '../../firebase'
import 'firebase/compat/auth'
import { auth } from '../../firebase'
const Post = ({post, user}) => {
    const [comment, setComment] = useState('')
    const [editComment, setEditComment] = useState('');
    const [commentID, setCommentID] = useState('');
    const [show, setShow] = useState(false)
    const [message, setMessage] = useState()
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        const postRef = firebase.firestore().collection('posts').doc(post.id);
        postRef.get().then((doc) => {
            if (doc.exists) {
              setLikesCount(doc.data().likesCount || 0);
            }
          });
    },[post.id])
  const toggleLike = async () => {
    const postRef = firebase.firestore().collection('posts').doc(post.id);
    const currentUser = firebase.auth().currentUser;
    postRef.get().then((doc) => {
        if (doc.exists) {
          const postData = doc.data();
          const likes = postData.likes || {};
          const likesCount = postData.likesCount || 0;
          
          if (likes[currentUser.uid]) {
            // User already liked the post, so decrease the likesCount and remove the user's like
            postRef.update({
              [`likes.${currentUser.uid}`]: firebase.firestore.FieldValue.delete(),
              likesCount: likesCount - 1,
            }).then(() => {
                setIsLiked(false);
              setLikesCount(likesCount - 1);
            }).catch((error) => {
              console.error('Error unliking post:', error);
            });
          } else {
            // User has not liked the post, so increase the likesCount and add the user's like
            postRef.update({
              [`likes.${currentUser.uid}`]: true,
              likesCount: likesCount + 1,
            }).then(() => {
                setIsLiked(true);
              setLikesCount(likesCount + 1);
            }).catch((error) => {
              console.error('Error liking post:', error);
            });
          }
        }
      });
  };

  
  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    
    const fetchLikeStatus = async () => {
      const postRef = firebase.firestore().collection('posts').doc(post.id);
      const doc = await postRef.get();

      if (doc.exists) {
        const postData = doc.data();
        const likes = postData.likes || {};

        if (likes[currentUser.uid]) {
          setIsLiked(true);
        }
      }
    };

    if (currentUser) {
      fetchLikeStatus();
    }
  }, [post.id]);

    useEffect(() => {
        let commentdb;
        if (post?.id) {
            commentdb = db
                .collection("posts")
                .doc(post?.id)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComment(snapshot.docs.map
                        ((doc) => ({
                            id: doc.id,
                            comment: doc.data(),
                        }))
                    );
                });
        }
        return () => {
            commentdb();
        };

    }, [post?.id])

    const onhandleComment = (e) => {
        e.preventDefault()
        db.collection("posts").doc(post?.id).collection("comments").add({
            text: comment,
            username: post?.post?.userName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setMessage('comment added')
                setTimeout(() => {
                    setMessage(null)
                  }, 1000);
        setComment('');
    }

    return (
        <div className="post-container">
                    <div className="post-header">
                        <Avatar src={profile} className="post-avatar" />
                        <div className="post-fullname">{post?.post?.userName}</div>
                    </div>
                    <div className="post-image">
                        <img src={post?.post?.imageUrl} />
                    </div>
                    <div className="post-caption">
                        {post?.post?.userName} <span>{post?.post?.caption}</span>
                    </div>
                    <div className="post-analytics">
                        <div className="post-analytics-btn" onClick={toggleLike}> 
                            {isLiked ? <img src={postunlike} className="postreact" /> : <img src={postlike} className="postreact" />}
                        </div>
                        <div className="post-analytics-count">
                            {likesCount === 0
                            ? "0"
                            : likesCount === 1
                            ? `${likesCount} Like`
                            : `${likesCount} Likes`
                            }
                        </div>
                    </div>
                    <div className="post-comment">
                        {comment && comment?.map((data, id) => (
                            <div className="comment-txt" key={id}><b>{data?.comment?.username} </b>{data?.comment?.text}</div>
                        ))}
                    </div>
                    {message && <div>{message}</div>}
                    <form className="post-comment-box">
                        <Input
                            type="text"
                            placeholder="Add comment"
                            className="post-comment-input"
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                            className="comment-btn"
                            disabled={!comment}
                            htmlType="submit" type="primary"
                            onClick={onhandleComment}
                        >Post</Button>
                    </form>
                </div>
    )
}
export default Post