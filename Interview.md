# Redux, Context, Slices, User State, and Artifact Preview

## 1. What Is Redux?

Redux is a global state management library.

In a React app, every component has its own local state. Example:

```js
const [open, setOpen] = useState(false);
```

This is good when only one component needs that value.

But sometimes many unrelated components need the same value:

- logged-in user data
- selected conversation
- messages
- artifact panel state
- theme
- cart data
- permissions

Passing this data through props again and again becomes hard. This is called prop drilling.

Redux solves this by creating one central store.

Think of the Redux store like one shared memory object for the frontend:

```js
{
  user: {
    userData: null
  },
  conversation: {
    conversations: [],
    selectedConversation: null
  },
  message: {
    messages: []
  },
  artifact: {
    activeArtifact: null,
    activeConversationId: null,
    dismissedByConversation: {},
    isOpen: true
  }
}
```

Any component can read from this store using `useSelector`.

Any component can update this store using `dispatch`.

## 2. Why Do We Need Redux?

We need Redux when state is shared across many parts of the app.

In this project, Redux is useful because:

- `Home.jsx` needs to know if the user is logged in.
- `SideBar.jsx` needs user data and conversations.
- `ChatArea.jsx` needs selected conversation.
- `MessageList.jsx` needs messages and artifact dismissal state.
- `Artifacts.jsx` needs active artifact data.
- `ChatInput.jsx` needs selected conversation and messages, and also updates messages/artifacts.

Without Redux, we would need to pass data from parent to child many times:

```text
App
 -> Home
    -> SideBar
    -> ChatArea
       -> MessageList
       -> ChatInput
    -> Artifacts
```

Redux avoids this prop drilling.

## 3. Context API vs Redux Rerender Question

Question:

Is it true that with `createContext`, if one thing changes, then other children who do not use that prop can also rerender, and Redux solves this?

Answer:

Partly yes, but with some nuance.

### Context First Principle

React Context works like this:

```jsx
<MyContext.Provider value={someValue}>
  <ChildA />
  <ChildB />
  <ChildC />
</MyContext.Provider>
```

If the `value` passed to the provider changes, React notifies all components that consume that context.

Example:

```js
const value = {
  user,
  theme,
  messages,
};
```

If only `messages` changes, the full `value` object becomes new. So every component using that context can rerender, even if it only needs `user`.

Example:

```js
const { user } = useContext(AppContext);
```

This component only needs `user`, but if `messages` changes inside the same context object, this component can still rerender because the context value changed.

### Do Children Who Do Not Use Context Also Rerender?

If a child does not consume context at all, Context itself does not directly force that child to rerender.

But if its parent rerenders, then normal React rendering can cause children to rerender too, unless they are memoized with `React.memo`.

So there are two cases:

```text
Context consumer changed -> context consumers rerender
Parent rerendered -> children may rerender because parent rendered
```

### How Redux Helps

Redux uses a subscription model.

With Redux, a component subscribes to only the selected part of the store:

```js
const { userData } = useSelector((state) => state.user);
```

This component mainly cares about `state.user`.

If `state.artifact.activeArtifact` changes, Redux will check the selected value. If the selected user value did not change, this component usually does not rerender because of that Redux update.

So yes, Redux helps reduce unnecessary rerenders compared to putting one large object in Context.

But Redux does not magically stop every rerender. If a parent component rerenders, children can still rerender through normal React behavior.

Short interview answer:

Redux is better for larger shared state because each component can subscribe to a specific slice of the store using `useSelector`. Context is simpler, but if we put a big object in one context, many consumers can rerender whenever any part of that object changes.

## 4. What Is A Slice?

In Redux Toolkit, a slice means one section of the global store.

Example:

```js
user
artifact
conversation
message
```

Each slice contains:

- initial state
- reducer functions
- generated actions

Reducer means a function that updates state.

Action means an object that describes what update should happen.

Redux Toolkit's `createSlice` creates both reducer and action functions automatically.

## 5. Store Setup In This Project

File:

```text
Frontend/src/Redux/store.js
```

Code:

```js
import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice";
import conversationReducer from "./conversation.Slice";
import messageReducer from "./messageSlice.js";
import artifactReducer from "./artifactSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation : conversationReducer,
    message : messageReducer,
    artifact : artifactReducer
  }, 
});
```

