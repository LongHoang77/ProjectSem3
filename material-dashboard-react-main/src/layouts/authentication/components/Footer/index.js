import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Footer({ light }) {
  return (
    <MDBox position="absolute" width="100%" bottom={0} py={4}>
      <Container>
        <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems="center"
          px={1.5}
        >
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            color={light ? "white" : "text"}
          >
            {/* <MDTypography
              variant="button"
              fontWeight="medium"
              color={light ? "white" : "dark"}
            >
              &copy; {new Date().getFullYear()}, Made with ❤️ for a better web
            </MDTypography> */}
          </MDBox>
        </MDBox>
      </Container>
    </MDBox>
  );
}

Footer.defaultProps = {
  light: false,
};

Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;