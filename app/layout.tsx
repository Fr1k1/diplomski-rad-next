import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import ClientLayoutPart from "@/components/ui/ClientLayoutPart";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Wavespotter",
  description: "Find a beach you like the most",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //za promjene na sucelju
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  let isLoggedIn = !!data.user;
  let isAdmin = false;

  if (data.user) {
    const { data: userData } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();

    isAdmin = !!userData?.is_admin;
  }
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <main className="min-h-screen flex flex-col">
          <Header isLoggedIn={isLoggedIn || false} isAdmin={isAdmin || false} />
          <ClientLayoutPart>{children}</ClientLayoutPart>
          <Footer />
        </main>
      </body>
    </html>
  );
}
