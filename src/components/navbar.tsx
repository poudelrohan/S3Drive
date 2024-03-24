import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { ChangeEvent } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { s3Client } from "../api/s3Client";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { CreateFolderPopup } from "./createfolderpopup";

export type NavProps = {
  currentPrefix: string;
  listItemsInBucket: Function;
  setCurrentPrefix: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const Navbar: React.FunctionComponent<NavProps> = ({
  currentPrefix,
  listItemsInBucket,
  setCurrentPrefix,
  setIsLoading,
}: NavProps) => {
  const [newFolderName, setNewFolderName] = React.useState("Untitled");
  const [isCreateFolderPopupOpen, setIsCreateFolderPopupOpen] =
    React.useState(false);

  const onFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    await s3Client.uploadFileToBucket(
      process.env.REACT_APP_BUCKET_NAME!,
      currentPrefix + event.target.files![0].name,
      event.target.files![0]
    );

    await listItemsInBucket();
    setIsLoading(false);
  };

  const onBackButtonClick = () => {
    const prefixes = currentPrefix.split("/");
    prefixes.pop();
    prefixes.pop();
    const newPrefix = prefixes.join("/");
    setCurrentPrefix(newPrefix);
  };
  const onCreateFolder = async () => {
    setIsLoading(true);
    await s3Client.uploadFileToBucket(
      process.env.REACT_APP_BUCKET_NAME!,
      currentPrefix + newFolderName + "/"
    );

    await listItemsInBucket();
    setIsLoading(false);
  };

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            S3 Drive
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
              fullWidth={true}
            />
          </Search>
          <Box sx={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              {/* Creating Back Button */}
              <Button
                onClick={onBackButtonClick}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<KeyboardBackspaceIcon />}
                color="success"
                disabled={currentPrefix ? false : true}
              ></Button>
              {/* Upload Button */}
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                color="success"
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={onFileUpload} />
              </Button>

              {/* Creating New Folder Button */}
              <Button
                onClick={() => setIsCreateFolderPopupOpen(true)}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CreateNewFolderIcon />}
                color="success"
              >
                Create New Folder
              </Button>
            </div>
            <CreateFolderPopup
              open={isCreateFolderPopupOpen}
              onClose={() => {
                setIsCreateFolderPopupOpen(false);
                setNewFolderName("Untitled");
              }}
              newFolderName={newFolderName}
              setNewFolderName={setNewFolderName}
              onCreateFolder={onCreateFolder}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
