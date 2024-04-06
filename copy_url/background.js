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
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon-128.png",
      title: "Copied!",
      message: request.text,
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

chrome.action.onClicked.addListener((tab) => {
  const format = default_format;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyScript,
    args: [format, tab.url, tab.title],
  });
});
