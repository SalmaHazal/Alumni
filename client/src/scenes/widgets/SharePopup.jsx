import React, { useState } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";

const SharePopup = ({ open, handleClose, url }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  const handleSnackbarClose = () => {
    setCopied(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Share this post
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap="1rem">
          <TextField
            fullWidth
            variant="outlined"
            value={url}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={copyToClipboard} aria-label="copy">
                  <FileCopyOutlinedIcon />
                </IconButton>
              ),
            }}
          />
          <Box display="flex" justifyContent="center" gap="1rem">
            <FacebookShareButton url={url}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <WhatsappShareButton url={url}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <LinkedinShareButton url={url}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </Box>
        </Box>
      </DialogContent>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Copied!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Dialog>
  );
};

export default SharePopup;
