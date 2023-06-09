import React, { useEffect, useState } from "react";
import './NavBar.css'
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar'
import home from "../../assets/images/home.svg"
import find from "../../assets/images/find.svg"
import react from "../../assets/images/love.svg"
import profile from "../../assets/images/pp1.png"

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import {auth} from '../../firebase'
import { useNavigate, Link } from "react-router-dom";
import { Button, Input } from "antd";
const NavBar = () => {
    const navigate = useNavigate();
    const userHandleLogout = async () => {
        try{
            await firebase.auth().signOut();
            navigate("/")
        } catch (error){
            alert(error)
        }
    }
    const [user, setUser] = useState(null)
    useEffect(() => {
        const checkIfUserLoggedIn = auth.onAuthStateChanged((authuser) => {
            if(authuser){
                setUser(authuser)
            }
            else{
                setUser(null)
            }
        })
        return() => {
            checkIfUserLoggedIn()
        }
    },[user])
    return(
        <div>
            <div className="navbar-barcontent">
                <Grid container>
                    <Grid item xs={4}>
                        <h3 className="navbar-logo-name">Social Media</h3>
                    </Grid>
                    <Grid item xs={4}>
                        <Input
                            type="search"
                            placeholder="Search"
                            className="navbar-search"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <div className="navbar-navigation">
                            <Link to='/home'><img className="navbar-img" src={home}/></Link>
                            {/* <img className="navbar-img" src={find} />
                            <img className="navbar-img" src={react} /> */}
                            <Link to="/profile"><Avatar className="avatar navbar-img" src={profile}/></Link>
                            {user && <Button className="logout-btn" onClick={userHandleLogout} type="primary">Logout</Button>}
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
export default NavBar