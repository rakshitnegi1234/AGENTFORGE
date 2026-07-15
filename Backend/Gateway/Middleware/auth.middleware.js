import redis from "../../Shared/redis/redis.js";

const protect = async  (req,res,next) =>
{
   try{
    const sessionId = req.cookies?.session;

    if(!sessionId)
    { 
       return  res.status(400).json({"message" : "YOU ARE UNAUTHORISED, PLEASE LOGIN AGAIN"});
       
    }

    const session = await redis.get(`session-${sessionId}`);

    if(!session) 
    {
       return res.status(400).json({"message" : "session-expired"});
    }

    req.user = JSON.parse(session);

    return next();
   }

   catch(err)
   {
      return res.status(500).json({"Error Occured" : `${err}`});
   }
    



}

export default protect;