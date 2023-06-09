import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/compat/app'
import 'firebase/compat/database';
import { storage, db } from '../../firebase'
import 'firebase/compat/auth'
import { auth } from '../../firebase'
import "firebase/compat/firestore";
import 'firebase/compat/storage';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Avatar } from '@mui/material';
import './Profile.css'
import NavBar from '../NavBar/NavBar';
import { Button } from 'antd';
const Profile = () => {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState('')
    const fileInputRef = useRef(null);
    const [bio, setBio] = useState('')
    const currentUser = firebase.auth().currentUser;
    // const userID = currentUser.uid
    const [userData, setUserData] = useState([]);
    const [message, setMessage] = useState()
    const [userID, setUserID] = useState();
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const checkIfUserLoggedIn = auth.onAuthStateChanged((authuser) => {
            if (authuser) {
                setUser(authuser)
                setUserID(authuser.uid)
            }
            else {
                setUser(null)
            }
        })
        return () => {
            checkIfUserLoggedIn()
        }
    }, [])
    useEffect(() => {
        if (userID) {
            let userdb;
            userdb = db
                .collection("users")
                .doc(userID)
                .collection("profiles")
                .onSnapshot((snapshot) => {
                    setUserData(snapshot.docs.map
                        ((doc) => ({
                            id: doc.id,
                            comment: doc.data(),
                        }))
                    );
                })

        }
    }, []);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        setFile(file)
    }
    const handleUpdateProfile = async () => {
        if (file, bio) {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(file.name);
            try {
                await fileRef.put(file);
                const downloadUrl = await fileRef.getDownloadURL();
                await db.collection('profiles').add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    bio: bio,
                    photoURL: downloadUrl,
                    userName: user.displayName,
                    userID: userID
                });
                setMessage('profile uploaded successfully')
                setTimeout(() => {
                    setMessage(null)
                }, 1000);
                setBio('')
            } catch (error) {
                setMessage('Profile Upload Failed')
                setTimeout(() => {
                    setMessage(null)
                }, 1000);
            }
        }
    }

    
//   useEffect(() => {
//     const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
//       if (currentUser) {
//         const postsCollection = firebase.firestore().collection('posts');
//         console.log(postsCollection)
//         const query = postsCollection.where('displayName', '==', currentUser?.displayName);
//         const unsubscribeQuery = query.onSnapshot((snapshot) => {
//           const posts = [];
//           snapshot.forEach((doc) => {
//             const post = {
//               id: doc.id,
//               ...doc.data(),
//             };
//             posts.push(post);
//           });
//           setUserPosts(posts);
//         });
//         return () => {
//           unsubscribeQuery();
//         };
//       }
//     });
//     return () => {
//       unsubscribe();
//     };
//   }, []);
    return (
        <>
            <NavBar/>
            <div className='userProfile-page'>
                {message && <div>{message}</div>}
                <div className='user-profile-edit'>
                    <input type="file" accept="file" ref={fileInputRef} onChange={handleProfilePicChange} />
                    <textarea className='profile-bio' value={bio} onChange={(e) => setBio(e.target.value)} />
                    <Button type='primary' className='profile-btn' onClick={handleUpdateProfile}>Update Profile</Button>
                </div>
                <div className='user-pic-name'>
                    <Avatar src={''} sx={{ width: 50, height: 50 }} />
                    {currentUser?.displayName && <div>{currentUser?.displayName}</div>}
                </div>
                <div className='user-posts'>

                </div>
            </div>
        </>
    )
}
export default Profile