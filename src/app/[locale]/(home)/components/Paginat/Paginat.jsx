"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Paginat = ({ isNext, totalCruises, cruises }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const pageSize = 9;
  useEffect(() => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: page.toString(),
    });
    if (page > 1) {
      router.push(newUrl);
    } else if (page === 1 && searchParams.get("page") > 1) {
      router.push(
        formUrlQuery({
          params: searchParams.toString(),
          key: "page",
          value: "1",
        })
      );
    }
  }, [page, searchParams, router]);
  if (totalCruises < pageSize) return null;
  return (
    <div className="flex justify-center items-center p-4" dir="ltr">
      <Pagination
        count={Math.ceil(totalCruises / pageSize)}
        shape="rounded"
        page={page}
        onChange={handleChange}
        showFirstButton
        showLastButton
        color="primary"
      />
    </div>
  );
};

export default Paginat;
