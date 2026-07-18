import api from "../../Utils/axios"

export  const createConversation = async () =>
{
  try{

    const {data} = await api.get("/api/v1/chat/create-conversation");
    return data;

  }catch(err){
    console.log(err);
    return [];

  }

}