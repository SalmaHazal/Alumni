import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import DarkWidget from "../widgets/settingsWidgets/darkmode";
import LanguageWidget from "../widgets/settingsWidgets/language";
import Activitylogs from "../widgets/settingsWidgets/activity";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { Typography, useTheme } from "@mui/material";
import Privacy from "../widgets/settingsWidgets/privacy";
import { useTranslation } from 'react-i18next';
import Helpcenter from "../widgets/settingsWidgets/help";
import SearchUser from "../widgets/Allfriend";
import {useState } from "react";
import Feedbackk from "../widgets/settingsWidgets/feedback";


const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const { t } = useTranslation();



  return (
   

    <WidgetWrapper width="500px" marginTop="-20px">
  
    <Box>
       

 
      <Box className="fixed-navbar">
        <Navbar />
      </Box>
      <Typography color="#37B7C3" variant="h3" fontWeight="500" marginTop="115px" marginLeft="16%">
        { t ("title")}
      </Typography>
      <Box
        width="85%"
        padding="6rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.25rem"  
        justifyContent="space-between"
        marginTop="-40px"
        marginLeft="9.5%"
      >
      
        <Box
          flexBasis={isNonMobileScreens ? "30%" : undefined} 
          mt={isNonMobileScreens ? undefined : "1rem"}
        >
          <DarkWidget   />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "30%" : undefined}
          mt={isNonMobileScreens ? undefined : "1rem"}
        >
           
        <LanguageWidget  />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "30%" : undefined}
          mt={isNonMobileScreens ? undefined : "1rem"}
        >
           <Activitylogs   />
        </Box>
        
      </Box>
      <Typography color="#37B7C3" variant="h3" fontWeight="500" marginTop="-40px" marginLeft="16%">
      { t ("looking")}
      </Typography>
      <Box 
              width="85%"
        padding="6rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.25rem"  
        justifyContent="space-between"
        marginTop="-80px"
        marginLeft="9.5%"
         flexBasis={isNonMobileScreens ? "50%" : undefined}
        mt={isNonMobileScreens ? undefined : "1rem"}
      >
      <Privacy />

      </Box>
      <Box 
        width="85%"
        padding="6rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.25rem"  
        justifyContent="space-between"
        marginTop="-160px"
        marginLeft="9.5%"
        flexBasis={isNonMobileScreens ? "50%" : undefined}
        mt={isNonMobileScreens ? undefined : "1rem"}
      >
      <Helpcenter />

      </Box>
      <Box 
        width="85%"
        padding="6rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.25rem"  
        justifyContent="space-between"
        marginTop="-160px"
        marginLeft="9.5%"
        flexBasis={isNonMobileScreens ? "50%" : undefined}
        mt={isNonMobileScreens ? undefined : "1rem"}
      >
      <Feedbackk />

      </Box>
    </Box>
    </WidgetWrapper>
    
   
  );
};

export default HomePage;
