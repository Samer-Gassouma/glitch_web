


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "GLITCH",
  description: "GLITCH",
};



export default async function  RootLayout({
  children,
}: {
  children:any
}) {

    return children;
  }
  




