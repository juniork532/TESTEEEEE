import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PainelSidebar } from "@/components/painel/sidebar"
import { PainelHeader } from "@/components/painel/header"

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-background flex">
      <PainelSidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <PainelHeader user={user} profile={profile} />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
