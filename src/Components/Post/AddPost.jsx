import React, { useRef, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Button } from "antd";

import { storage, db } from '../../firebase'
import firebase from 'firebase/compat/app'
import "firebase/compat/firestore";
import 'firebase/compat/storage';
import 'firebase/compat/auth'
import { auth } from '../../firebase'
import Post from "./Post";
const AddPost = () => {
    const fileInputRef = useRef(null);
    const [caption, setCaption] = useState('')
    const [image, setUploadImage] = useState(null)
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState()
    const [postList, setPostList] = useState([])
    useEffect(() => {
        db.collection("posts")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                setPostList(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        post: doc.data(),
                    }))
                );
            });
    }, [])
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
    const handleChange = (e) => {

        // Checked If file is upload or not
        if (e.target.files[0]) {
            setUploadImage(e.target.files[0])
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
                    userName: user.displayName
                });
                setMessage('Post uploaded successfully')
                setTimeout(() => {
                    setMessage(null)
                  }, 1000);
                setCaption('')
            resetFileInput();
            } catch(error){
                setMessage('Post Upload Failed')
                setTimeout(() => {
                    setMessage(null)
                  }, 1000);
            }
        }else{
            setMessage('Please add image and caption')
            setTimeout(() => {
                setMessage(null)
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