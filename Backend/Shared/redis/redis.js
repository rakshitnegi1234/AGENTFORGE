import Redis from "ioredis";

//   ioredis pkg is only the Node.js client. It lets your backend talk to a Redis server. But Redis itself
// must be running somewhere.


const redis = new Redis(process.env.REDIS_URL);
// This line creates a Redis client connection from your Node.js backend to the Redis server.



redis.on("connect",()=>
{
  console.log("redis is Connected");
});

export default redis;