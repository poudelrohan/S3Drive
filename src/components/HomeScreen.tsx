import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { s3Client } from "../api/s3Client";
import { Folder } from "./folder";
import { File } from "./file";
import { Navbar } from "./navbar";
import { LoadingScreen } from "./loading";

export enum ContentType {
  File = "File",
  Folder = "Folder",
}
export type FileOrFolder = {
  name: string;
  type: ContentType;
};

export const pathDepth = (path: string) => {
  // Count the number of slashes in the path
  let count = (path.match(/\//g) || []).length;
  if (path.endsWith("/")) {
    count = count - 1;
  }
  return count;
};

export const HomeScreen = () => {
  const [currentPrefix, setcurrentPrefix] = useState("");
  const [items, setItems] = useState<FileOrFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDepth = pathDepth(currentPrefix + "/");

  const listItemsInBucket = async () => {
    setIsLoading(true);
    const newItems = await s3Client.listObjectsInBucket(
      process.env.REACT_APP_BUCKET_NAME!,
      currentPrefix
    );

    setItems(newItems);
    setIsLoading(false);
  };

  useEffect(() => {
    listItemsInBucket();
  }, [currentPrefix]);

  const itemsInSameDepth = items.filter(
    (item: FileOrFolder) => currentDepth === pathDepth(item.name)
  );

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
      <Navbar
        currentPrefix={currentPrefix}
        listItemsInBucket={listItemsInBucket}
        setCurrentPrefix={setcurrentPrefix}
        setIsLoading={setIsLoading}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {itemsInSameDepth.length === 0 ? (
          <h1>
            You don't have any files or folders. Please upload to see here!
          </h1>
        ) : (
          itemsInSameDepth.map((item) =>
            item.type === ContentType.Folder ? (
              <Folder
                item={item}
                items={items}
                setCurrentPrefix={setcurrentPrefix}
                key={item.name}
                listItemsInBucket={listItemsInBucket}
                setIsLoading={setIsLoading}
              />
            ) : (
              <File
                item={item}
                key={item.name}
                listItemsInBucket={listItemsInBucket}
                setIsLoading={setIsLoading}
              />
            )
          )
        )}
      </Box>
    </>
  );
};
