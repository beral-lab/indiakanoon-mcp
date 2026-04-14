# indiakanoon-mcp

A Model Context Protocol (MCP) server that connects Claude Desktop to 
IndiaKanoon, allowing Claude to search and retrieve Indian case law directly 
within your conversation.

## What it does

- **Search IndiaKanoon** — Run natural language legal queries and get back 
  case titles, URLs, and snippets from IndiaKanoon's database
- **Fetch full judgments** — Retrieve the complete text of any judgment 
  directly from IndiaKanoon by URL

## Demo

Ask Claude things like:
> "Search IndiaKanoon for Supreme Court cases on the last seen theory under 
  Section 302 IPC"

> "Fetch the full judgment in Trimukh Maroti Kirkan v. State of Maharashtra"

> "Find cases where the Delhi High Court has interpreted Article 21 in the 
  context of undertrial prisoners"

## Prerequisites

- [Node.js](https://nodejs.org) (LTS version)
- [Claude Desktop](https://claude.ai/download)

## Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/indiakanoon-mcp.git
cd indiakanoon-mcp
```

**2. Install dependencies**
```bash
npm install
npx playwright install chromium
```

**3. Add to Claude Desktop config**

Find your Claude Desktop config file:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following to your `mcpServers` section:
```json
{
  "mcpServers": {
    "indiakanoon-mcp": {
      "command": "cmd",
      "args": ["/c", "node", "C:\\path\\to\\indiakanoon-mcp\\index.js"]
    }
  }
}
```

Replace `C:\\path\\to\\` with the actual path where you cloned the repo.

**4. Restart Claude Desktop**

The IndiaKanoon MCP will appear under Settings → Developer.

## Usage

Once installed, just ask Claude naturally:

- *"Search IndiaKanoon for cases on anticipatory bail under Section 438 CrPC"*
- *"Find Supreme Court judgments on the basic structure doctrine"*
- *"Get the full text of [IndiaKanoon URL]"*

Claude will automatically use the MCP to search and retrieve results.

## Limitations

- IndiaKanoon may rate-limit rapid successive requests
- Full text retrieval works best for judgments under 50,000 characters
- No login required — works entirely on IndiaKanoon's public database

## Disclaimer

This tool uses IndiaKanoon's publicly accessible website for personal legal 
research purposes. It is not affiliated with or endorsed by IndiaKanoon. Use 
responsibly and in accordance with IndiaKanoon's terms of service.

## Built with

- [Model Context Protocol SDK](https://github.com/anthropics/anthropic-sdk)
- [Playwright](https://playwright.dev)
- [IndiaKanoon](https://indiankanoon.org)

## Contributing

Pull requests welcome. Particularly interested in:
- Rate limiting improvements
- Better text extraction for older judgment formats
- Support for filtering by court, year, or bench

## License

MIT
