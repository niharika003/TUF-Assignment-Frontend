import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import PageNotFound from "../components/PageNotFound";

const CodeSnippetForm = lazy(() => import("../pages/Page1"));

const CodeSnippetTable = lazy(() => import("../pages/Page2"));

const AllRoutes = () => {
  return (
    <>
      <Suspense fallback={<SkeletonLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/page1" />} />
          <Route path="/page1" element={<CodeSnippetForm />} />
          <Route path="/page2" element={<CodeSnippetTable />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AllRoutes;
