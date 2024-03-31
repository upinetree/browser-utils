const formats = ["markdown", "scrapbox", "html"];

formats.forEach((format) => {
  chrome.contextMenus.create({
    id: format,
    title: format,
    contexts: ["action"],
  });
});

let format = "markdown";

chrome.contextMenus.onClicked.addListener((info) => {
  format = info.menuItemId;
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: async (format, url, title) => {
      const text = (() => {
        switch (format) {
          case "markdown":
            return `[${title}](${url})`;

          case "scrapbox":
            return `[${title} ${url}]`;

          case "html":
            return `<a href="${url}">${title}</a>`;

          default:
            return url;
        }
      })();

      await navigator.clipboard.writeText(text).then(
        function () {
          console.log("Copying to clipboard was successful!");
        },
        function (err) {
          console.error("Could not copy text: ", err);
        }
      );
    },
    args: [format, tab.url, tab.title],
  });
});
