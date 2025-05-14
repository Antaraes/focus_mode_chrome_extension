# YSRExporter - YouTube Search Results Exporter

A Chrome extension that lets you easily export YouTube search results to CSV files.

## Features

- Export 20, 200, or all videos from YouTube search pages
- Extract comprehensive data from each video:
  - Title
  - Video URL
  - Video ID
  - Views
  - Publish Date
  - Thumbnail URLs
  - Video Length
  - Description
  - Channel name and URL
- Easy-to-use interface with export buttons directly on YouTube
- Clean and intuitive popup interface

## Installation

### For Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Load the unpacked extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### For Users

1. Download the latest release from [Releases](https://github.com/yourusername/ysrexporter/releases)
2. Extract the ZIP file
3. Follow the same steps as above to load the unpacked extension

## Usage

1. Go to any YouTube search page (e.g., https://www.youtube.com/results?search_query=music)
2. Click one of the export buttons that appear above the search results:
   - "Export 20 (free)" - Exports the first 20 videos (free version)
   - "Export 200" - Exports up to 200 videos
   - "Export All" - Exports all videos from the search results
3. The extension will generate a CSV file with all the video data and download it automatically

## Development

- `npm run dev` - Start development server
- `npm run build` - Build the extension
- `npm run preview` - Preview the built extension

## Technologies Used

- TypeScript
- Vite
- Tailwind CSS
- Chrome Extension API

## Project Structure

```
ysrexporter/
├── dist/                   # Built extension files
├── src/
│   ├── content.ts          # Content script injected into YouTube pages
│   ├── content.css         # Styles for the content script
│   ├── popup.ts            # Popup script
│   ├── background.ts       # Service worker (background script)
│   ├── utils.ts            # Utility functions
│   ├── types.ts            # TypeScript type definitions
│   └── index.css           # Main styles (Tailwind)
├── index.html              # Popup HTML
├── manifest.json           # Extension manifest
├── package.json            # Dependencies and scripts
└── README.md               # Documentation
```

## License

MIT
