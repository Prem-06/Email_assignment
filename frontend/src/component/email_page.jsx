import React, { useEffect, useState,useContext } from 'react'
import Content from './content.jsx'
import Email_component from './email_component'
import { toast } from 'react-toastify'
import './email_page.css'
import Context from '../context.jsx'
import { Audio } from 'react-loader-spinner'
const Email_page = () => {
  const [loader,setloader]=useState(false)
    const {backend_url,model_url}=useContext(Context)
     const notifyB=(val)=>toast.error(val)
     const notifyA=(val)=>toast.success(val)
    const access_token=localStorage.getItem('access_token')
    const [profile,setprofile]=useState({})
   const [email_count,setemail_count]=useState(1)
    const [email_list,setemail_list]=useState([])
    const [list,setlist]=useState([])
    const [textlist,settextlist]=useState([])
    const handleChange = (e) => {
      setemail_count(parseInt(e.target.value));
    };
    function getcategory(x){
       if(list[x]===null){
        return ""
       }
       else{
        return list[x]
       }
    }
    useEffect(()=>{
      const profile_detail = JSON.parse(localStorage.getItem('profile'));
      setprofile(profile_detail);
    },[])

    async function get_emails(x){
      setloader(true)
      await fetch(`${backend_url}/get_emails`,{
        method:'get',
        headers:{
          authorization:access_token,
          emails_count:email_count
        }
      }).then((val)=>{
        return val.json()
      }).then((res)=>{
        setemail_list(res.data)
       let text_list=[]
       res.data.map((i,key)=>{
        text_list.push(i.message)
       })
       setloader(false)
       settextlist(text_list)
       if(res.error){
        notifyB(res.error)
      }
      }).catch((err)=>{
        console.log(err)
      })
    }

    async function get_category(list){
      setloader(true)
      await fetch(`${model_url}/process`,{
        method:'post',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "texts": list })

      }).then((val)=>{
        return val.json()
      }).then((res)=>{
        setlist(res.category)
        setloader(false)
        notifyA('Category Mentioned')
      }).catch((err)=>{
        console.log(err)
        notifyB('Error occur')
      })
    }

  return (
    <div className='email_page'>
    <h1>SmartMail Classifier</h1>
    <Content profile={profile}/>
     <div className="button-div">
      <div>
        <select value={email_count} onChange={handleChange}>
          {[1, 5, 10,15 ,20].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="white"
          className="bi bi-arrow-right"
          viewBox="0 0 16 16"
          style={{ marginLeft: '5px', cursor: 'pointer' ,color:'white'}}
          onClick={()=>{get_emails(email_count)}} 
        >
          <path
            fillRule="evenodd"
            d="M8.354 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 8.354 3.354a.5.5 0 0 1 0-.708z"
          />
          <path
            fillRule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.647-3.646a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
          />
        </svg>
      </div>
      
      <div> <input type="button" value="Classify" onClick={()=>{get_category(textlist)}}/></div>
    </div>
     <div className="email_list">
      {
        loader?(<div className="loader-class">
          <Audio
              height="80"
              width="80"
              radius="9"
              color="white"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
            />
          </div>):( email_list.map((e,k)=>{ 
          return <Email_component data={e} category={getcategory(k)} key={k} />
        }))
      }
       
     </div>
       
       
    </div>
  )
}

export default Email_page