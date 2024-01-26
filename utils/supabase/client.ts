import { createBrowserClient } from "@supabase/ssr";
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';


export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export const supabase = createClient();

const firebaseConfig = {
  apiKey: "AIzaSyCCjWIZToi5mzvFWeOynRpEOWQyMYjmLnE",
  authDomain: "glitch-b2794.firebaseapp.com",
  databaseURL: "https://glitch-b2794-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "glitch-b2794",
  storageBucket: "glitch-b2794.appspot.com",
  messagingSenderId: "124197801380",
  appId: "1:124197801380:web:3805e52729963b12a6c531"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage();