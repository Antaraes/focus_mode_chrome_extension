import { VideoData, ExportType, Message } from "@src/types";
import {
  createFilename,
  getSearchQuery,
  generateCSV,
  showNotification,
  showLoadingNotification,
} from "@src/lib/utils";

class YSRExporter {
  private buttonContainer: HTMLDivElement | null = null;
  private observer: MutationObserver | null = null;
  private isProcessing = false;

  constructor() {
    this.init();
    this.setupMessageListener();
  }

  private init(): void {
    // Wait for the page to fully load
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupExporter());
    } else {
      this.setupExporter();
    }
  }

  private setupExporter(): void {
    // Add export buttons
    this.insertExportButtons();

    // Setup mutation observer to handle YouTube's dynamic page changes
    this.setupObserver();

    // Let the popup know we're on a YouTube search page
    this.notifyPopup({ action: "onYouTubeSearch" });
  }

  private setupObserver(): void {
    // Create an observer to watch for changes in the DOM
    this.observer = new MutationObserver((mutations) => {
      // Check if our buttons are still in the DOM
      if (!document.contains(this.buttonContainer)) {
        this.insertExportButtons();
      }
    });

    // Start observing the document body for changes
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private insertExportButtons(): void {
    // Don't add buttons if they already exist
    if (document.querySelector(".ysre-button-container")) return;

    // Find a good insertion point - under the filter buttons
    const filterBar = document.querySelector("#filter-menu");
    if (!filterBar) return;

    // Create button container
    this.buttonContainer = document.createElement("div");
    this.buttonContainer.className = "ysre-button-container";

    // Create the buttons
    const button20 = this.createButton("Export 20 (free)", () => this.handleExport("20"));
    const button200 = this.createButton("Export 200", () => this.handleExport("200"));
    const buttonAll = this.createButton("Export All", () => this.handleExport("all"));

    // Add buttons to container
    this.buttonContainer.appendChild(button20);
    this.buttonContainer.appendChild(button200);
    this.buttonContainer.appendChild(buttonAll);

    // Insert container after filter bar
    filterBar.parentNode?.insertBefore(this.buttonContainer, filterBar.nextSibling);
  }

  private createButton(text: string, clickHandler: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "ysre-button";
    button.textContent = text;
    button.addEventListener("click", clickHandler);
    return button;
  }

  private async handleExport(type: ExportType): Promise<void> {
    if (this.isProcessing) {
      showNotification("Export already in progress", true);
      return;
    }

    this.isProcessing = true;
    const loadingNotification = showLoadingNotification(`Exporting YouTube search results...`);

    try {
      const query = getSearchQuery();
      let limit: number;

      switch (type) {
        case "20":
          limit = 20;
          break;
        case "200":
          limit = 200;
          break;
        case "all":
          limit = Number.MAX_SAFE_INTEGER;
          break;
        default:
          limit = 20;
      }

      const videos = await this.extractVideoData(limit);

      if (videos.length === 0) {
        throw new Error("No videos found");
      }

      const filename = createFilename("YSRExporter", query, videos.length);
      const csvContent = generateCSV(videos);

      // Create and download the CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 100);

      loadingNotification.remove();
      showNotification(`Successfully exported ${videos.length} videos`);
    } catch (error) {
      loadingNotification.remove();
      showNotification(
        `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        true
      );
      console.error("YSRExporter error:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async extractVideoData(limit: number): Promise<VideoData[]> {
    return new Promise((resolve) => {
      // Get all video elements on the page
      const videoElements = Array.from(
        document.querySelectorAll("ytd-video-renderer, ytd-grid-video-renderer")
      );
      const results: VideoData[] = [];

      // Cap at the limit
      const elementsToProcess = videoElements.slice(0, limit);

      for (const element of elementsToProcess) {
        try {
          // Extract title and URL
          const titleElement = element.querySelector("#video-title, .title-wrapper a");
          if (!titleElement) continue;

          const title = titleElement.textContent?.trim() || "";
          const videoUrl = (titleElement as HTMLAnchorElement).href || "";
          const videoId = new URLSearchParams(new URL(videoUrl).search).get("v") || "";

          // Extract metadata
          const metadataElements = element.querySelectorAll(
            "#metadata-line span, .metadata-snippet-container span"
          );
          let views = "";
          let publishDate = "";

          if (metadataElements.length >= 2) {
            views = metadataElements[0].textContent?.trim() || "";
            publishDate = metadataElements[1].textContent?.trim() || "";
          }

          // Extract channel info
          const channelElement = element.querySelector("#channel-name a, .channel-link");
          const channel = channelElement?.textContent?.trim() || "";
          const channelUrl = (channelElement as HTMLAnchorElement)?.href || "";

          // Extract thumbnails
          const thumbnailElement = element.querySelector("#thumbnail img, .yt-core-image");
          const thumbnailSmall = (thumbnailElement as HTMLImageElement)?.src || "";
          const thumbnailLarge = thumbnailSmall.replace(/\?.*$/, "");

          // Extract video length
          const lengthElement = element.querySelector(
            "#text.ytd-thumbnail-overlay-time-status-renderer, .ytp-time-display"
          );
          const length = lengthElement?.textContent?.trim() || "";

          // Extract description
          const descriptionElement = element.querySelector("#description-text, .description-text");
          const description = descriptionElement?.textContent?.trim() || "";

          // Add to results
          results.push({
            title,
            videoUrl,
            videoId,
            views,
            publishDate,
            thumbnailSmall,
            thumbnailLarge,
            homePage: `https://www.youtube.com/watch?v=${videoId}`,
            length,
            description,
            channel,
            channelUrl,
          });
        } catch (e) {
          console.error("Error extracting video data:", e);
        }
      }

      resolve(results);
    });
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
      if (message.action === "exportVideos") {
        this.handleExport(message.data);
        sendResponse({ success: true });
      }
      return true;
    });
  }

  private notifyPopup(message: Message): void {
    chrome.runtime.sendMessage(message);
  }
}

// Initialize the exporter
new YSRExporter();
