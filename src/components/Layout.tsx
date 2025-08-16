import Navbar from "./Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
} 