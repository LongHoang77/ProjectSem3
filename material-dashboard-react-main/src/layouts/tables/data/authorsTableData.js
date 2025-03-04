import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDPagination from "components/MDPagination";
import Icon from "@mui/material/Icon";

export default function AuthorsTableData(movies, currentPage, totalPages, setCurrentPage, handleDelete, handleOpenUpdateDialog, handleOpenCreateShowtime) {
  const columns = [
    { Header: "TITLE", accessor: "title", width: "30%", align: "left" },
    { Header: "DIRECTOR", accessor: "director", width: "18%", align: "left" },
    { Header: "DURATION", accessor: "duration", width: "18%", align: "center" },
    { Header: "RELEASE DATE", accessor: "releaseDate", width: "18%", align: "center" },
    { Header: "GENRE", accessor: "genre", width: "18%", align: "center" },
    { Header: "ACTION", accessor: "action", width: "10%", align: "center" },
  ];

  const rows = movies.map((movie) => ({
    title: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {movie.title || "Untitled"}
      </MDTypography>
    ),
    director: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {movie.director || "Unknown"}
      </MDTypography>
    ),
    duration: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {movie.duration ? `${movie.duration} minutes` : "N/A"}
      </MDTypography>
    ),
    releaseDate: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "N/A"}
      </MDTypography>
    ),
    genre: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {movie.genre || "Unspecified"}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
        <MDBox mr={1}>
          <MDTypography
            variant="button"
            color="text"
            onClick={() => handleOpenUpdateDialog(movie)}
            sx={{ cursor: 'pointer' }}
          >
            <Icon>edit</Icon>
          </MDTypography>
        </MDBox>
        <MDBox mr={1}>
          <MDTypography
            variant="button"
            color="text"
            onClick={() => handleDelete(movie.id)}
            sx={{ cursor: 'pointer' }}
          >
            <Icon>delete</Icon>
          </MDTypography>
        </MDBox>
        <MDTypography
          variant="button"
          color="text"
          onClick={() => handleOpenCreateShowtime(movie.id)}
          sx={{ cursor: 'pointer' }}
        >
          <Icon>event</Icon>
        </MDTypography>
      </MDBox>
    ),
  }));

  const Pagination = () => {
    return (
      <MDPagination variant="gradient" color="info">
        <MDPagination item onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
          <Icon>keyboard_arrow_left</Icon>
        </MDPagination>
        {[...Array(totalPages).keys()].map((page) => (
          <MDPagination
            key={page + 1}
            item
            onClick={() => setCurrentPage(page + 1)}
            active={currentPage === page + 1}
          >
            {page + 1}
          </MDPagination>
        ))}
        <MDPagination item onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>
          <Icon>keyboard_arrow_right</Icon>
        </MDPagination>
      </MDPagination>
    );
  };

  return { columns, rows, pagination: <Pagination /> };
}