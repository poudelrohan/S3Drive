import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { blue } from "@mui/material/colors";

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  newFolderName: string;
  setNewFolderName: React.Dispatch<React.SetStateAction<string>>;
  onCreateFolder: Function;
}

export const CreateFolderPopup = ({
  onClose,
  open,
  newFolderName,
  setNewFolderName,
  onCreateFolder,
}: SimpleDialogProps) => {
  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <DialogTitle>Create New Folder:</DialogTitle>
      <TextField
        label="Enter folder name"
        id="filled-hidden-label-small"
        defaultValue="Untitled"
        variant="filled"
        size="small"
        value={newFolderName}
        onChange={(event) => setNewFolderName(event.target.value)}
      />
      <Button
        variant="contained"
        color="warning"
        disabled={newFolderName == ""}
        onClick={() => {
          onCreateFolder();
          onClose();
        }}
      >
        Create Folder
      </Button>
    </Dialog>
  );
};