Line by line:

```js
import { configureStore } from '@reduxjs/toolkit'
```

This imports Redux Toolkit's store creation function.

```js
import userReducer from "./userSlice";
import conversationReducer from "./conversation.Slice";
import messageReducer from "./messageSlice.js";
import artifactReducer from "./artifactSlice.js";
```

These import reducers from different slices.

Each reducer controls one part of the global state.

```js
export const store = configureStore({
```

This creates the Redux store and exports it.

```js
  reducer: {
    user: userReducer,
    conversation : conversationReducer,
    message : messageReducer,
    artifact : artifactReducer
  },
```

This defines the shape of the global store.

So the final Redux state looks like:

```js
state.user
state.conversation
state.message
state.artifact
```

In `main.jsx`, this store is connected to React:

```js
<Provider store={store}>
  <App />
</Provider>
```

This means every component inside `<App />` can use Redux.

## 6. User Slice Explanation

File:

```text
Frontend/src/Redux/userSlice.js
```

Code:

```js
import { createSlice } from "@reduxjs/toolkit";
```

This imports `createSlice`.

`createSlice` helps us create Redux state, reducers, and actions in one place.

```js
const userSlice = createSlice({
```

This creates a slice named `userSlice`.

```js
  name: "user",
```

This is the slice name. Redux Toolkit uses it to generate action types like:

```text
user/setUserdata
```

```js
  initialState: {
    userData: null,
  },
```

This is the initial user state.

At first, no user is logged in, so `userData` is `null`.

After login, it may become:

```js
{
  _id: "mongo-user-id",
  name: "Rakshit",
  email: "rakshit@example.com",
  avatar: "profile-image-url"
}
```

```js
  reducers: {
```

This object contains functions that can update user state.

```js
    setUserdata: (state, action) => {
      state.userData = action.payload;
    },
```

This reducer updates `userData`.

`action.payload` means the data passed while dispatching.

Example:

```js
dispatch(setUserdata(data));
```

Here, `data` becomes `action.payload`.

So this:

```js
dispatch(setUserdata(data));
```

causes this update:

```js
state.user.userData = data;
```

Important point:

In normal Redux, we should not directly mutate state.

But Redux Toolkit uses Immer internally, so this is allowed:

```js
state.userData = action.payload;
```

Immer converts it into an immutable update behind the scenes.

```js
export const { setUserdata } = userSlice.actions;
```

This exports the action function.

Now any component can do:

```js
dispatch(setUserdata(user));
```

```js
export default userSlice.reducer;
```

This exports the reducer so `store.js` can attach it to:

```js
state.user
```

## 7. How User Data Is Used In This Project

In `Home.jsx`, after Google login:

```js
const { data } = await api.post("/api/v1/auth/login", { token });
dispatch(setUserdata(data));
```

Flow:

```text
Google login
 -> Firebase ID token
 -> frontend sends token to backend
 -> backend verifies token
 -> backend returns user
 -> frontend stores user in Redux
```

In `App.jsx`, when the app loads:

```js
const data = await getCurrentUser();
dispatch(setUserdata(data?.userId ? { ...data, _id: data.userId } : data));
```

This checks if a session cookie already exists.

If yes, it stores the current user in Redux.

In `SideBar.jsx`, user data is read using:

```js
const { userData } = useSelector((state) => state.user);
```

This means:

```text
Read state.user.userData from Redux
```

If `userData` exists, sidebar shows profile image/name and loads conversations.

If `userData` is null, sidebar clears conversations and messages.

## 8. Artifact Slice Explanation

File:

```text
Frontend/src/Redux/artifactSlice.js
```

Code:

```js
import { createSlice } from "@reduxjs/toolkit";
```

This imports Redux Toolkit's slice helper.

```js
const artifactSlice = createSlice({
```

This creates the artifact slice.

```js
  name: "artifact",
```

The slice name is `artifact`.

Its actions will have names like:

```text
artifact/setArtifact
artifact/clearArtifact
artifact/setArtifactOpen
```

```js
  initialState: {
    activeArtifact: null,
    activeConversationId: null,
    dismissedByConversation: {},
    isOpen: true,
  },
```

This is the starting artifact state.

Meaning:

```js
activeArtifact: null
```

