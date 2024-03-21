import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import CustomLoader from "../components/CustomLoader";

const CodeSnippetTable = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const fetchSnippets = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `https://tuf-assignment-backend-xxth.onrender.com/api/snippets?page=${page}&per_page=${perPage}`
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
  }, []);

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
      name: "Stdin",
      selector: (row) => row.stdin,
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
  );
};

export default CodeSnippetTable;
