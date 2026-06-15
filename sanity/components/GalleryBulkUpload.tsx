import { UploadIcon } from "@sanity/icons";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Select,
  Stack,
  Text,
  TextArea,
  useToast,
} from "@sanity/ui";
import { useEffect, useRef, useState } from "react";
import { useClient } from "sanity";
import { GALLERY_CATEGORIES } from "../studioOptions";

const API_VERSION = "2025-02-19";
const MAX_PHOTOS = 30;

type SelectedPhoto = {
  file: File;
  previewUrl: string;
};

export function GalleryBulkUpload() {
  const client = useClient({ apiVersion: API_VERSION });
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState(0);

  useEffect(
    () => () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    },
    [photos],
  );

  function selectPhotos(files: FileList | null) {
    photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));

    const selected = Array.from(files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS)
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));

    setPhotos(selected);
    setCompleted(0);

    if ((files?.length ?? 0) > MAX_PHOTOS) {
      toast.push({
        status: "warning",
        title: `Only the first ${MAX_PHOTOS} photos were selected`,
      });
    }
  }

  async function uploadAndPublish() {
    if (!photos.length || !category || !description.trim()) return;

    setUploading(true);
    setCompleted(0);
    let publishedCount = 0;

    try {
      for (const photo of photos) {
        const title = titleFromFilename(photo.file.name);
        const asset = await client.assets.upload("image", photo.file, {
          filename: photo.file.name,
        });

        const document: { _type: string; [key: string]: unknown } = {
          _type: "galleryItem",
          title,
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            alt: title,
          },
          categories: [category],
          date: new Date().toISOString(),
          featured: false,
        };

        const trimmedDescription = description.trim();
        if (trimmedDescription) document.description = trimmedDescription;

        await client.create(document);
        publishedCount += 1;
        setCompleted(publishedCount);
      }

      toast.push({
        status: "success",
        title: `${publishedCount} temple photo${publishedCount === 1 ? "" : "s"} published`,
        description: "The photos will appear on the website automatically.",
      });

      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      setPhotos([]);
      setCategory("");
      setDescription("");
      setCompleted(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.push({
        status: "error",
        title: "Photo upload stopped",
        description:
          publishedCount > 0
            ? `${publishedCount} photo${publishedCount === 1 ? " was" : "s were"} published before the error.`
            : error instanceof Error
              ? error.message
              : "Please try again.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Box padding={4} style={{ maxWidth: 960, margin: "0 auto" }}>
      <Stack space={5}>
        <Stack space={3}>
          <Heading size={2}>Upload Multiple Temple Photos</Heading>
          <Text muted>
            Select several photos, choose one category, then publish them together. Each photo will
            become a normal Gallery entry and can be edited later.
          </Text>
        </Stack>

        <Card padding={4} radius={3} border>
          <Stack space={4}>
            <Stack space={2}>
              <Text weight="semibold">1. Select Photos</Text>
              <Text size={1} muted>
                Choose up to {MAX_PHOTOS} JPG, PNG, or WebP images.
              </Text>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={(event) => selectPhotos(event.currentTarget.files)}
              />
            </Stack>

            <Stack space={2}>
              <Text weight="semibold">2. Choose Category</Text>
              <Select
                value={category}
                disabled={uploading}
                onChange={(event) => setCategory(event.currentTarget.value)}
              >
                <option value="">Choose a photo category</option>
                {GALLERY_CATEGORIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.title}
                  </option>
                ))}
              </Select>
            </Stack>

            <Stack space={2}>
              <Text weight="semibold">Description</Text>
              <TextArea
                rows={3}
                value={description}
                disabled={uploading}
                placeholder="Add one required description to all selected photos."
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
            </Stack>

            {photos.length > 0 && (
              <Stack space={3}>
                <Text weight="semibold">
                  {photos.length} photo{photos.length === 1 ? "" : "s"} selected
                </Text>
                <Grid columns={[2, 3, 4]} gap={3}>
                  {photos.map((photo) => (
                    <Card key={`${photo.file.name}-${photo.file.lastModified}`} radius={2} border>
                      <img
                        src={photo.previewUrl}
                        alt=""
                        style={{
                          display: "block",
                          width: "100%",
                          aspectRatio: "4 / 3",
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <Box padding={2}>
                        <Text size={1} textOverflow="ellipsis">
                          {photo.file.name}
                        </Text>
                      </Box>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            )}

            <Flex align="center" gap={3}>
              <Button
                icon={UploadIcon}
                text={
                  uploading
                    ? `Publishing ${completed} of ${photos.length}...`
                    : "Upload & Publish Photos"
                }
                tone="primary"
                disabled={uploading || !photos.length || !category || !description.trim()}
                onClick={uploadAndPublish}
              />
              {photos.length > 0 && !category && (
                <Text size={1} muted>
                  Choose a category before publishing.
                </Text>
              )}
              {photos.length > 0 && category && !description.trim() && (
                <Text size={1} muted>
                  Add a description before publishing.
                </Text>
              )}
            </Flex>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

function titleFromFilename(filename: string) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");
  const readable = withoutExtension.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return readable || `Temple Photo ${new Date().toLocaleDateString("en-IN")}`;
}
