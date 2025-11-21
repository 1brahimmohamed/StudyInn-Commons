import { getAllReservations } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminView } from "@/components/admin-view";

export default async function AdminPage() {
  const result = await getAllReservations();
  const reservations = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">
                  Manage all reservations
                </p>
              </div>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AdminView reservations={reservations} />
      </main>
    </div>
  );
}
