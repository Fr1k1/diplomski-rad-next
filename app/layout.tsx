import "./globals.css";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { createClient } from "@/utils/supabase/server";
import ScrollToTop from "@/components/ui/scrollToTop";
import { ToastContainer } from "react-toastify";
import ClientLayoutPart from "@/components/ui/ClientLayoutPart";

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
    <html lang="en">
      <body className="bg-bg">
        <main className="min-h-screen flex flex-col">
          <ScrollToTop />
          <ToastContainer />
          <Header isLoggedIn={isLoggedIn || false} isAdmin={isAdmin || false} />
          <ClientLayoutPart>{children}</ClientLayoutPart>
          <Footer />
        </main>
      </body>
    </html>
  );
}
