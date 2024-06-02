"use client";
import Link from "next/link";
import { SkeletonCarteTravailAR } from "@/Components/ui/SkeletonCarteTravailAR";
import { useStore } from "@/store/zustand";
import { formatDate } from "@/lib/utils";
import UserRoles from "@/schema/userRoles";
import { useEffect, useState } from "react";
import axios from "axios";

function CarteTravailAR({ data, variant }) {
  console.log("data", data);
  const { title, detail, slug, module, delais } = data;
  const [rendu, setRendu] = useState(false);
  const role = useStore((state) => state.userRole);
  const user = useStore((state) => state.user);
  if (!data || data.length == 0) return <SkeletonCarteTravailAR />;

  const formatedDate = formatDate(delais);
  const ouvert =
    role !== UserRoles.VerifiedStudent
      ? new Date() < new Date(delais)
      : undefined;

  useEffect(() => {
    const fetchState = async (travailARID, userId) => {
      try {
        const { data } = await axios.get(
          `/api/submissions?travailId=${travailARID}&userId=${userId}`
        );
        if (data && data?.submissions[0]?.ressources.length > 0) setRendu(true);
        else setRendu(false);
      } catch (error) {
        console.log("TAR state fetching error : ", error);
      }
    };
    if (data && user) fetchState(data._id, user.id);
  }, [data]);

  // -------------------------------------------------------------------------------------------

  // useEffect(() => {
  //   const fetchSubmissions = async () => {
  //     if (role === UserRoles.Teacher) {
  //       setloadingSubscriptions(true);
  //       try {
  //         const { data } = await axios.get(
  //           `/api/submissions?travailId=${travailAR._id}`
  //         );
  //         setSubmissions(data.submissions);
  //         console.log(data.submissions);
  //       } catch (error) {
  //         console.error(error);
  //       } finally {
  //         setloadingSubscriptions(false);
  //       }
  //     } else {
  //       try {
  //         const { data } = await axios.get(
  //           `/api/submissions?travailId=${travailAR._id}&userId=${user.id}`
  //         );
  //         setStudentRessources(data.submissions[0].ressources);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   };
  //   fetchSubmissions();
  // }, [travailAR]);
  // useEffect(() => {
  //   if (studentRessources.length > 0) {
  //     setIsRendu(true);
  //   }
  // }, [studentRessources]);

  // -------------------------------------------------------------------------------------------

  const cardStyling =
    variant === "card"
      ? "flex flex-col gap-2 p-4 rounded-md border border-gray-200 shadow-md"
      : "flex flex-col gap-2 border-b py-2";

  return (
    <div className={cardStyling}>
      <div className="flex flex-row justify-between items-start">
        <Link
          href={"/my/travail-a-rendre/" + slug}
          className="font-medium text-gray-900 hover:underline w-2/3"
        >
          {title}
        </Link>
        {role != "verified student" && ouvert ? (
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
      <h2 className="text-sm font-medium text-red-600">{module.name}</h2>
      <p className="text-sm text-gray-700">{detail.slice(0, 60)} ...</p>
      <div className="flex flex-row justify-between">
        <span className="text-gray-600 text-sm font-medium">
          Dernier Délais :
        </span>
        <span className="text-muted-foreground text-sm">
          {formatedDate.date} {formatedDate.time}
        </span>
      </div>
    </div>
  );
}

function RenduFlag() {
  return <span className="TARStateBadge bg-green-400">Rendu</span>;
}

function NonRenduFlag() {
  return <span className="TARStateBadge bg-red-400">Non Rendu</span>;
}
function OuvertFlag() {
  return <span className="TARStateBadge bg-green-400">Ouvert</span>;
}
function FermeFlag() {
  return <span className="TARStateBadge bg-red-400">Fermé</span>;
}

export default CarteTravailAR;
