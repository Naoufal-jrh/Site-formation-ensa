"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/extension/button";
import axios from "axios";
import { LogOutIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CarteProfile() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.get("/api/logout");
      router.refresh();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-2 text-center">
      <h3 className="text-sm font-meduim text-gray-900">
        Naoufaljrh2000@gmail.com
      </h3>
      <Avatar className="h-[80px] w-[80px]">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>TM</AvatarFallback>
      </Avatar>
      <h1 className="text-lg font-bold">Jrhaider Naoufal</h1>
      <h2 className="text-sm font-medium text-gray-500">
        Cybersecurity & Intelligence Artificielle
      </h2>
      <span className="text-xs text-muted-foreground">
        Première année, Semester 2
      </span>

      <Button
        variant="ghost"
        className="w-full border-t mt-2"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOutIcon />
        )}
        Déconnecté
      </Button>
    </div>
  );
}

export default CarteProfile;
