For deployed frontend/backend on different domains:

res.cookie("session", sessionId, {
httpOnly: true,
secure: true,
sameSite: "none",
});

Also your frontend Axios must have:

withCredentials: true

and backend CORS must have:

credentials: true,
origin: "http://localhost:5173"

Your project already uses withCredentials: true and credentials: true.

› domai nmeans ?

• A domain is the human-readable name of a website/server.

Example:

google.com
github.com
vercel.app
yourwebsite.com

Without a domain, computers use IP addresses:

13.233.120.55

A domain points to an IP address.

Example:

api.myapp.com -> points to your EC2 public IP

For your project:

Frontend domain:
https://agentforge.vercel.app

Backend domain:
https://api.agentforge.com

or if you do not buy a domain yet:

Frontend:
https://your-project.vercel.app

Backend:
http://EC2_PUBLIC_IP:8000

But for secure cookies in production, it is better to use HTTPS and a real domain/subdomain for backend.

Simple meaning:

Domain = name of server/site
IP = actual address of server
DNS = system that connects domain name to IP

Example:

You type: google.com
DNS finds Google's server IP
Browser connects to that server

› [Image #1][Image #2] tell me waht to fill

• Fill Vercel like this:

Project Settings

Framework Preset: Vite
Root Directory: Frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install

Your screenshot already has:

Root Directory: Frontend
Application Preset: Vite

That is correct.

Environment Variables

Add these:

VITE_SERVER_URL=https://your-backend-api-url
VITE_FIREBASE_API_KEY=your_firebase_web_api_key

For now, if backend is still local, Vercel cannot call your local backend. After EC2 deployment, use:

VITE_SERVER_URL=https://api.yourdomain.com

or temporary EC2 public IP:

VITE_SERVER_URL=http://YOUR_EC2_PUBLIC_IP:8000

But for Google login cookies in production, better use HTTPS domain.

Where to get Firebase API key

Go to Firebase Console:

Project Settings -> General -> Your apps -> Web app config

Copy:

apiKey: "..."

Put that in Vercel as:

VITE_FIREBASE_API_KEY=...

After frontend deploys, Vercel will give you a URL like:

https://agentforge.vercel.app

Then in your backend Gateway .env, set:

FRONTEND_URL=https://agentforge.vercel.app

So final Vercel env should be only:

VITE_SERVER_URL=https://api.yourdomain.com
VITE_FIREBASE_API_KEY=your_key

› after ec2 i can change these variables ?

• Yes. You can change Vercel environment variables anytime after EC2 deployment.

Flow:

1. Deploy frontend now with temporary value, or leave backend URL if ready.
2. Deploy backend on EC2.
3. Get your backend URL, for example:

http://EC2_PUBLIC_IP:8000

or better:

https://api.yourdomain.com

4. Go to Vercel:

Project -> Settings -> Environment Variables

5. Change:

VITE_SERVER_URL=https://api.yourdomain.com

6. Redeploy the frontend.

Important: with Vite, env variables are baked into the frontend at build time. So after changing VITE_SERVER_URL, you must redeploy for it to take effect.

In Vercel:

Deployments -> latest deployment -> three dots -> Redeploy

Also after Vercel URL is created, update your EC2 Gateway .env:

FRONTEND_URL=https://your-vercel-app.vercel.app

Then restart Gateway.

› for env for now give me thee that i ahve in this proejct . for temproray only

• I’ll check whether this repo already has any frontend env examples or local .env files so I don’t invent variable names.

• Explored
└ Search .env in .
Search import\.meta\.env|process\.env in Frontend

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

• The frontend only uses two Vite variables. I’ll read the frontend .env shape and then give you exactly what to enter in Vercel, without dumping private values into chat.

• Explored
└ Read .env

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

• For Vercel temporary frontend env, add exactly these keys:

VITE_FIREBASE_API_KEY=your_current_frontend_env_api_key
VITE_SERVER_URL=http://localhost:8000

From your project, the current values are in:

Frontend/.env

Important: VITE_SERVER_URL=http://localhost:8000 is only temporary. The deployed Vercel app will build, but backend APIs/login will not work for real users because
localhost means the visitor’s own machine.

After EC2 deployment, change it to:

VITE_SERVER_URL=http://YOUR_EC2_PUBLIC_IP:8000

or better:

VITE_SERVER_URL=https://api.yourdomain.com

Then redeploy Vercel.

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

› i mean iam deplying fotend right and i need to add temproy env so i will isnert only frotned env on vercel right so give me taht fro mthis project and you knwo this
proejct well right ?

• Yes, for deploying only the frontend on Vercel, add only the frontend env variables.

From this project, Vercel needs these two:

VITE_FIREBASE_API_KEY=your_firebase_api_key_from_Frontend/.env
VITE_SERVER_URL=http://localhost:8000

So in Vercel add:

Key: VITE_FIREBASE_API_KEY
Value: your Firebase API key from Frontend/.env

Key: VITE_SERVER_URL
Value: http://localhost:8000

For temporary deployment, this is enough for the build.

But after deployment, API calls from Vercel will not reach your local backend. Once your EC2 backend is ready, replace:

VITE_SERVER_URL=http://localhost:8000

with:

VITE_SERVER_URL=http://EC2_PUBLIC_IP:8000

or preferably:

VITE_SERVER_URL=https://api.yourdomain.com

Then redeploy frontend.

› [Image #1] enviroment shoudl be producand adn rpeview

• Yes, select:

Production and Preview

That is fine.

Meaning:

Production = your real deployed site
Preview = temporary deployments from GitHub commits/branches/PRs

For now, use Production and Preview for both frontend env variables:

VITE_FIREBASE_API_KEY=...
VITE_SERVER_URL=http://localhost:8000

Later, after EC2, update VITE_SERVER_URL for Production and Preview to your EC2/backend URL, then redeploy.

› why npm run build

• Because Vercel needs to convert your React/Vite source code into static production files.

Your frontend code is in files like:

src/App.jsx
src/Components/ChatInput.jsx
src/index.css

Browsers cannot directly run the whole Vite development project as-is. So Vite builds it into optimized files inside:

dist/

Your Frontend/package.json has:

"scripts": {
"build": "vite build"
}

So:

npm run build

runs:

vite build

That creates:

Frontend/dist/index.html
Frontend/dist/assets/_.js
Frontend/dist/assets/_.css

Then Vercel serves that dist folder as your deployed website.

Simple flow:

React source code
-> npm run build
-> dist folder
-> Vercel hosts dist
-> browser opens your app

That is why:

Build Command: npm run build
Output Directory: dist

For your project, this is correct.

› [Image #1] wh y3 domains

• Vercel gives multiple URLs for the same deployment/project.

You have 3 because Vercel creates different aliases:

1. agentforge-psi-drab.vercel.app

This is your main production domain for the project. Use this as your frontend URL.

2. agentforge-git-main-rakshitnegi1234s-projects.vercel.app

This is branch-based URL. It points to the main branch deployment.

3. agentforge-7dqiouy4h-rakshitnegi1234s-projects.vercel.app

This is a unique deployment URL for this exact build.

Use this one for backend FRONTEND_URL:

FRONTEND_URL=https://agentforge-psi-drab.vercel.app

Project domain = stable app URL
Branch domain = stable URL for a Git branch
Deployment domain = unique URL for one exact deployment

For normal use, share/open:

https://agentforge-psi-drab.vercel.app

› wait shoudl i use ec2 or ecr can i do with ec2 ?

• Yes, you can do it with EC2 only.

You do not need ECR unless you want to deploy Docker images in a cleaner way.

Simple meaning:

EC2 = virtual server where your backend runs
ECR = Docker image storage/registry

For your project, beginner-friendly setup:

Frontend -> Vercel
Backend services -> EC2
MongoDB -> MongoDB Atlas
Redis -> EC2 Docker container or installed Redis

On EC2 you can run:

Gateway
Auth Service
Chat Service
Agent Service
Redis

using either:

PM2

or:

Docker Compose

You only need ECR if your flow is:

Build Docker image locally
-> Push image to ECR
-> Pull image on EC2/ECS
-> Run container

SSH into EC2
git clone your repo
npm install in each service
create .env files
run services with PM2

So answer: use EC2, skip ECR for now. ECR is optional, not required.

› event hoguh i have docker-compose.yml or docker ican do with ec2

• Yes. Even if you have docker-compose.yml, you can still deploy on EC2.

Actually EC2 + Docker Compose is a common setup.

Your current Backend/docker-compose.yml only runs Redis:

services:
redis:
image: redis
ports: - "6379:6379"

So on EC2 you can use Docker Compose just for Redis:

cd Backend
docker compose up -d

Then run backend services with PM2:

cd Backend/Gateway
npm install
pm2 start index.js --name gateway

cd ../Services/Auth
npm install
pm2 start index.js --name auth

cd ../Chat
npm install
pm2 start index.js --name chat

cd ../Agent
npm install
pm2 start index.js --name agent

EC2
├─ Redis via Docker Compose
├─ Gateway via PM2
├─ Auth via PM2
├─ Chat via PM2
└─ Agent via PM2

Later, you can also create a bigger docker-compose.yml that runs all services as containers, but for now your current Docker Compose is only for Redis.

› what is PM2

• PM2 is a process manager for Node.js apps.

When you run a backend normally:

node index.js

the server runs only while that terminal is open. If the terminal closes or the app crashes, your backend stops.

PM2 solves this.

With PM2:

pm2 start index.js --name gateway

PM2 keeps your Node.js service running in the background.

It can also:

restart app if it crashes
run app after EC2 reboot
show logs
show running services
stop/restart services easily

Useful commands:

pm2 start index.js --name gateway
pm2 start index.js --name auth
pm2 start index.js --name chat
pm2 start index.js --name agent

Check running apps:

pm2 list

See logs:

pm2 logs gateway

Restart:

pm2 restart gateway

Stop:

pm2 stop gateway

Make PM2 start again after EC2 reboot:

pm2 startup
For your project:

PM2 will keep Gateway, Auth, Chat, and Agent services alive on EC2.

Simple meaning:

node index.js = runs only in current terminal
pm2 start index.js = runs permanently in background

› now i shoud lcreae one isntance only and put auth chat gateway agent and redis tere?

• Yes. For your current stage, create one EC2 instance and put these on it:

Gateway
Auth Service
Chat Service
Agent Service
Redis

Use MongoDB Atlas separately for MongoDB.

Recommended setup:

Frontend: Vercel
Backend: one EC2 instance
Redis: same EC2
MongoDB: MongoDB Atlas

On the EC2:

Gateway -> port 8000
Auth -> port 8001
Chat -> port 8002
Agent -> port 8003
Redis -> port 6379

Expose publicly only:

Gateway port 8000

Auth, Chat, Agent, and Redis should not be publicly accessible. They should only be used internally by Gateway/Agent on the same EC2.

In EC2 security group, for now you need:

22 SSH
8000 Gateway API
80 HTTP, if using Nginx later
443 HTTPS, if using domain/SSL later

Do not open these publicly:

6379 Redis
8001 Auth
8002 Chat
8003 Agent

Inside .env, service URLs can use localhost:

Gateway .env:

PORT=8000
FRONTEND_URL=https://agentforge-psi-drab.vercel.app
AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
REDIS_URL=redis://localhost:6379

Auth/Chat/Agent can also use:

Agent also needs:

CHAT_SERVICE=http://localhost:8002
TAVILY_API_KEY=your_tavily_key
GROQ_API_KEY=your_groq_key

So yes: one EC2 is enough for now.

› [Image #1] tell me after craeting 1 isntance how i will put otehr servie sinside one

• Yes. Create 1 EC2 instance, then inside that one server you will run multiple Node processes.

Think of EC2 like one computer:

EC2 machine
├─ Gateway process on port 8000
├─ Auth process on port 8001
├─ Chat process on port 8002
├─ Agent process on port 8003
└─ Redis process on port 6379

Each service is just a separate Node app running on a different port.

For launching EC2, choose:

Name: agentforge-backend
AMI: Ubuntu or Amazon Linux
Instance type: t3.micro is okay for testing
Storage: 20 GB better than 8 GB

Security group:

22 SSH Your IP only
8000 Gateway API Anywhere for now, or your frontend later
80 HTTP Anywhere, if using Nginx later
443 HTTPS Anywhere, if using Nginx/SSL later

Do not expose these publicly:

8001 Auth
8002 Chat
8003 Agent
6379 Redis

After instance is created:

ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

Then install basics:

sudo apt update
sudo apt install -y nodejs npm git docker.io docker-compose-plugin
sudo npm install -g pm2

Clone your project:

git clone https://github.com/rakshitnegi1234/AGENTFORGE.git
cd AGENTFORGE

Install dependencies:

cd Backend/Gateway && npm install
cd ../Services/Auth && npm install
cd ../Chat && npm install
cd ../Agent && npm install

Run Redis:

cd ~/AGENTFORGE/Backend
sudo docker compose up -d

Create .env files for each service.

Gateway:

PORT=8000
FRONTEND_URL=https://agentforge-psi-drab.vercel.app
AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
REDIS_URL=redis://localhost:6379

Auth:

PORT=8001
MONGO_AUTH_URL=your_mongodb_atlas_url
REDIS_URL=redis://localhost:6379

Chat:

PORT=8002
MONGO_AUTH_URL=your_mongodb_atlas_url

Agent:

PORT=8003
MONGO_AUTH_URL=your_mongodb_atlas_url
CHAT_SERVICE=http://localhost:8002
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key

Then start each service with PM2:

cd ~/AGENTFORGE/Backend/Gateway
pm2 start index.js --name gateway

cd ~/AGENTFORGE/Backend/Services/Auth
pm2 start index.js --name auth

cd ~/AGENTFORGE/Backend/Services/Chat
pm2 start index.js --name chat

cd ~/AGENTFORGE/Backend/Services/Agent
pm2 start index.js --name agent

Check:

pm2 list

Save PM2 so services restart after EC2 reboot:

Main idea:

One EC2 instance can run many services.
Each service runs as a separate process.
Each process listens on a different port.
Gateway is public.
Other services stay internal through localhost.

› [Image #1] i have thes epalsn only

• Use:

t3.micro

For your current project/testing, t3.micro is fine and free-tier eligible.

It has:

2 vCPU
1 GB RAM

Your services:

Gateway
Auth
Chat
Agent
Redis

can run on it for testing/portfolio/demo, but it may feel tight because Node services + Redis + npm installs can use memory.

Better if available:

t3.small

because it has:

2 GB RAM

But if you want free tier / lowest cost, choose:

t3.micro

Do not choose:

c7i-flex.large
m7i-flex.large

t3.small
