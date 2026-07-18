import api from "../../Utils/axios"

export const sendMessage  = async (payload)=>
{
  try{
    const {data} = await api.post("/api/v1/agent/chat",payload);
    return data;
    
  }catch(err)
  {
     console.log(err);
     return null;
  }

}