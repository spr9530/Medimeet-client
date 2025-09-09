import { useUser } from "@clerk/clerk-react";
import React from 'react'

function CheckUser() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  const userInfo = async() =>{
    try {
      const res = axios.post('https://medimeet-1-kidp.onrender.com/api/user/check-user', user)
      
    } catch (error) {
      
    }
  }

  return (
    <div>CheckUser</div>
  )
}

export default CheckUser