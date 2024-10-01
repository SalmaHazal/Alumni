import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import Logoalumni from "/public/assets/logoalumni.png";
import alumnidark2 from "/public/assets/alumnidark2.jpg"

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
        className="flex justify-center"
      >
        <Typography >
          <img src={(theme.palette.mode === "dark"? alumnidark2: Logoalumni)} 
          style={{borderRadius: "7px", height:"70px", marginLeft:"-32px"}}
           alt="Alumni Logo"
          />
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontSize="25px" fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to <Typography fontSize="25px" fontWeight="500" component="span" sx={{ color: 'primary.main', mb: "1.5rem" }}>Alumni SUD</Typography> 
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
