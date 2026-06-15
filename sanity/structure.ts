import { BellIcon, CalendarIcon, ImagesIcon, PlayIcon, UploadIcon, UsersIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";
import {
  CommunityPostBulkDocumentList,
  GalleryBulkDocumentList,
  TempleNoticeBulkDocumentList,
  TempleVideoBulkDocumentList,
} from "./components/BulkDocumentList";
import { GalleryBulkUpload } from "./components/GalleryBulkUpload";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Temple Content")
    .items([
      S.listItem()
        .id("temple-photos")
        .title("📸 Upload Temple Photos")
        .icon(ImagesIcon)
        .child(
          S.list()
            .title("Temple Photos")
            .items([
              S.listItem()
                .id("bulk-photo-upload")
                .title("Select Multiple Photos")
                .icon(UploadIcon)
                .child(
                  S.component(GalleryBulkUpload)
                    .id("gallery-bulk-upload")
                    .title("Upload Multiple Temple Photos"),
                ),
              S.listItem()
                .id("manage-temple-photos")
                .title("Manage Temple Photos")
                .icon(ImagesIcon)
                .child(
                  S.component(GalleryBulkDocumentList)
                    .id("gallery-bulk-document-list")
                    .title("Manage Temple Photos"),
                ),
            ]),
        ),
      S.listItem()
        .id("temple-videos")
        .title("🎥 Temple Videos")
        .icon(PlayIcon)
        .child(
          S.component(TempleVideoBulkDocumentList)
            .id("temple-video-bulk-document-list")
            .title("Temple Videos"),
        ),
      S.listItem()
        .id("community-posts")
        .title("📰 Community Posts")
        .icon(UsersIcon)
        .child(
          S.component(CommunityPostBulkDocumentList)
            .id("community-post-bulk-document-list")
            .title("Community Posts"),
        ),
      S.documentTypeListItem("festivalEvent")
        .title("Festivals & Events (Deprecated)")
        .icon(CalendarIcon),
      S.listItem()
        .id("temple-notices")
        .title("📢 Temple Notices")
        .icon(BellIcon)
        .child(
          S.component(TempleNoticeBulkDocumentList)
            .id("temple-notice-bulk-document-list")
            .title("Temple Notices"),
        ),
    ]);
