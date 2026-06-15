import { AddIcon, TrashIcon } from "@sanity/icons";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  Flex,
  Heading,
  Label,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@sanity/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";

const API_VERSION = "2025-02-19";

type BulkDocumentListProps = {
  documentType: string;
  title: string;
  emptyMessage: string;
};

type ListDocument = {
  _id: string;
  title: string;
  subtitle: string;
};

export function GalleryBulkDocumentList() {
  return (
    <BulkDocumentList
      documentType="galleryItem"
      title="Manage Temple Photos"
      emptyMessage="No temple photos have been added yet."
    />
  );
}

export function TempleVideoBulkDocumentList() {
  return (
    <BulkDocumentList
      documentType="templeVideo"
      title="Temple Videos"
      emptyMessage="No temple videos have been added yet."
    />
  );
}

export function CommunityPostBulkDocumentList() {
  return (
    <BulkDocumentList
      documentType="communityPost"
      title="Community Posts"
      emptyMessage="No community posts have been added yet."
    />
  );
}

export function TempleNoticeBulkDocumentList() {
  return (
    <BulkDocumentList
      documentType="templeNotice"
      title="Temple Notices"
      emptyMessage="No temple notices have been added yet."
    />
  );
}

function BulkDocumentList({ documentType, title, emptyMessage }: BulkDocumentListProps) {
  const client = useClient({ apiVersion: API_VERSION });
  const toast = useToast();
  const [documents, setDocuments] = useState<ListDocument[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      const rows = await client.fetch<
        Array<{ _id: string; _updatedAt: string; title?: string; imageTitle?: string }>
      >(
        `*[_type == $documentType && !(_id in path("versions.**"))] | order(_updatedAt desc) {
          _id,
          _updatedAt,
          "title": coalesce(title, "Untitled"),
          "imageTitle": coalesce(image.alt, image.asset->originalFilename)
        }`,
        { documentType },
      );

      const byPublishedId = new Map<string, ListDocument>();
      rows.forEach((row) => {
        const publishedId = row._id.replace(/^drafts\./, "");
        if (byPublishedId.has(publishedId) && row._id === publishedId) return;
        byPublishedId.set(publishedId, {
          _id: publishedId,
          title: row.title === "Untitled" ? row.imageTitle || row.title : row.title || "Untitled",
          subtitle: new Date(row._updatedAt).toLocaleString("en-IN"),
        });
      });

      setDocuments([...byPublishedId.values()]);
      setSelectedIds((current) => {
        const available = new Set(byPublishedId.keys());
        return new Set([...current].filter((id) => available.has(id)));
      });
    } catch (error) {
      toast.push({
        status: "error",
        title: `Unable to load ${title.toLowerCase()}`,
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [client, documentType, title, toast]);

  useEffect(() => {
    void loadDocuments();
    const subscription = client
      .listen(`*[_type == $documentType]`, { documentType }, { includeResult: false })
      .subscribe(() => void loadDocuments());
    return () => subscription.unsubscribe();
  }, [client, documentType, loadDocuments]);

  const allSelected = documents.length > 0 && selectedIds.size === documents.length;
  const someSelected = selectedIds.size > 0 && !allSelected;
  const selectedDocuments = useMemo(
    () => documents.filter((document) => selectedIds.has(document._id)),
    [documents, selectedIds],
  );

  function toggleAll() {
    setSelectedIds(allSelected ? new Set() : new Set(documents.map((document) => document._id)));
  }

  function toggleDocument(documentId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(documentId)) next.delete(documentId);
      else next.add(documentId);
      return next;
    });
  }

  async function deleteSelected() {
    if (deleting || selectedDocuments.length === 0) return;
    setDeleting(true);

    const results = await Promise.allSettled(
      selectedDocuments.map((document) =>
        client
          .transaction()
          .delete(document._id)
          .delete(`drafts.${document._id}`)
          .commit({ autoGenerateArrayKeys: true }),
      ),
    );
    const deletedIds = selectedDocuments
      .filter((_, index) => results[index]?.status === "fulfilled")
      .map((document) => document._id);
    const failedCount = results.length - deletedIds.length;

    setSelectedIds((current) => {
      const next = new Set(current);
      deletedIds.forEach((id) => next.delete(id));
      return next;
    });
    setConfirming(false);
    setDeleting(false);
    await loadDocuments();

    if (deletedIds.length > 0) {
      toast.push({
        status: "success",
        title: `${deletedIds.length} document${deletedIds.length === 1 ? "" : "s"} deleted`,
      });
    }
    if (failedCount > 0) {
      toast.push({
        status: "error",
        title: `${failedCount} document${failedCount === 1 ? "" : "s"} could not be deleted`,
        description: "Failed documents remain selected so they can be reviewed or retried.",
      });
    }
  }

  return (
    <Box padding={4} style={{ maxWidth: 960, margin: "0 auto" }}>
      <Stack space={4}>
        <Flex align="center" justify="space-between" gap={3} wrap="wrap">
          <Heading size={2}>{title}</Heading>
          <IntentLink intent="create" params={{ type: documentType }}>
            <Button icon={AddIcon} text="New" tone="primary" />
          </IntentLink>
        </Flex>

        <Card padding={3} radius={2} border>
          <Flex align="center" gap={3}>
            <Checkbox
              id={`${documentType}-select-all`}
              checked={allSelected}
              indeterminate={someSelected}
              disabled={loading || documents.length === 0 || deleting}
              onChange={toggleAll}
            />
            <Label htmlFor={`${documentType}-select-all`}>
              Select All{documents.length > 0 ? ` (${documents.length})` : ""}
            </Label>
          </Flex>
        </Card>

        {selectedIds.size > 0 && (
          <Card padding={3} radius={2} tone="caution" border>
            <Flex align="center" justify="space-between" gap={3} wrap="wrap">
              <Text weight="semibold">
                {selectedIds.size} document{selectedIds.size === 1 ? "" : "s"} selected
              </Text>
              <Button
                icon={TrashIcon}
                text="Delete Selected"
                tone="critical"
                disabled={deleting}
                onClick={() => setConfirming(true)}
              />
            </Flex>
          </Card>
        )}

        {loading ? (
          <Flex align="center" justify="center" padding={5}>
            <Spinner muted />
          </Flex>
        ) : documents.length === 0 ? (
          <Card padding={5} radius={2} border>
            <Text align="center" muted>
              {emptyMessage}
            </Text>
          </Card>
        ) : (
          <Stack space={2}>
            {documents.map((document) => (
              <Card key={document._id} padding={3} radius={2} border>
                <Flex align="center" gap={3}>
                  <Checkbox
                    aria-label={`Select ${document.title}`}
                    checked={selectedIds.has(document._id)}
                    disabled={deleting}
                    onChange={() => toggleDocument(document._id)}
                  />
                  <Box flex={1}>
                    <IntentLink
                      intent="edit"
                      params={{ id: document._id, type: documentType }}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      <Stack space={2}>
                        <Text weight="semibold">{document.title}</Text>
                        <Text size={1} muted>
                          Updated {document.subtitle}
                        </Text>
                      </Stack>
                    </IntentLink>
                  </Box>
                </Flex>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>

      {confirming && (
        <Dialog
          id={`${documentType}-bulk-delete-confirmation`}
          header="Delete selected documents?"
          width={1}
          onClose={deleting ? undefined : () => setConfirming(false)}
          footer={
            <Flex justify="flex-end" gap={2}>
              <Button
                text="Cancel"
                mode="ghost"
                disabled={deleting}
                onClick={() => setConfirming(false)}
              />
              <Button
                icon={TrashIcon}
                text={deleting ? "Deleting..." : "Delete Selected"}
                tone="critical"
                disabled={deleting}
                onClick={deleteSelected}
              />
            </Flex>
          }
        >
          <Box padding={4}>
            <Text>
              Delete {selectedDocuments.length} selected document
              {selectedDocuments.length === 1 ? "" : "s"}? This cannot be undone.
            </Text>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}