No artifact is currently selected.

```js
activeConversationId: null
```

No artifact is attached to any selected conversation yet.

```js
dismissedByConversation: {}
```

This stores which conversation's artifact was dismissed by the user.

Example:

```js
{
  "conversation123": 1720000000000
}
```

This means the artifact for that conversation was dismissed at that time.

```js
isOpen: true
```

The artifact panel starts open.

### setArtifact Reducer

```js
setArtifact: (state, action) => {
  const artifact = action.payload?.artifact || action.payload;
  const conversationId = action.payload?.conversationId;

  state.activeArtifact = artifact;
  state.activeConversationId = conversationId || null;
  state.isOpen = true;

  if (conversationId) {
    delete state.dismissedByConversation[conversationId];
  }
},
```

Line by line:

```js
const artifact = action.payload?.artifact || action.payload;
```

This supports two dispatch styles.

Style 1:

```js
dispatch(setArtifact(artifact));
```

Style 2:

```js
dispatch(setArtifact({
  artifact,
  conversationId
}));
```

If `action.payload.artifact` exists, it uses that. Otherwise, it treats the whole payload as the artifact.

```js
const conversationId = action.payload?.conversationId;
```

This extracts the conversation id from the payload.

```js
state.activeArtifact = artifact;
```

This stores the artifact object in Redux.

Artifact object can look like:

```js
{
  title: "Todo App",
  language: "html",
  code: "<!doctype html>...",
  preview: "<!doctype html>...",
  files: {
    html: "...",
    css: "...",
    js: "..."
  }
}
```

```js
state.activeConversationId = conversationId || null;
```

This connects the artifact to a specific conversation.

This is important because when you switch conversations, the app should not show the wrong artifact.

```js
state.isOpen = true;
```

Whenever a new artifact is created, the artifact panel opens automatically.

```js
if (conversationId) {
  delete state.dismissedByConversation[conversationId];
}
```

If the user previously dismissed the artifact for this conversation, this removes that dismissed record because there is now a fresh active artifact.

### clearArtifact Reducer

```js
clearArtifact: (state, action) => {
  const conversationId =
    action.payload?.conversationId || state.activeConversationId;

  state.activeArtifact = null;
  state.activeConversationId = null;

  if (conversationId) {
    state.dismissedByConversation[conversationId] =
      action.payload?.dismissedAt || Date.now();
  }
},
```

Line by line:

```js
const conversationId =
  action.payload?.conversationId || state.activeConversationId;
```

This finds which conversation's artifact is being cleared.

It first checks `action.payload.conversationId`.

If not found, it uses the current `state.activeConversationId`.

```js
state.activeArtifact = null;
state.activeConversationId = null;
```

This removes the currently active artifact from Redux.

```js
if (conversationId) {
  state.dismissedByConversation[conversationId] =
    action.payload?.dismissedAt || Date.now();
}
```

This stores the dismissal time for that conversation.

Why?

When old messages are loaded again, the frontend checks if the artifact was dismissed. If it was dismissed after that assistant message was created, it does not reopen the artifact automatically.

### setArtifactOpen Reducer

```js
setArtifactOpen: (state, action) => {
  state.isOpen = action.payload;
},
```

This opens or closes the artifact panel.

Example:

```js
dispatch(setArtifactOpen(false));
```

closes the panel.

```js
dispatch(setArtifactOpen(true));
```

opens the panel.

```js
export const { setArtifact, clearArtifact, setArtifactOpen } =
  artifactSlice.actions;
```

This exports all action functions.

```js
export default artifactSlice.reducer;
```

This exports the artifact reducer for the Redux store.

## 9. useDispatch And useSelector

Yes, this project uses:

```js
useSelector
```

to read values from Redux.

And:

```js
useDispatch
```

to modify values in Redux.

### useSelector

Example:

```js
const { userData } = useSelector((state) => state.user);
```

Meaning:

```text
Get userData from Redux state.user
```

Another example:

```js
const { activeArtifact, activeConversationId, isOpen } = useSelector(
  (state) => state.artifact,
);
```

Meaning:

```text
Get artifact state from Redux state.artifact
```

### useDispatch

Example:

```js
const dispatch = useDispatch();
dispatch(setUserdata(data));
```

Meaning:

