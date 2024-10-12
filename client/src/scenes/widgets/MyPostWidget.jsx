import * as React from "react";
import { Divider, useTheme, Button } from "@mui/material";
import { useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { MdPermMedia } from "react-icons/md";
import { RiLiveFill } from "react-icons/ri";
import { PiArticleNyTimesBold } from "react-icons/pi";
import { MdWork } from "react-icons/md";
import { IoMdFootball } from "react-icons/io";
import { FaHandshakeAngle } from "react-icons/fa6";
import Dropzone from "react-dropzone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MyPostWidget = ({ picturePath }) => {
  const { palette } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openArticle, setOpenArticle] = useState(false);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const handleOpenArticle = () => setOpenArticle(true);
  const handleCloseArticle = () => setOpenArticle(false);
  const handleArticleSubmit = () => {
    handleCloseArticle();
  };

  const handlePostChange = (event) => setPostText(event.target.value);
  const handleCategorySelect = (category) => setSelectedCategory(category);

  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaPostText, setMediaPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleMediaDialogOpen = () => setOpenMediaDialog(true);
  const handleMediaDialogClose = () => setOpenMediaDialog(false);

  const handleFileDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handlePostChanges = (e) => setMediaPostText(e.target.value);

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <Button
          onClick={handleOpen}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
            color: palette.primary.natural,
            textAlign: "left",
          }}
        >
          {t("What's on your mind...")}
        </Button>
      </FlexBetween>

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <Button
          onClick={handleMediaDialogOpen}
          sx={{
            borderRadius: "0.5rem",
            padding: "1rem 2rem",
            color: palette.primary.natural,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <MdPermMedia
            style={{
              marginRight: "8px",
              marginLeft: "8px",
              color: "#3ABEF9",
              fontSize: "20px",
            }}
          />
          {t("Media")}
        </Button>

        <Button
          sx={{
            borderRadius: "0.5rem",
            padding: "1rem 2rem",
            color: palette.primary.natural,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <RiLiveFill
            style={{
              marginRight: "8px",
              marginLeft: "8px",
              color: "#EF5A6F",
              fontSize: "20px",
            }}
          />
          {t("Live")}
        </Button>

        <Button
          onClick={handleOpenArticle}
          sx={{
            borderRadius: "0.5rem",
            padding: "1rem 2rem",
            color: palette.primary.natural,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <PiArticleNyTimesBold
            style={{
              marginRight: "8px",
              marginLeft: "8px",
              color: "#65B741",
              fontSize: "20px",
            }}
          />
          {t("Article")}
        </Button>
      </FlexBetween>

      {/* Dialog for posting a text */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{t("Create a post")}</DialogTitle>
        <DialogContent>
          {/* Text input for the post */}
          <TextField
            label={t("What's on your mind?")}
            multiline
            rows={4}
            fullWidth
            value={postText}
            onChange={handlePostChange}
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />

          {/* Category selection buttons */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Professional Category Button */}
            <Button
              onClick={() => handleCategorySelect("💼 Professional")}
              sx={{
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
                color:
                  selectedCategory === "💼 Professional"
                    ? "#fff"
                    : palette.primary.natural,
                backgroundColor:
                  selectedCategory === "💼 Professional"
                    ? "#3ABEF9"
                    : "transparent",
                boxShadow:
                  selectedCategory === "💼 Professional"
                    ? "0px 6px 12px rgba(58, 190, 249, 0.4)"
                    : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "💼 Professional"
                      ? "#3ABEF9"
                      : "transparent",
                  color:
                    selectedCategory === "💼 Professional"
                      ? "#fff"
                      : palette.primary.natural,
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <MdWork
                style={{
                  marginRight: "8px",
                  marginLeft: "8px",
                  color:
                    selectedCategory === "💼 Professional" ? "#fff" : "#3ABEF9",
                  fontSize: "20px",
                }}
              />
              {t("Professional")}
            </Button>

            {/* Sport Category Button */}
            <Button
              onClick={() => handleCategorySelect("⚽ Sport")}
              sx={{
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
                color:
                  selectedCategory === "⚽ Sport"
                    ? "#fff"
                    : palette.primary.natural,
                backgroundColor:
                  selectedCategory === "⚽ Sport" ? "#3ABEF9" : "transparent",
                boxShadow:
                  selectedCategory === "⚽ Sport"
                    ? "0px 6px 12px rgba(58, 190, 249, 0.4)"
                    : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "⚽ Sport" ? "#3ABEF9" : "transparent",
                  color:
                    selectedCategory === "⚽ Sport"
                      ? "#fff"
                      : palette.primary.natural,
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <IoMdFootball
                style={{
                  marginRight: "8px",
                  marginLeft: "8px",
                  color: selectedCategory === "⚽ Sport" ? "#fff" : "#65B741",
                  fontSize: "20px",
                }}
              />
              {t("Sport")}
            </Button>

            {/* Social Category Button */}
            <Button
              onClick={() => handleCategorySelect("🤝 Social")}
              sx={{
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
                color:
                  selectedCategory === "🤝 Social"
                    ? "#fff"
                    : palette.primary.natural,
                backgroundColor:
                  selectedCategory === "🤝 Social" ? "#3ABEF9" : "transparent",
                boxShadow:
                  selectedCategory === "🤝 Social"
                    ? "0px 6px 12px rgba(58, 190, 249, 0.4)"
                    : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "🤝 Social"
                      ? "#3ABEF9"
                      : "transparent",
                  color:
                    selectedCategory === "🤝 Social"
                      ? "#fff"
                      : palette.primary.natural,
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <FaHandshakeAngle
                style={{
                  marginRight: "8px",
                  marginLeft: "8px",
                  color: selectedCategory === "🤝 Social" ? "#fff" : "#EF5A6F",
                  fontSize: "20px",
                }}
              />
              {t("Social")}
            </Button>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t("Cancel")}
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            {t("Post")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Dialog */}
      <Dialog
        open={openMediaDialog}
        onClose={handleMediaDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t("Create a media post")}</DialogTitle>
        <DialogContent>
          {/* File Drop Area */}
          <Dropzone onDrop={handleFileDrop} accept="image/*">
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #cccccc",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                <input {...getInputProps()} />
                {selectedFile ? (
                  <p>{selectedFile.name}</p>
                ) : (
                  <p>{t("Drag 'n' drop an image, or click to select one")}</p>
                )}
              </div>
            )}
          </Dropzone>

          {/* Post Text Input */}
          <TextField
            label={t("Add a caption...")}
            multiline
            rows={4}
            fullWidth
            value={mediaPostText}
            onChange={handlePostChanges}
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />

          {/* Category selection buttons */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Professional Category Button */}
            <Button
              onClick={() => handleCategorySelect("💼 Professional")}
              sx={{
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
                color:
                  selectedCategory === "💼 Professional"
                    ? "#fff"
                    : palette.primary.natural,
                backgroundColor:
                  selectedCategory === "💼 Professional"
                    ? "#3ABEF9"
                    : "transparent",
                boxShadow:
                  selectedCategory === "💼 Professional"
                    ? "0px 6px 12px rgba(58, 190, 249, 0.4)"
                    : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "💼 Professional"
                      ? "#3ABEF9"
                      : "transparent",
                  color:
                    selectedCategory === "💼 Professional"
                      ? "#fff"
                      : palette.primary.natural,
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <MdWork
                style={{
                  marginRight: "8px",
                  marginLeft: "8px",
                  color:
                    selectedCategory === "💼 Professional" ? "#fff" : "#3ABEF9",
                  fontSize: "20px",
                }}
              />
              {t("Professional")}
            </Button>

            {/* Sport Category Button */}
            <Button
              onClick={() => handleCategorySelect("⚽ Sport")}
              sx={{
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
                color:
                  selectedCategory === "⚽ Sport"
                    ? "#fff"
                    : palette.primary.natural,
                backgroundColor:
                  selectedCategory === "⚽ Sport" ? "#3ABEF9" : "transparent",
                boxShadow:
                  selectedCategory === "⚽ Sport"
                    ? "0px 6px 12px rgba(58, 190, 249, 0.4)"
                    : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "⚽ Sport" ? "#3ABEF9" : "transparent",
                  color:
                    selectedCategory === "⚽ Sport"
                      ? "#fff"
                      : palette.primary.natural,
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <IoMdFootball
                style={{
                  marginRight: "8px",
                  marginLeft: "8px",
                  color: selectedCategory === "⚽ Sport" ? "#fff" : "#65B741",
                  fontSize: "20px",
                }}
              />
              {t("Sport")}
            </Button>

            {/* Social Category Button */}
            <Button
              onClick={() => handleCategorySelect("🤝 Social")}
              sx={{
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
                color:
                  selectedCategory === "🤝 Social"
                    ? "#fff"
                    : palette.primary.natural,
                backgroundColor:
                  selectedCategory === "🤝 Social" ? "#3ABEF9" : "transparent",
                boxShadow:
                  selectedCategory === "🤝 Social"
                    ? "0px 6px 12px rgba(58, 190, 249, 0.4)"
                    : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "🤝 Social"
                      ? "#3ABEF9"
                      : "transparent",
                  color:
                    selectedCategory === "🤝 Social"
                      ? "#fff"
                      : palette.primary.natural,
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <FaHandshakeAngle
                style={{
                  marginRight: "8px",
                  marginLeft: "8px",
                  color: selectedCategory === "🤝 Social" ? "#fff" : "#EF5A6F",
                  fontSize: "20px",
                }}
              />
              {t("Social")}
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMediaDialogClose} color="primary">
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleMediaDialogClose}
            color="primary"
            variant="contained"
          >
            {t("Post")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Article posting */}
      <Dialog open={openArticle} onClose={handleCloseArticle} fullWidth maxWidth="md">
        <DialogTitle>{t("Create an Article")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("Article Title")}
            fullWidth
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />
          <ReactQuill
            value={articleContent}
            onChange={setArticleContent}
            placeholder={t("Write your article content here...")}
            style={{ height: "300px", marginBottom: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseArticle} color="primary">
            {t("Cancel")}
          </Button>
          <Button onClick={handleArticleSubmit} color="primary" variant="contained">
            {t("Post")}
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
