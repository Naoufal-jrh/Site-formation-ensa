"use client";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import file_down from "../../../../../public/file-down.svg";
import Link from "next/link";
import { useStore } from "@/store/zustand";
import { useEffect, useState } from "react";
import Loader from "@/app/loading";
import { Trash2 } from "lucide-react";
import SubmissionsTable from "@/Components/Sections/SubmissionsTable";
import FormAddSubmission from "@/Components/Forms/FormAddSubmission";
import axios from "axios";
import UserRoles from "@/schema/userRoles";
import RessourceLink from "@/Components/ui/ressourceLink";

function TravailDetail({ params }) {
  const role = useStore((state) => state.userRole);
  const user = useStore((state) => state.user);
  const [isRendu, setIsRendu] = useState(false);
  const [submissions, setSubmissions] = useState();
  const [studentRessources, setStudentRessources] = useState([]);
  const [travailAR, setTravailAR] = useState(null);
  const { slug } = params;
  const [loadingSubscriptions, setloadingSubscriptions] = useState(false);

  useEffect(() => {
    const fetchTravailAR = async () => {
      try {
        const { data } = await axios.get(`/api/travailAR/${slug}`);
        setTravailAR(data.travail);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTravailAR();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (role === UserRoles.Teacher) {
        setloadingSubscriptions(true);
        try {
          const { data } = await axios.get(
            `/api/submissions?travailId=${travailAR._id}`
          );
          setSubmissions(data.submissions);
          console.log(data.submissions);
        } catch (error) {
          console.error(error);
        } finally {
          setloadingSubscriptions(false);
        }
      } else {
        try {
          const { data } = await axios.get(
            `/api/submissions?travailId=${travailAR._id}&userId=${user.id}`
          );
          setStudentRessources(data.submissions[0].ressources);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchSubmissions();
  }, [travailAR]);
  useEffect(() => {
    if (studentRessources.length > 0) {
      setIsRendu(true);
    }
  }, [studentRessources]);
  if (!travailAR) return <Loader />;

  const { title, detail, module, delais, ressources } = travailAR;
  const courSlug = module.slug;
  const cours = module.name;

  // Extraire la date au format YYYY-MM-DD
  const date_delais = new Date(delais).toISOString().split("T")[0];
  // Extraire l'heure au format HH:MM:SS
  const time_delais = new Date(delais)
    .toISOString()
    .split("T")[1]
    .split(".")[0];
  return (
    <div className="lg:px-28 px-8 2xl:px-80 py-8 flex gap-7 flex-col">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/my/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my/travail-a-rendre">
              A rendre
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={"/my/cours/" + courSlug}>
              {cours}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex md:flex-row flex-col gap-5 md:justify-between">
        <main className="lg:w-[62%] w-full text-left flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <h1 className="md:text-4xl text-3xl font-bold">{title}</h1>
            <p className="text-slate-700 md:text-sm text-xs">{cours}</p>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-gray-500 font-semibold">
              A rendre avant :
            </span>
            <span className="text-muted-foreground">
              {date_delais} {time_delais}s
            </span>
          </div>
          <p className="text-sm text-gray-900">{detail}</p>
          <div>
            <h2 className="font-bold md:text-lg text-left">Ressourses :</h2>
            {ressources.map((ressource, index) => (
              <div className="flex justify-between items-center" key={index}>
                <div className="inline-flex items-center my-2">
                  <Image src={file_down} width={20} alt="file-down" />
                  <Link
                    href={ressource.url}
                    target="_blank"
                    className="text-sm underline hover:text-red-400 ml-2"
                  >
                    {ressource.title}
                  </Link>
                </div>
                {role === "teacher" && (
                  <Link href="#" target="_blank">
                    <Trash2 className="w-4 hover:text-red-600" />
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div>
            {role === "teacher" && (
              <div>
                <h2 className="font-bold md:text-lg text-left">
                  Soumissions :
                </h2>
                <SubmissionsTable
                  submissions={submissions}
                  loading={loadingSubscriptions}
                />
              </div>
            )}
          </div>
        </main>
        {role === "verified student" && (
          <aside className="lg:w-1/3 w-full">
            <div className="p-4 rounded-md border border-gray-200 shadow-md mb-4 flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <h3 className="font-bold text-gray-900">
                  Soumettez votre travail
                </h3>
                {isRendu ? <RenduFlag /> : <NonRenduFlag />}
              </div>
              {studentRessources.length > 0 && (
                <div>
                  <h2 className="font-bold md:text-lg text-left">
                    Vos soumissions :
                  </h2>
                  {studentRessources.map((ressource, index) => (
                    <RessourceLink ressource={ressource} index={index} />
                  ))}
                </div>
              )}
              {new Date(travailAR.delais) > new Date() ? (
                <FormAddSubmission slug={slug} />
              ) : (
                <p className="text-red-500">
                  La date limite de soumission est dépassée
                </p>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function RenduFlag() {
  return (
    <span className="rounded-lg bg-green-400 text-xs text-white p-1.5">
      Rendu
    </span>
  );
}

function NonRenduFlag() {
  return (
    <span className="rounded-lg bg-red-400 text-xs text-white p-1.5">
      Non Rendu
    </span>
  );
}

export default TravailDetail;
