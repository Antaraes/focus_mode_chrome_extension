import "./index.css";
import { Message } from "@src/types/index";

class PopupController {
  private export20Button: HTMLButtonElement;
  private export200Button: HTMLButtonElement;
  private exportAllButton: HTMLButtonElement;
  private goToYouTubeButton: HTMLButtonElement;
  private statusElement: HTMLElement;
  private isOnYouTubeSearch: boolean = false;

  constructor() {
    this.export20Button = document.getElementById("export20") as HTMLButtonElement;
    this.export200Button = document.getElementById("export200") as HTMLButtonElement;
    this.exportAllButton = document.getElementById("exportAll") as HTMLButtonElement;
    this.goToYouTubeButton = document.getElementById("goToYouTube") as HTMLButtonElement;
    this.statusElement = document.getElementById("status") as HTMLElement;

    this.init();
  }

  private init(): void {
    this.setupEventListeners();
    this.checkCurrentTab();
    this.setupMessageListener();
  }

  private setupEventListeners(): void {
    this.export20Button.addEventListener("click", () => this.handleExport("20"));
    this.export200Button.addEventListener("click", () => this.handleExport("200"));
    this.exportAllButton.addEventListener("click", () => this.handleExport("all"));
    this.goToYouTubeButton.addEventListener("click", () => this.openYouTubeSearch());
  }

  private async checkCurrentTab(): Promise<void> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];

    if (currentTab && currentTab.url && currentTab.url.includes("youtube.com/results")) {
      this.onYouTubeSearchPage();
    } else {
      this.notOnYouTubeSearchPage();
    }
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message: Message) => {
      if (message.action === "onYouTubeSearch") {
        this.onYouTubeSearchPage();
      }
      return true;
    });
  }

  private onYouTubeSearchPage(): void {
    this.isOnYouTubeSearch = true;
    this.statusElement.textContent = "Ready to export YouTube search results!";
    this.statusElement.classList.add("text-green-600");
    this.statusElement.classList.remove("text-gray-700");

    this.export20Button.disabled = false;
    this.export200Button.disabled = false;
    this.exportAllButton.disabled = false;
  }

  private notOnYouTubeSearchPage(): void {
    this.isOnYouTubeSearch = false;
    this.statusElement.textContent = "Not on a YouTube search page";
    this.statusElement.classList.remove("text-green-600");
    this.statusElement.classList.add("text-gray-700");

    this.export20Button.disabled = true;
    this.export200Button.disabled = true;
    this.exportAllButton.disabled = true;
  }

  private handleExport(type: "20" | "200" | "all"): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "exportVideos", data: type });
      }
    });
  }

  private openYouTubeSearch(): void {
    chrome.tabs.create({ url: "https://www.youtube.com/results?search_query=music" });
  }
}

// Initialize popup
document.addEventListener("DOMContentLoaded", () => {
  new PopupController();
});
