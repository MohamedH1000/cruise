import EmptyState from "@/components/EmptyState";
import React from "react";
import DataPicker from "@/components/NavBar/DataPicker";
import { getAllCruises } from "@/lib/actions/cruise.action";
import ListingCard from "@/components/ListingCard/ListingCard";
import Paginat from "../components/Paginat/Paginat";
import { getCurrentUser } from "@/lib/actions/user.action";

const page = async ({ searchParams }: any) => {
  const currentUser = await getCurrentUser();
  const allCruises = await getAllCruises({
    page: searchParams?.page ? +searchParams.page : 1,
  });

  const allowedCruises = allCruises?.cruises?.filter(
    (cruise: any) => cruise.status === "active"
  );
  return (
    <div
      className="lg:px-[180px] w-full
    md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <div className="mt-20 flex justify-between items-center max-lg:flex-col gap-5">
        <DataPicker searchPage />
        <iframe
          width="550"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          className="rounded-md mt-5 w-full"
          src={`https://www.google.com/maps?q=25.214710,55.344361&hl=es;z=6&output=embed`}
        />
      </div>
      {allowedCruises?.length === 0 ? (
        <div className="min-h-screen mt-[130px] flex justify-center text-[40px]">
          <EmptyState />
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-3 max-sm:flex-col">
            {/* first col */}
            <div className="w-full"></div>
            {/* second col (filters)*/}
            <div className="w-full">
              <div
                className="mt-10 grid gap-8 w-full lg:grid-cols-2
max-md:grid-cols-1 max-sm:grid-cols-1 md:grid-cols-1 mb-10"
              >
                {allowedCruises?.map((cruise: any) => {
                  return (
                    <ListingCard
                      data={cruise}
                      key={cruise?.id}
                      currentUser={currentUser}
                    />
                  );
                })}
              </div>
              <Paginat
                cruises={allowedCruises}
                isNext={allCruises?.isNext}
                totalCruises={allCruises?.totalAllowedCruises}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default page;
