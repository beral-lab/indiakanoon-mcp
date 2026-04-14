const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const { chromium } = require("playwright-core");

const server = new Server(
  { name: "indiakanoon-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "search_indiakanoon",
      description: "Search IndiaKanoon for Indian case law and return results",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Legal search query" },
          numResults: { type: "number", description: "Number of results to return (default 5)" }
        },
        required: ["query"]
      }
    },
    {
      name: "get_judgment",
      description: "Get the full text of a judgment from IndiaKanoon given its URL",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "IndiaKanoon URL of the judgment" }
        },
        required: ["url"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    if (name === "search_indiakanoon") {
      const numResults = args.numResults || 5;
      const searchUrl = `https://indiankanoon.org/search/?formInput=${encodeURIComponent(args.query)}`;
      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

      const results = await page.evaluate((n) => {
        const items = document.querySelectorAll(".result");
        return Array.from(items).slice(0, n).map(item => {
          const titleEl = item.querySelector("a");
          const snippetEl = item.querySelector(".snippet");
          return {
            title: titleEl ? titleEl.innerText.trim() : "No title",
            url: titleEl ? "https://indiankanoon.org" + titleEl.getAttribute("href") : "",
            snippet: snippetEl ? snippetEl.innerText.trim() : ""
          };
        });
      }, numResults);

      return {
        content: [{
          type: "text",
          text: JSON.stringify(results, null, 2)
        }]
      };
    }

    if (name === "get_judgment") {
      await page.goto(args.url, { waitUntil: "domcontentloaded", timeout: 30000 });

      const text = await page.evaluate(() => {
        const judgmentEl = document.querySelector("#judgmentText");
        return judgmentEl ? judgmentEl.innerText.trim() : document.body.innerText.trim();
      });

      return {
        content: [{
          type: "text",
          text: text.slice(0, 50000)
        }]
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } finally {
    await browser.close();
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
