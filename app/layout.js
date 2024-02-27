import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";
import Provider from './context/client-provider'
import { authOptions } from "./api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Name Tag App",
  description: "A simple app to create and share name tags.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={inter.className}>
      <ApolloWrapper><Provider session={session}>{children}</Provider></ApolloWrapper>
      </body>
    </html>
  );
}
