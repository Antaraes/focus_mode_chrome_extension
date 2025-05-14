import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { VideoData, ExportOptions } from "@src/types";
import Papa from "papaparse";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0];
}

export function getSearchQuery(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("search_query");
}

export function createFilename(prefix: string, query: string | null, count?: number): string {
  const date = formatDate(new Date());
  const sanitizedQuery = (query || "search").replace(/[^a-zA-Z0-9]/g, "_").substring(0, 10);
  const countStr = count ? `-${count}` : "";

  return `${prefix}-${countStr}_${sanitizedQuery}_-${date}.csv`;
}

export function showNotification(message: string, isError = false): void {
  const notification = document.createElement("div");
  notification.className = `ysre-notification ${isError ? "ysre-notification-error" : ""}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

export function showLoadingNotification(message: string): HTMLElement {
  const notification = document.createElement("div");
  notification.className = "ysre-notification";

  const spinner = document.createElement("span");
  spinner.className = "ysre-spinner";

  notification.appendChild(spinner);
  notification.appendChild(document.createTextNode(message));

  document.body.appendChild(notification);

  return notification;
}

export function generateCSV(data: VideoData[]): string {
  return Papa.unparse(data);
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: false,
  });

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
