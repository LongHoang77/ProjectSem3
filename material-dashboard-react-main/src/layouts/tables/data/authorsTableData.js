
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import { Pagination } from "@mui/material";

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

  const pagination = (
    <MDBox display="flex" justifyContent="center" mt={3}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#1A73E8', // Blue color for pagination items
          },
          '& .Mui-selected': {
            backgroundColor: '#1A73E8 !important', // Blue background for selected page
            color: 'white !important', // White text for selected page
          },
        }}
      />
    </MDBox>
  );

  return { columns, rows, pagination };
};