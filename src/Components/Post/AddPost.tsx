import React, {ChangeEvent, useRef, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Button } from "antd";
// import firebase from 'firebase/compat/app'
import firebase from "../../firebase"
import "firebase/compat/firestore";
import 'firebase/compat/auth'
import Post from "./Post";
const auth = firebase.auth();
const db = firebase.firestore();
interface PostData {
    id: string;
    post: {
      timestamp: firebase.firestore.Timestamp;
      caption: string;
      imageUrl: string;
      userName: string;
    };
  }

const AddPost = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [caption, setCaption] = useState('')
    const [image, setUploadImage] = useState<File | null>(null);
    const [user, setUser] = useState<firebase.User | null>(null);
    const [message, setMessage] = useState('')
    const [postList, setPostList] = useState<PostData[]>([]);
    useEffect(() => {
        const unsubscribe = db.collection("posts")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) => {
            setPostList(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                post: doc.data() as {
                  timestamp: firebase.firestore.Timestamp;
                  caption: string;
                  imageUrl: string;
                  userName: string;
                },
              }))
            );
          });
    
        return () => {
          unsubscribe();
        };
      }, []);
    useEffect(() => {
        const checkIfUserLoggedIn = auth.onAuthStateChanged((authuser) => {
            if (authuser) {
                setUser(authuser)
            }
            else {
                setUser(null)
            }
        })
        return () => {
            checkIfUserLoggedIn()
        }
    }, [])

    // Image  Upload
    const handleChange = (e : ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
          const uploadedImage = e.target.files[0];
          setUploadImage(uploadedImage);
        }
    }

    // Post Upload
    const handleUploadPost = async () => {
        if (caption && image) {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(image.name);
            try {
                await fileRef.put(image);
                const downloadUrl = await fileRef.getDownloadURL();
                // Save the post to the database
                await db.collection('posts').add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: downloadUrl,
                    userName: user?.displayName
                });
                setMessage('Post uploaded successfully')
                setTimeout(() => {
                    setMessage('')
                  }, 1000);
                setCaption('')
            resetFileInput();
            } catch(error){
                setMessage('Post Upload Failed')
                setTimeout(() => {
                    setMessage('')
                  }, 1000);
            }
        }else{
            setMessage('Please add image and caption')
            setTimeout(() => {
                setMessage('')
              }, 1000);
        }
    }

    const resetFileInput = () => {
        setUploadImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    return (
        <>
            <div className="add-post-container">
            <h3>Add New Post</h3>
            {message && <div>{message}</div>}
            <input className="file-upload" ref={fileInputRef} type="file" onChange={handleChange} />
            <TextField className="caption" label="Write caption here" variant="filled"
                onChange={(e) => { setCaption(e.target.value) }}
                value={caption}
            />
            <Button className="addpost-btn" type="primary" onClick={handleUploadPost}>Add Post</Button>
            </div>
            {postList && postList.map((post, id) => (
                <Post
                    post={post}
                    user={user}
                />
            ))}
        </>
        
    )
}
export default AddPost