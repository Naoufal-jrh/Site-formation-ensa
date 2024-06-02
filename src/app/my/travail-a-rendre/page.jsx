"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import CarteTravailAR from "@/Components/ui/CarteTravailAR";
import { useStore } from "@/store/zustand";
import { Button } from "@/Components/ui/extension/button";
import { SkeletonCarteTravailAR } from "@/Components/ui/SkeletonCarteTravailAR";
import { useEffect, useState } from "react";
import Loader from "@/app/loading";

function TravailArendre() {
  const role = useStore((state) => state.userRole);
  const travailAR = useStore((state) => state.travailAR);
  const fetchTravailAR = useStore((state) => state.fetchTravailAR);
  const [travailARLoading, setTravailARLoading] = useState(true);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchData() {
      setTravailARLoading(true);
      await fetchTravailAR();
      setTravailARLoading(false);
    }

    fetchData();
  }, []);

  if (!travailAR) return <Loader />;

  const totalPages = Math.ceil(travailAR.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedTravailAR = travailAR.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="lg:px-20 px-8 2xl:px-80 py-8 flex flex-col gap-5 ">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/my/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>A rendre</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-3 md:justify-between md:flex-row flex-col">
        <h1 className="text-3xl font-bold">Travail a rendre </h1>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="filter1">filter1</SelectItem>
            <SelectItem value="filter2">filter2</SelectItem>
            <SelectItem value="filter3">filter3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {role === "teacher" && (
        <Button href="/my/prof/AddTravail" className="w-52">
          Ajouter un travail a rendre
        </Button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-1">
        {travailARLoading ? (
          Array(4)
            .fill()
            .map((_, index) => <SkeletonCarteTravailAR key={index} />)
        ) : paginatedTravailAR.length === 0 ? (
          <p>Aucune activité à rendre pour le moment.</p>
        ) : (
          paginatedTravailAR.map((todo, index) => (
            <CarteTravailAR
              key={index}
              data={todo}
              role={role}
              variant="card"
            />
          ))
        )}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() =>
                handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                handlePageChange(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default TravailArendre;
