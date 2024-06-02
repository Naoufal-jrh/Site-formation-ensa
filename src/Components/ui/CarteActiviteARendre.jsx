"use client";
import Link from "next/link";
import { useStore } from "@/store/zustand";
import { formatDate } from "@/lib/utils";

function CarteActiviteARendre({ data }) {
  const { title, slug, module, delais, rendu } = data;
  const formatedDate = formatDate(delais);
  const role = useStore((state) => state.userRole);

  const ouvert = new Date() < new Date(delais);

  return (
    <div className="flex flex-col gap-2 border-b py-2">
      <div className="flex flex-row justify-between">
        <Link
          href={"/my/travail-a-rendre/" + slug}
          className="font-bold text-gray-700 text-md hover:underline"
        >
          {title}
        </Link>
        {role != "verified student" ? (
          ouvert ? (
            <OuvertFlag />
          ) : (
            <FermeFlag />
          )
        ) : rendu ? (
          <RenduFlag />
        ) : (
          <NonRenduFlag />
        )}
      </div>
      <h2 className="text-sm">{module.name}</h2>
      <div className="flex flex-row justify-between text-sm">
        <span className="text-gray-500 font-semibold">Dernier Délais :</span>
        <span className="text-muted-foreground">
          {formatedDate.date} {formatedDate.time}
        </span>
      </div>
    </div>
  );
}

function RenduFlag() {
  return <span className="text-green-400">Rendu</span>;
}
function NonRenduFlag() {
  return <span className="text-red-400">Non Rendu</span>;
}
function OuvertFlag() {
  return <span className="text-green-400">Ouvert</span>;
}
function FermeFlag() {
  return <span className="text-red-400">Fermé</span>;
}

export default CarteActiviteARendre;
