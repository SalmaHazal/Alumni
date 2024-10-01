import { Button, Typography, Box } from "@mui/material";
import { FcPrivacy } from "react-icons/fc";
import { useTheme } from "@mui/material/styles";
import { GrPersonalComputer } from "react-icons/gr";
import { MdArrowForward } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const Helpcenter = () => {
  const theme = useTheme();
  const { palette } = theme;
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
        onClick={() => {
          navigate('/Helppage');
        }}
      sx={{
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        height: "70%",
        maxWidth: "97%", 
        backgroundColor: palette.background.alt,
        color: palette.text.primary,
        display: "flex",
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "space-between",
        textTransform: "none",
        padding: "1rem 2rem", 
        borderRadius: "8px",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: palette.primary.light,
        },
      }}
    >
    
      <GrPersonalComputer style={{ width: "40px", height: "40px", marginRight: "1rem" }} />


      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6" // Adjust font size and weight
          color={palette.text.secondary}
          sx={{ textAlign: "left", marginBottom: "0.25rem" }} // Align text to the left
        >
        { t ("help")}
        </Typography>
        <Typography
          variant="body2"
          color="#37B7C3"  // Subdued color for the secondary text
          sx={{ textAlign: "left" }}
        >
         { t ("helpsubtitle")}
        </Typography>
      </Box>


      <MdArrowForward style={{ width: "24px", height: "24px", color: palette.text.secondary }} />
    </Button>
  );
};

export default Helpcenter;
