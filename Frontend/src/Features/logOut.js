import api from "../../Utils/axios";

export const logOut = async () =>
{
   try{
   
       const {data} = await api.get("/api/v1/auth/logout");
       

       return data;

   }catch(err)
   {
     console.log(err);
   }
   
}