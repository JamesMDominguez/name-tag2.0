import { redirect } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react"

export default function isAuth(Component) {
  return function IsAuth(props) {
    const { data: session, status } = useSession()    
    if (status == 'unauthenticated') {
      return redirect("/Login");
    }
    return <Component {...props} />;
  };
}