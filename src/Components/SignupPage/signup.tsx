import React, { useState } from "react";
// import firebase from 'firebase/compat/app'
import firebase from "../../firebase"
import 'firebase/compat/auth'
import { Button, Form, Input, Space } from "antd";
import Grid from '@mui/material/Grid';
import './signup.css'
import { useNavigate, Link } from "react-router-dom";
const auth = firebase.auth();
const SignUpPage = () => {
    const [username, setusername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const signUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            auth.createUserWithEmailAndPassword(email, password)
                .then((authUser) => {
                    if (authUser?.user) {
                        return authUser.user.updateProfile({
                            displayName: username
                        });
                    }
                    return null;
                })
            navigate("/login")
        } catch (error: any) {
            alert(error?.message)
        }

    }
    return (
        <div>
            {/* <AddPost username={}/> */}
            <Grid container>
                <Grid item xs={3}></Grid>
                <Grid item xs={6} className="Loginpage-grid">
                    <div className="Loginpage-main">
                        <h2>Welcome to Social Media</h2>
                        <div className="loginpage-signin">
                            <div className="login-content">
                                <form onSubmit={signUp}>
                                    <Input
                                        name="fullname"
                                        type="text"
                                        className="signup-fullname"
                                        placeholder="Please enter full name"
                                        value={username}
                                        onChange={(e) => setusername(e.target.value)}
                                    />
                                    <Input
                                        name="email"
                                        type="email"
                                        className="loginpage-email"
                                        placeholder="Please enter email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Input.Password
                                        className="loginpage-password"
                                        placeholder="Please enter email password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Button className="loginpage-btn" htmlType="submit" type="primary">Sign up</Button>
                                </form>
                            </div>
                            <div className="loginpage-or">
                                <p className="loginpage-or-txt">OR</p>
                            </div>
                            <div className="login-forgot">
                                <div>Forgot password?</div>
                            </div>
                            <div className="login-signup">
                                <div className="signup-txt">Have an account <span><Link to="/">{"Login"}</Link></span></div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        </div>
    )
}
export default SignUpPage