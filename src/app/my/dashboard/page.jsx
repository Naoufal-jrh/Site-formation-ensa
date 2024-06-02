"use client";
import CarteActiviteARendre from "@/Components/ui/CarteActiviteARendre";
import CarteCours from "@/Components/ui/CarteCours";
import { ScrollArea } from "@/Components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/Components/ui/extension/button";
import { useStore } from "@/store/zustand";
import Loader from "@/app/loading";
import { useEffect, useState } from "react";
import { SkeletonCard } from "@/Components/ui/SkeletonCard";
import { SkeletonList } from "@/Components/ui/SkeletonList";
import { UserRoles } from "@/schema/userRoles";
import CarteTravailAR from "@/Components/ui/CarteTravailAR";

function Dashboard() {
  const user = useStore((state) => state.user);
  const isLoading = useStore((state) => state.isLoading);
  const role = useStore((state) => state.userRole);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [travailARLoading, setTravailARLoading] = useState(true);

  const firstName = user.firstname || "";
  const lastName = user.lastname || "";

  const courses = useStore((state) => state.courses);
  console.log("courses", courses);
  const fetchCourses = useStore((state) => state.fetchCourses);

  let travailAR = useStore((state) => state.travailAR);
  const fetchTravailAR = useStore((state) => state.fetchTravailAR);

  useEffect(() => {
    async function fetchData() {
      setCoursesLoading(true);
      setTravailARLoading(true);

      await fetchCourses();
      await fetchTravailAR();

      setCoursesLoading(false);
      if (role === "verified student") {
        travailAR = travailAR.filter((item) => item.rendu === false);
      }
      setTravailARLoading(false);
    }

    fetchData();
  }, []);

  console.log("travailAR", travailAR);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="lg:px-28 px-8 2xl:px-80 py-8 flex md:flex-row flex-col gap-4">
      <main className="lg:w-2/3 w-full">
        <h1 className="pageHeader flex justify-between mb-6 items-center">
          Dashboard
        </h1>
        {/* <h2 className="text-md mb-6 capitalize text-gray-700 ">
          Bienvenu{" "}
          <span className="font-medium text-black">
            {firstName} {lastName}
          </span>{" "}
          !
        </h2> */}

        {role === "admin" && (
          <div className="flex gap-3 justify-end">
            <Button className="w-48" href="/my/admin/addModule">
              Ajouter un Module
            </Button>
            <Button className="w-48" variant="outline" href="/my/admin/addProf">
              Ajouter un Prof
            </Button>
            <Button
              variant="green"
              className="w-48"
              href="/my/admin/verifyStudents"
            >
              Verifier Etudiants
            </Button>
          </div>
        )}
        <h3 className="sectionHeader">Vos Cours</h3>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 mb-5">
          {coursesLoading ? (
            Array(2)
              .fill()
              .map((_, index) => <SkeletonCard key={index} />)
          ) : courses.length === 0 ? (
            <p>Aucun cours pour le moment.</p>
          ) : (
            courses
              .slice(0, 4)
              .map((data, index) => <CarteCours key={index} data={data} />)
          )}
        </div>
        <Link className="link" href="/my/cours">
          Voir tous les cours
        </Link>
      </main>
      <aside className="lg:w-1/3 w-full">
        <div className="p-4 rounded-md border border-gray-200 shadow-md">
          <div className="flex justify-between">
            <h1 className="sectionHeader mb-4">Activité A Rendre</h1>
            <Link className="link" href="/my/travail-a-rendre">
              Voir Tous
            </Link>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="mr-3">
              {travailARLoading ? (
                <SkeletonList />
              ) : travailAR.length === 0 ? (
                <p>Aucune activité à rendre pour le moment.</p>
              ) : (
                travailAR.map((todo, index) => (
                  <CarteTravailAR key={index} data={todo} />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>
  );
}

export default Dashboard;
