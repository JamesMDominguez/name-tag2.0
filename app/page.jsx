'use client'
import { signOut } from "next-auth/react"

const BackgroundRemoval = () => {
  return (
    <div>
      <h1>Background Removal</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default BackgroundRemoval;
