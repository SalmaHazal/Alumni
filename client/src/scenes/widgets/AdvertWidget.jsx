import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import Map from "../../components/Map";
import '../../index.css';

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper className="fixed-widget">
      <FlexBetween>
        <Typography color="#37B7C3" variant="h5" fontWeight="500">
          SUD Map   🗺 
        </Typography>
        <Typography color={medium}>laureate position</Typography>
      </FlexBetween>
      <Map />
      {/*<img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/info4.jpeg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />*/}
      <FlexBetween>
        <Typography color={main}>MikaCosmetics</Typography>
        <Typography color={medium}>mikacosmetics.com</Typography>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
