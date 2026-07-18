import api from "../../Utils/axios"

export  const getConversations = async () =>
{
  try{
    const {data} = await api.get("/api/v1/chat/get-conversation");

    return data;

  }catch(err){
    console.log(err);
    return [];
  }

}