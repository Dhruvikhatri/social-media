import React, { useEffect, useRef, useState } from 'react';
// import firebase from 'firebase/compat/app'
import firebase from "../../firebase"
import "firebase/compat/firestore";
import 'firebase/compat/auth'
import { Avatar } from '@mui/material';
import './Profile.css'
import NavBar from '../NavBar/NavBar';
import { Button } from 'antd';
const auth = firebase.auth();
const db = firebase.firestore();
interface UserData {
  id: string;
  comment: {
    bio: string;
    photoURL: string;
    userName: string;
    userID: string;
  };
}

const Profile = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bio, setBio] = useState('');
  const currentUser = firebase.auth().currentUser;
  const [userData, setUserData] = useState<UserData[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | undefined>();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const checkIfUserLoggedIn = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        setUser(authuser)
        setUserID(authuser?.uid)
      } else {
        setUser(null)
      }
    })

    return () => {
      checkIfUserLoggedIn()
    }
  }, [])

  useEffect(() => {
    if (userID) {
      const userdb = db
        .collection("users")
        .doc(userID)
        .collection("profiles")
        .onSnapshot((snapshot) => {
          setUserData(snapshot.docs.map((doc) => ({
            id: doc.id,
            comment: doc.data(),
          } as UserData))) // Explicitly cast to UserData
        })
      return () => {
        userdb();
      };
    }
  }, [userID]);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file || null)
  }

  const handleUpdateProfile = async () => {
    if (file && bio) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(file.name);
      try {
        await fileRef.put(file);
        const downloadUrl = await fileRef.getDownloadURL();
        await db.collection('profiles').add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          bio: bio,
          photoURL: downloadUrl,
          userName: user?.displayName,
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

  return (
    <>
      <NavBar />
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
        <div className='user-posts'></div>
      </div>
    </>
  )
}

export default Profile;