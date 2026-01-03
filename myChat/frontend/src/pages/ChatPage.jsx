import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { auth } from "../../firebase";

function ChatPage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    activeTab,
    selectedUser,
    setCurrentUser,
    clearChatState
  } = useChatStore();

  // 🔐 Firebase auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
          photoURL: user.photoURL || null
        });
      } else {
        clearChatState();
        navigate("/login"); // 🚀 redirect if not logged in
      }
      setCheckingAuth(false);
    });

    return () => unsub();
  }, [setCurrentUser, clearChatState, navigate]);

  // ⏳ While checking auth
  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-slate-300">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;
