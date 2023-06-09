import React, { useEffect } from "react";
import './Main.css'
import Grid from '@mui/material/Grid';
import Post from "../Post/Post";
import uploadposticon from "../../assets/images/upload.png"
import AddPost from "../Post/AddPost";
const Main = () => {

    return(
        <div>
            <Grid container>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                    <div className="post-upload-container">
                        <AddPost/>
                    </div>
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        </div>
    )
}
export default Main