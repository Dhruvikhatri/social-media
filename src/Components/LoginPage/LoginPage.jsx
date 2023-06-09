import React, {useState} from "react";
import './LoginPage.css'
import { Button, Form, Input, Space } from "antd";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import {auth} from '../../firebase'
import Grid from '@mui/material/Grid';
import { useNavigate, Link } from "react-router-dom";
const LoginPage = () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate();
    const Login = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then((res) => {
                console.log(res)
                navigate("/home");
            })
            .catch((e) => {
                console.log(e.message)
                alert(e.message)
            })

    }

    return (
        <div>
            <Grid container>
                <Grid item xs={3}></Grid>
                <Grid item xs={6} className="Loginpage-grid">
                    <div className="Loginpage-main">
                        <h2>Welcome to Social Media</h2>
                        <div className="loginpage-signin">
                            <div className="login-content" onSubmit={Login}>
                                <form>
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
                                    <Button className="loginpage-btn" htmlType="submit" type="primary">Login</Button>
                                </form>
                            </div>
                            <div className="loginpage-or">
                                <p className="loginpage-or-txt">OR</p>
                            </div>
                            <div className="login-forgot">
                                <div>Forgot password?</div>
                            </div>
                            <div className="login-signup">
                            <div className="signup-txt">Don't have an account? <span><Link to="/signup">{"SignUp"}</Link></span></div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        </div>
    )
}
export default LoginPage