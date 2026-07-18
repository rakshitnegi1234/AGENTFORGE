import api from "../../Utils/axios";

async function getMessages(id) {

  try{
    const {data} = await api.get(`/api/v1/chat/get-message/${id}`);

    return data;

  }catch(err)
  {
     console.log(err);
  }

}

export default getMessages;