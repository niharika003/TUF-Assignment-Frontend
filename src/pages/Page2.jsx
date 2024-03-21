import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import CustomLoader from "../components/CustomLoader";
import { useNavigate } from "react-router-dom";

const CodeSnippetTable = () => {
  const navigate = useNavigate();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const fetchSnippets = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/snippets?page=${page}&per_page=${perPage}`
    );
    const decodedSnippets = response.data.records.map((snippet) => ({
      ...snippet,
      source_code: decodeURIComponent(atob(snippet.source_code)),
    }));

    setSnippets(decodedSnippets);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchSnippets(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    setPerPage(newPerPage);
    await fetchSnippets(page);
  };

  useEffect(() => {
    fetchSnippets(1);
  }, [perPage]);

  const columns = [
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Language",
      selector: (row) => row.language,
      sortable: true,
    },
    {
      name: "Standard Input",
      selector: (row) => row.stdin,
    },
    {
      name: "Standard Output",
      selector: (row) => row.stdout,
    },
    {
      name: "Source Code",
      selector: (row) =>
        row.source_code.substring(0, 100) +
        (row.source_code.length > 100 ? "..." : ""),
    },
    {
      name: "Submitted At",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
  ];

  return (
    <>
      <button
        onClick={() => {
          navigate("/page1");
        }}
        className="my-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Add Snippet
      </button>
      <DataTable
        title="Code Snippets"
        columns={columns}
        data={snippets}
        progressPending={loading}
        progressComponent={<CustomLoader />}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />
    </>
  );
};

export default CodeSnippetTable;
