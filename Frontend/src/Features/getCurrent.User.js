import api from "../../Utils/axios";

const getCurrentUser = async () =>
{
   try{
    const {data} = await api.get("/api/v1/youridentity");
    console.log(data);
   }catch(err){

     console.log(err);
   }
}

export default getCurrentUser;