```text
Send an action to Redux
Redux runs reducer
Redux updates store
Components using that selected value rerender
```

## 10. Where Is Artifact Data Stored?

Artifact data is stored in frontend Redux, inside:

```js
state.artifact.activeArtifact
```

It is not stored as a separate artifact document in MongoDB.

The assistant message is stored in the backend Chat service.

The artifact is derived from that assistant message on the frontend.

There are two artifact creation paths.

## 11. Artifact Creation Path 1: New Message Send

In `ChatInput.jsx`, user sends a prompt.

Frontend creates payload:

```js
const payload = {
  prompt,
  conversationId: activeConversation._id,
  agent: selectedAgent.toLowerCase(),
};
```

Then it calls:

```js
const data = await sendMessage(payload);
```

`sendMessage.js` does this API call:

```js
const {data} = await api.post("/api/v1/agent/chat", payload);
```

So yes, here the frontend calls the backend Agent API.

Backend returns assistant response:

```js
{
  response,
  aiResponse: response,
  selectedAgent
}
```

Then frontend extracts the assistant content:

```js
const assistantContent =
  typeof data === "string"
    ? data
    : data?.response || data?.content || data?.aiResponse;
```

Then frontend tries to create an artifact:

```js
const artifact = createArtifactFromResponse({
  prompt,
  response: assistantContent,
});
```

If artifact exists:

```js
dispatch(
  setArtifact({
    artifact,
    conversationId: activeConversation._id,
  }),
);
```

So the data goes here:

```text
Redux store -> state.artifact.activeArtifact
```

## 12. Artifact Creation Path 2: Loading Old Conversation

When you open an old conversation, `MessageList.jsx` fetches messages:

```js
const { data } = await api.get(
  `/api/v1/chat/get-message/${selectedConversation._id}`,
);
```

So yes, on old conversation load, the frontend calls the Chat API to fetch saved messages.

Then it loops through assistant messages from newest to oldest:

```js
for (let index = orderedMessages.length - 1; index >= 0; index -= 1) {
  const message = orderedMessages[index];

  if (message.role !== "assistant") continue;

  const artifact = createArtifactFromResponse({
    prompt,
    response: message.content,
  });

  if (artifact) {
    dispatch(
      setArtifact({
        artifact,
        conversationId: selectedConversation._id,
      }),
    );
    break;
  }
}
```

Meaning:

```text
Fetch old messages
 -> find latest assistant message with previewable code
 -> create artifact object on frontend
 -> store artifact object in Redux
```

So artifact is not fetched from a separate artifact API.

It is recreated from saved assistant message content.

## 13. How createArtifactFromResponse Works

File:

```text
Frontend/src/Features/artifactTemplates.js
```

Main function:

```js
export const createArtifactFromResponse = ({ prompt, response }) => {
  const normalizedPrompt = String(prompt || "").toLowerCase();
  const promptArtifact = getPromptArtifact(normalizedPrompt);

  if (promptArtifact) return promptArtifact;

  const htmlArtifact = getPreviewableArtifact(response);

  if (htmlArtifact) return htmlArtifact;

  return null;
};
```

Line by line:

```js
const normalizedPrompt = String(prompt || "").toLowerCase();
```

This makes the prompt lowercase so checks are easier.

Example:

```text
Build a Todo App
```

becomes:

```text
build a todo app
```

```js
const promptArtifact = getPromptArtifact(normalizedPrompt);
```

This checks if the prompt matches predefined templates.

For example:

- calculator
- todo app
- MEA calculator

If matched, the frontend uses a built-in HTML template.

```js
if (promptArtifact) return promptArtifact;
```

If template exists, return it.

```js
const htmlArtifact = getPreviewableArtifact(response);
```

If no template exists, inspect the AI response.

It searches for fenced code blocks like:

````md
```html
<!doctype html>
<html>
...
</html>
```
````

If it finds previewable HTML, it creates an artifact.

```js
if (htmlArtifact) return htmlArtifact;
```

If previewable HTML exists, return artifact.

```js
return null;
```

If no artifact can be created, return null.

So not every assistant response creates an artifact.

Only frontend app/code responses create artifacts.

## 14. How Artifact Preview Works

In `Artifacts.jsx`, artifact data is read from Redux:

```js
const { activeArtifact, activeConversationId, isOpen } = useSelector(
  (state) => state.artifact,
);
```

