const formats = ["markdown", "scrapbox", "html"];
const default_format = "markdown";

formats.forEach((format) => {
  chrome.contextMenus.create({
    id: format,
    title: format,
    contexts: ["action"],
  });
});

const copyScript = async (format, url, title) => {
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
      console.log("Copying to clipboard was successful!, format:", format);
      chrome.runtime.sendMessage({
        action: "showNotification",
        format,
        text,
      });
    },
    function (err) {
      console.error("Could not copy text:", err);
    }
  );
};

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  if (request.action === "showNotification") {
    chrome.storage.sync.get("notifications", function (data) {
      if (data.notifications) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon-128.png",
          title: `Copied as ${request.format}!`,
          message: request.text,
        });
      }
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const format = info.menuItemId;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyScript,
    args: [format, tab.url, tab.title],
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  const data = await chrome.storage.sync.get("format");
  const format = data.format || default_format;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyScript,
    args: [format, tab.url, tab.title],
  });
});
