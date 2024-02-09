
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect,usePathname } from 'next/navigation';

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
  children: any;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let is_admin = false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
    

  if (!user) {
    redirect("/login?message=You need to login first");
  } else {
    const {data : userRole} = await supabase.from('users').select('is_admin').eq('id', user.id);
    if (userRole !== null) {
      if (userRole[0].is_admin) {
        is_admin = true;
      }
    }

    if (!is_admin) {
      redirect("/");
    }
    return children;
  }

  

}


