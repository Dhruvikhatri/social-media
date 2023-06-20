import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar'
import './Post.css'
import { Button, Input } from "antd";
// import firebase from 'firebase/compat/app'
import firebase from "../../firebase"
import "firebase/compat/firestore";
import 'firebase/compat/auth'
const profile = require("../../assets/images/pp2.png") as string;
const postlike = require("../../assets/images/love.svg") as string;
const postunlike = require("../../assets/images/love-black.png") as string;
const auth = firebase.auth();
const db = firebase.firestore();
interface Comment extends firebase.firestore.DocumentData {
  id: string;
  text: string;
  userId: string;
  createdAt: firebase.firestore.Timestamp;
}

interface PostProps {
  post: {
    id: string;
    post: {
      userName: string;
      imageUrl: string;
      caption: string;
    };
  };
  user: any; // Replace `any` with the actual type of user object
}

const Post: React.FC<PostProps> = ({ post, user }) => {
  const [comment, setComment] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  useEffect(() => {
    const postRef = firebase.firestore().collection("posts").doc(post.id);
    postRef.get().then((doc) => {
      if (doc.exists) {
        setLikesCount(doc.data()?.likesCount || 0);
      }
    });
  }, [post.id]);

  const toggleLike = async () => {
    const postRef = firebase.firestore().collection("posts").doc(post.id);
    const currentUser = firebase.auth().currentUser;
    postRef.get().then((doc) => {
      if (doc.exists) {
        const postData = doc.data();
        const likes = postData?.likes || {};
        const likesCount = postData?.likesCount || 0;

        if (likes && currentUser?.uid && likes[currentUser.uid]) {
          // User already liked the post, so decrease the likesCount and remove the user's like
          postRef
            .update({
              [`likes.${currentUser?.uid}`]: firebase.firestore.FieldValue.delete(),
              likesCount: likesCount - 1,
            })
            .then(() => {
              setIsLiked(false);
              setLikesCount(likesCount - 1);
            })
            .catch((error) => {
              console.error("Error unliking post:", error);
            });
        } else {
          // User has not liked the post, so increase the likesCount and add the user's like
          postRef
            .update({
              [`likes.${currentUser?.uid}`]: true,
              likesCount: likesCount + 1,
            })
            .then(() => {
              setIsLiked(true);
              setLikesCount(likesCount + 1);
            })
            .catch((error) => {
              console.error("Error liking post:", error);
            });
        }
      }
    });
  };

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;

    const fetchLikeStatus = async () => {
      const postRef = firebase.firestore().collection("posts").doc(post.id);
      const doc = await postRef.get();

      if (doc.exists) {
        const postData = doc.data();
        const likes = postData?.likes || {};

        if (likes && currentUser?.uid && likes[currentUser.uid]) {
          setIsLiked(true);
        }
      }
    };

    if (currentUser) {
      fetchLikeStatus();
    }
  }, [post.id]);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('posts').onSnapshot((postsSnapshot) => {
      const postData: Promise<void>[] = [];

      postsSnapshot.forEach((postDoc) => {
        const postId = postDoc.id;

        const commentsData = firebase
          .firestore()
          .collection('posts')
          .doc(postId)
          .collection('comments')
          .get()
          .then((commentsSnapshot) => {
            const postComments: Comment[] = [];

            commentsSnapshot.forEach((commentDoc) => {
              const commentData = {
                id: commentDoc.id,
                ...commentDoc.data(),
              } as Comment;

              postComments.push(commentData);
            });

            setComment((prevComments) => [...prevComments, ...postComments]);
          });

          postData.push(commentsData);
      });

      Promise.all(postData).then(() => {
        // All comments have been fetched
        console.log('All comments fetched');
      });
    });

    return () => unsubscribe();
  }, []);


  const onhandleComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    firebase
      .firestore()
      .collection("posts")
      .doc(post?.id)
      .collection("comments")
      .add({
        text: newComment,
        username: user?.displayName,
        uid: user?.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        postId: post?.id
      })
      .then(() => {
        setMessage("comment added");
        setTimeout(() => {
          setMessage(null);
        }, 1000);
        setNewComment('');
      })
      .catch((error) => {
        console.log("Error adding comment:");
      });
  };

  console.log(comment)
  return (
    <div className="post-container">
      <div className="post-header">
        <Avatar src={profile} className="post-avatar" />
        <div className="post-fullname">{post?.post?.userName}</div>
      </div>
      <div className="post-image">
        <img src={post?.post?.imageUrl} alt="Post" />
      </div>
      <div className="post-caption">
        {post?.post?.userName} <span>{post?.post?.caption}</span>
      </div>
      <div className="post-analytics">
        <div className="post-analytics-btn" onClick={toggleLike}>
          {isLiked ? (
            <img src={postunlike} alt="Unlike" className="postreact" />
          ) : (
            <img src={postlike} alt="Like" className="postreact" />
          )}
        </div>
        <div className="post-analytics-count">
          {likesCount === 0
            ? "0"
            : likesCount === 1
            ? `${likesCount} Like`
            : `${likesCount} Likes`}
        </div>
      </div>
      <div className="post-comment">
        {comment?.map((data) => (
          post?.id == data?.postId ? 
            <div className="comment-txt" key={data.id}>
              <b>{data?.username} </b>
              {data?.text}
            </div> : ''
          ))}
      </div>
      {message && <div>{message}</div>}
      <form className="post-comment-box" onSubmit={onhandleComment}>
        <Input
          type="text"
          placeholder="Add comment"
          className="post-comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          className="comment-btn"
          disabled={!comment}
          htmlType="submit"
          type="primary"
        >
          Post
        </Button>
      </form>
    </div>
  );
};

export default Post;