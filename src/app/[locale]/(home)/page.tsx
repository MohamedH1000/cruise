import DataPickNavbar from "@/components/NavBar/DataPickNavbar";
import { getCurrentUser } from "@/lib/actions/user.action";
import Paginat from "./components/Paginat/Paginat";
import { getAllCruises } from "@/lib/actions/cruise.action";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/ListingCard/ListingCard";
import AddCruiseDialog from "../(dashboard)/admin/cruises/components/CruisesTable/addCruiseDialog";

export default async function Home({ searchParams }: any) {
  const currentUser = await getCurrentUser();
  const allCruises = await getAllCruises({
    page: searchParams?.page ? +searchParams.page : 1,
  });

  const allowedCruises = allCruises?.cruises?.filter(
    (cruise: any) => cruise.status === "active"
  );

  const myCruises = allowedCruises?.filter(
    (cruise) => cruise.userId === currentUser?.id
  );
  // console.log(allCruises);

  if (allowedCruises?.length === 0)
    return (
      <div>
        <DataPickNavbar />
        <div className="flex justify-center items-center mt-5">
          {currentUser?.role === "cruiseOwner" && (
            <AddCruiseDialog cruiseOwner />
          )}
        </div>
        <div className="min-h-screen mt-[130px] flex justify-center text-[40px]">
          <EmptyState />
        </div>
      </div>
    );

  if (currentUser?.role === "cruiseOwner") {
    return (
      <div>
        <DataPickNavbar />
        <div className="flex justify-center items-center mt-5">
          {currentUser?.role === "cruiseOwner" && (
            <AddCruiseDialog cruiseOwner />
          )}
        </div>
        <div
          className="mt-10 grid gap-8 w-full lg:grid-cols-3 
max-md:grid-cols-2 max-sm:grid-cols-1 md:grid-cols-2 mb-10 lg:px-[180px]
md:px-[50px] max-sm:px-[10px] max-md:px-[50px]  max-md:mt-[100px]"
        >
          {myCruises?.map((cruise: any) => {
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
        <div className="flex justify-start items-center mt-6 flex-wrap"></div>
      </div>
    );
  }

  return (
    <main>
      <DataPickNavbar />
      <div className="flex justify-center items-center mt-5">
        {currentUser?.role === "cruiseOwner" && <AddCruiseDialog cruiseOwner />}
      </div>
      <div
        className="mt-10 grid gap-8 w-full lg:grid-cols-3 
max-md:grid-cols-2 max-sm:grid-cols-1 md:grid-cols-2 mb-10 lg:px-[180px]
md:px-[50px] max-sm:px-[10px] max-md:px-[50px]  max-md:mt-[100px]"
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
      <div className="flex justify-start items-center mt-6 flex-wrap"></div>
    </main>
  );
}
