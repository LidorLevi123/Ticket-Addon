# Ticket System Expansion Pack

A Chrome extension that enhances the functionality of the Ariel University ticket system with additional features and improved user experience.

![Extension Logo](img/logo.png)
*Extension logo and branding*

## Features

- **Location Tracking**: Automatically fetches and displays location information for tickets
- **Excel Export**: Export ticket data to Excel format for easy analysis and record-keeping
- **Multi-language Support**: Built-in translation services for better accessibility
- **Smart Caching**: Efficient ticket data caching for improved performance
- **User Messaging**: Enhanced communication features for ticket management
- **Label Management**: Advanced labeling system for better ticket organization

## Installation

1. Clone this repository:
```bash
git clone [repository-url]
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

![Installation Guide](img/installation.png)
*Step-by-step installation guide*

## Usage

The extension automatically activates when you visit the Ariel University ticket system pages:
- `https://pniot.ariel.ac.il/Projects/tzmm/Tickets_Application.asp`
- `https://pniot.ariel.ac.il/projects/tzmm/Add_Get_Tickets.asp`

### Key Features

#### Location Tracking
- Automatically fetches and displays location information for each ticket
- Caches location data for improved performance
- Displays location information in an easy-to-read format

![Location Tracking](img/location-tracking.png)
*Example of location information display*

**Example Usage:**
```javascript
// The extension automatically processes tickets and displays locations
// No additional code needed - just visit the ticket page
```

#### Excel Export
- Export ticket data to Excel format
- Includes all relevant ticket information
- Customizable export options

![Excel Export](img/excel-export.png)
*Excel export interface and sample output*

**Example Usage:**
1. Navigate to the tickets page
2. Click the Excel icon in the toolbar
3. Select export options:
   - Date range
   - Include location data
   - Include comments
4. Click "Export" to download the Excel file

#### Multi-language Support
- Built-in translation services
- Supports multiple languages
- Easy language switching

![Language Support](img/language-support.png)
*Language selection interface*

**Example Usage:**
1. Click the language icon in the toolbar
2. Select your preferred language
3. The interface will automatically update

### Troubleshooting

#### Common Issues and Solutions

1. **Location Not Loading**
   - Clear browser cache
   - Refresh the page
   - Check internet connection

2. **Excel Export Fails**
   - Ensure you have sufficient storage space
   - Check if the page is fully loaded
   - Try exporting a smaller date range

3. **Translation Not Working**
   - Clear extension cache
   - Reload the page
   - Check if the language file is properly loaded

![Troubleshooting Guide](img/troubleshooting.png)
*Common issues and their solutions*

## Project Structure

```
├── manifest.json          # Extension configuration
├── js/                    # JavaScript files
│   ├── services/         # Service modules
│   ├── lib/             # Library files
│   ├── location-fetch.js # Location processing
│   ├── excel-btn.js     # Excel export functionality
│   ├── labels.js        # Label management
│   ├── translate.js     # Translation services
│   ├── user-msg.js      # User messaging
│   └── main.js          # Main entry point
├── css/                  # Stylesheets
└── img/                  # Images and icons
```

## Development

### Prerequisites
- Chrome browser
- Basic knowledge of JavaScript and Chrome extension development

### Building
1. Make your changes to the source code
2. Test the changes in Chrome's extension development mode
3. Reload the extension to see your changes

![Development Setup](img/development.png)
*Development environment setup guide*

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

- Lidor Levi
- Daniel Zin

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ariel University for providing the base ticket system
- All contributors who have helped improve this extension

---

*Note: All images shown are placeholders. Please replace them with actual screenshots and diagrams of your extension in action.* 