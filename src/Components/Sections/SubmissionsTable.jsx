"use client";
import Link from "next/link";
import { File, Loader2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/extension/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/extension/skeleton";
import { format } from "date-fns";
import RessourceLink from "../ui/ressourceLink";
import { formatDate } from "@/lib/utils";

export default function SubmissionsTable({ submissions, loading }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      {loading ? (
        <TableCaption>
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-w-full" />
            <Skeleton className="h-4 w-w-full" />
          </div>
        </TableCaption>
      ) : !submissions ? (
        <TableCaption className="mb-6">
          Pas de soumissions pour le moment !
        </TableCaption>
      ) : (
        <TableBody>
          {submissions.map((submission, index) => (
            <TableRow key={index}>
              <TableCell>
                {submission.student.lastname} {submission.student.firstname}
              </TableCell>
              <TableCell>
                {formatDate(submission.submissionDate).date}
              </TableCell>
              <TableCell>
                {formatDate(submission.submissionDate).time}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>voir les travail</DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>
                        Les fichiers soumis par {submission.student.firstname}{" "}
                        {submission.student.lastname}
                      </DialogTitle>
                      <DialogDescription>
                        {submission.ressources.map((ressource, index) => (
                          <RessourceLink ressource={ressource} index={index} />
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}
