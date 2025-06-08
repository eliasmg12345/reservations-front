'use client'
import { Grid } from "@mui/material";
import LoginContainer from "./ui/LoginContainer";


export default function LoginPage() {
    return (
        <Grid container justifyContent="space-evenly" alignItems={'center'}>
            <LoginContainer />
        </Grid>
    )
}