import { Box, Button, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { FileOrFolder } from "./HomeScreen";
import { FunctionComponent, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { s3Client } from "../api/s3Client";

export type FolderProps = {
  item: FileOrFolder;
  items: FileOrFolder[];
  setCurrentPrefix: React.Dispatch<React.SetStateAction<string>>;
  listItemsInBucket: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

/** WAYS OF IMPORTING PROPS
 *  1. export const Folder: FunctionComponent<FolderProps> = ({item}) => {...}
 *  2. export const Folder = (props: FolderProps) => {...}
 *  3. export const Folder = ({item}: FolderProps) => {...}
 */

export const Folder: FunctionComponent<FolderProps> = ({
  item,
  items,
  setCurrentPrefix,
  setIsLoading,
  listItemsInBucket,
}: FolderProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const onDeleteFolder = async () => {
    setIsLoading(true);
    await s3Client.deleteFileOrFolderFromBucket(
      process.env.REACT_APP_BUCKET_NAME!,
      item.name
    );
    await listItemsInBucket();
    setIsLoading(false);
  };
  return (
    <button
      style={{
        padding: "10px", // Remove default padding to fit the content better
        height: "150px", // Fixed height
        width: "150px", // Fixed width
        position: "relative",
        display: "inline-flex", // Ensures button takes the size of its content
        border: "1px dotted black",
      }}
      onDoubleClick={() => {
        setCurrentPrefix(item.name);
        items = [];
      }}
    >
      <Box
        sx={{
          flex: "20%",

          maxWidth: "150px",
          position: "relative",
          display: "inline-block", // Ensures the button takes up space
          "&:hover": {
            cursor: "pointer",
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FolderIcon sx={{ fontSize: 80, color: "#808080" }} />
        <Typography>
          {item.name
            .split("/")
            .filter((x) => x)
            .pop()}
        </Typography>
        {isHovered && (
          <div>
            <Button
              onClick={onDeleteFolder}
              startIcon={<DeleteIcon sx={{ fontSize: 23, color: "#808080" }} />}
            />
          </div>
        )}
      </Box>
    </button>
  );
};
