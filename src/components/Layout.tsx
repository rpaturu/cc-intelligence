import Navbar from "./Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar />
      </div>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
} 