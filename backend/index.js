import express from 'express'
import cors from 'cors'
import emailRouter from './get_email.js';
const app=express()
const port=3000


app.use(cors())
app.use(express.json());
app.use(emailRouter)



app.listen(port,()=>{
    console.log("server is running")
})