Then it checks if the artifact belongs to the selected conversation:

```js
const visibleArtifact =
  selectedConversation?._id &&
  activeConversationId === selectedConversation._id
    ? activeArtifact
    : null;
```

Meaning:

```text
Only show artifact if:
selected conversation id === artifact conversation id
```

This prevents showing one conversation's artifact inside another conversation.

When Preview tab is active:

```jsx
<iframe
  className="h-full w-full rounded-lg border border-slate-200 bg-white shadow-2xl shadow-black/10"
  title={activeArtifact.title}
  srcDoc={activeArtifact.preview}
/>
```

This is the actual preview.

## 15. What Is iframe?

`iframe` means inline frame.

First principle:

A normal React component renders inside the current page.

An iframe creates a separate mini browser page inside the current page.

Example:

```html
<iframe src="https://example.com"></iframe>
```

This loads `example.com` inside your page.

In this project, the iframe is used to preview generated HTML apps.

Why iframe is useful here:

- generated HTML has its own CSS
- generated HTML has its own JavaScript
- we do not want generated CSS to break the main React app
- we do not want generated DOM elements to mix with React's DOM

So iframe gives isolation.

Think of it like:

```text
Main React app
  contains
    iframe
      contains
        generated HTML app
```

## 16. What Is srcDoc?

Usually iframe loads a URL:

```html
<iframe src="https://example.com"></iframe>
```

But `srcDoc` lets us provide the HTML string directly:

```html
<iframe srcDoc="<html><body>Hello</body></html>"></iframe>
```

So instead of loading a website from a URL, the iframe renders the HTML string we already have in memory.

In this project:

```jsx
srcDoc={activeArtifact.preview}
```

means:

```text
Take activeArtifact.preview
Treat it like a complete HTML document
Render it inside iframe
```

Example artifact preview:

```js
activeArtifact.preview = `
<!doctype html>
<html>
  <head>
    <style>
      body { font-family: sans-serif; }
    </style>
  </head>
  <body>
    <button>Click me</button>
    <script>
      console.log("artifact running");
    </script>
  </body>
</html>
`;
```

Then:

```jsx
<iframe srcDoc={activeArtifact.preview} />
```

renders that whole app inside the iframe.

Important security note:

The current code uses `srcDoc`, but does not use the iframe `sandbox` attribute.

For safer generated-code previews, we should usually add a sandbox like:

```jsx
<iframe
  title={activeArtifact.title}
  srcDoc={activeArtifact.preview}
  sandbox="allow-scripts"
/>
```

But sandbox permissions must be chosen carefully depending on what generated apps need to do.

## 17. Complete Artifact Data Flow

For a new prompt:

```text
User types prompt
 -> ChatInput sends POST /api/v1/agent/chat
 -> Agent backend returns assistant response
 -> frontend checks response for HTML/code artifact
 -> frontend creates artifact object
 -> dispatch(setArtifact(...))
 -> Redux stores artifact in state.artifact.activeArtifact
 -> Artifacts component reads artifact using useSelector
 -> iframe renders activeArtifact.preview using srcDoc
```

For an old conversation:

```text
User selects conversation
 -> MessageList calls GET /api/v1/chat/get-message/:conversationId
 -> frontend receives old messages
 -> frontend scans assistant messages for previewable HTML
 -> frontend creates artifact object again
 -> dispatch(setArtifact(...))
 -> Redux stores artifact
 -> iframe previews it
```

## 18. Short Interview Answer

Redux is a global state manager. We use it when multiple components need the same state without prop drilling. In Redux Toolkit, we split state into slices like `user`, `message`, `conversation`, and `artifact`. Components read state using `useSelector` and update state using `dispatch`.

Context API is useful for small shared state, but if we put a large object in one context, every consumer of that context may rerender when any part of the context value changes. Redux helps because components subscribe to specific selected values from the store, so unrelated slice updates usually do not rerender them.

In this project, user login data is stored in `state.user.userData`. Artifact preview data is stored in `state.artifact.activeArtifact`. The artifact is not fetched from a separate backend artifact API. It is created on the frontend from the assistant response or recreated from saved assistant messages. The preview is shown using an iframe, and `srcDoc` passes the generated HTML string directly into that iframe.
