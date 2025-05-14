import React from "react";

const ContentApp: React.FC = () => {
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "10px",
      backgroundColor: "white",
      border: "1px solid black",
      zIndex: 9999
    }}>
      <h2>Hello from Content Script!</h2>
    </div>
  );
};

export default ContentApp;




// import React, { useEffect, useState } from "react";
// import "@assets/styles/tailwind.css";
// import FloatingButton from "./pages/content/FloatingButton";
// import { detectAndInjectButtons, initializeObserver } from './services/adDetection';


// // Main Content Application
// const ContentApp: React.FC = () => {
//   const [user, setUser] = useState<any | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Initialize the observer and first run of detector
//     initializeObserver();
//     detectAndInjectButtons();

//     // Check for user authentication
//     chrome.storage.sync.get("user", (result) => {
//       if (result.user) {
//         setUser(result.user);
//         setIsAuthenticated(true);
//       }
//     });

//     // Set up message listener for auth changes
//     const messageListener = (message: any) => {
//       if (message.action === "AUTH_CHANGED") {
//         chrome.storage.sync.get("user", (result) => {
//           setUser(result.user || null);
//           setIsAuthenticated(!!result.user);
//         });
//       }
//     };

//     chrome.runtime.onMessage.addListener(messageListener);

//     // Clean up
//     return () => {
//       chrome.runtime.onMessage.removeListener(messageListener);
//     };
//   }, []);

//   return (
//     <>
//       {/* Floating control button */}
//       <div className="fixed bottom-4 left-4 z-50">
//         <FloatingButton />
//       </div>
//     </>
//   );
// };

// export default ContentApp;