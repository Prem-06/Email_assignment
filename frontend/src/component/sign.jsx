import React, { useState, useEffect } from 'react'
import {useGoogleLogin} from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {toast } from 'react-toastify';
import './signin.css'


const Signin= () => {
  const notifyA=(val)=> toast.success(val)
  const notifyB=(val)=> toast.error(val)
  const navigate=useNavigate();
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [openai_key,setopenai_key]=useState("")
 
  const data = useGoogleLogin({
    onSuccess: (tokenResponse) =>{setUser(tokenResponse)},
    onError: (error) => console.log('Login Failed:', error),
    scope: 'https://www.googleapis.com/auth/gmail.readonly'
  })
    
  function login(){
    if(openai_key!=""){
      localStorage.setItem('openai_key',openai_key)
      setopenai_key("")
      data()
    }
    else{
      notifyB('OpenAI key Required')
    }
    
   
  }

  useEffect(() => {
    if (user) {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json',
            },
          },
        )
        .then((res) => {
          setProfile(res.data)
          localStorage.setItem('profile',JSON.stringify(res.data))
          localStorage.setItem('access_token',user.access_token)
          notifyA('Sign in sucessfully')
          navigate('/email_page')
        })
        .catch((err) =>notifyB('Error Occur'))
    }
  }, [user])

  return (
    <div className='signin'>
  <input type="text" placeholder='Enter OpenAI Key' value={openai_key} onChange={(e)=>{setopenai_key(e.target.value)}} />   
 <button type="button" class="google-sign-in-button" onClick={()=>{login()}}>Sign in with Google</button>
         
    </div>

  )
}

export default Signin
