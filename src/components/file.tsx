import { FunctionComponent, useState } from "react";
import { FileOrFolder } from "./HomeScreen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Box, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { s3Client } from "../api/s3Client";

export type FileProps = {
  item: FileOrFolder;
  listItemsInBucket: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const File: FunctionComponent<FileProps> = ({
  item,
  listItemsInBucket,
  setIsLoading,
}: FileProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const onDeleteFile = async () => {
    setIsLoading(true);
    await s3Client.deleteFileOrFolderFromBucket(
      process.env.REACT_APP_BUCKET_NAME!,
      item.name
    );
    await listItemsInBucket();
    setIsLoading(false);
  };

  const onDownloadFile = async () => {
    setIsLoading(true);
    const response = await s3Client.downloadFileFromBucket(
      process.env.REACT_APP_BUCKET_NAME!,
      item.name
    );
    const fileContent = await streamToBlob(
      response as ReadableStream<Uint8Array>
    );
    const url = URL.createObjectURL(fileContent);

    const link = document.createElement("a");
    link.href = url;
    link.download = item.name
      .split("/")
      .filter((x) => x)
      .pop()!;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsLoading(false);
  };
  // Helper function to convert stream to Blob
  const streamToBlob = async (stream: ReadableStream<Uint8Array>) => {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    return new Blob(chunks, { type: "application/octet-stream" });
  };

  return (
    <button
      style={{
        padding: "20px",
        height: "150px", // Fixed height
        width: "150px", // Fixed width
        position: "relative",
        display: "inline-flex", // Ensures button takes the size of its content
        border: "1px dotted black",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-block", // Ensures the button takes up space
          "&:hover": {
            cursor: "pointer",
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <InsertDriveFileIcon sx={{ fontSize: 80, color: "#808080" }} />
        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "125px", // Limiting width
          }}
        >
          {item.name
            .split("/")
            .filter((x) => x)
            .pop()}
        </Typography>
        {isHovered && (
          <div
            style={{
              position: "relative",
              bottom: 7,
              right: 0,
              paddingBottom: "50px",
              display: "flex",
            }}
          >
            <Button
              onClick={onDeleteFile}
              startIcon={<DeleteIcon sx={{ fontSize: 23, color: "#808080" }} />}
            />
            <Button
              onClick={onDownloadFile}
              startIcon={
                <DownloadIcon sx={{ fontSize: 23, color: "#808080" }} />
              }
            />
          </div>
        )}
      </Box>
    </button>
  );
};
