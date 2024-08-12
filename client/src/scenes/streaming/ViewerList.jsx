import React from "react";
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

const ViewerList = ({ viewers }) => {
  return (
    <Box sx={{ marginTop: "1rem" }}>
      <Typography variant="h6" gutterBottom>
        Viewers ({viewers.length})
      </Typography>
      <List sx={{ maxHeight: "200px", overflowY: "auto" }}>
        {viewers.map((viewer) => (
          <ListItem key={viewer.userId}>
            <ListItemAvatar>
              <Avatar alt={viewer.name} src={viewer.picturePath} />
            </ListItemAvatar>
            <ListItemText primary={viewer.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ViewerList;
