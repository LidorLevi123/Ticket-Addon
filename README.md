# Ticket System Expansion Pack

A Chrome extension that enhances the Ariel University ticket system by providing instant access to ticket details and streamlined workflow features.

## Features

- **Instant Ticket Details**: View all ticket information directly on the main screen without opening individual tickets
- **Smart Clipboard**: One-click copy of formatted ticket details for easy sharing
- **Excel Export**: Export ticket data with customizable options
- **Multi-language Support**: Built-in translation services
- **Smart Caching**: Efficient data caching for better performance

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## Usage

The extension activates automatically on:
- `https://pniot.ariel.ac.il/Projects/tzmm/Tickets_Application.asp`
- `https://pniot.ariel.ac.il/projects/tzmm/Add_Get_Tickets.asp`

### Key Features

#### Instant Ticket Details
- All ticket information displayed on the main screen
- Location, contact info, and status visible at a glance
- No need to open individual tickets

#### Clipboard Integration
- One-click copy of formatted ticket details
- Includes all relevant information in a clean format
- Perfect for quick sharing and documentation

Example clipboard output:
```
Ticket ID: [ID]
Location: [Location]
Contact: [Name] - [Phone]
Status: [Status]
Description: [Description]
```

#### Excel Export
1. Click the Excel icon in the toolbar
2. Select export options (date range, data types)
3. Click "Export" to download

## Project Structure

```
├── manifest.json          # Extension configuration
├── js/                    # JavaScript files
│   ├── services/         # Service modules
│   ├── lib/             # Library files
│   ├── location-fetch.js # Ticket data processing
│   ├── excel-btn.js     # Excel export functionality
│   ├── labels.js        # Label management
│   ├── translate.js     # Translation services
│   └── main.js          # Main entry point
├── css/                  # Stylesheets
└── img/                  # Images and icons
```

## Authors

- Lidor Levi
- Daniel Zin

## License

This project is licensed under the MIT License. 