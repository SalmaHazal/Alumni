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
    </WidgetWrapper>
  );
};

export default AdvertWidget;
