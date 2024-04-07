document.addEventListener("DOMContentLoaded", function () {
  // --- notifications checkbox
  let notificationsCheckbox = document.getElementById("notifications");

  // Load the current setting
  chrome.storage.sync.get("notifications", function (data) {
    notificationsCheckbox.checked = data.notifications;
  });

  // Save the setting when the notificationsCheckbox is toggled
  notificationsCheckbox.addEventListener("change", function () {
    chrome.storage.sync.set({ notifications: notificationsCheckbox.checked });
  });

  // --- format select
  let formatSelect = document.getElementById("format");

  // Load the current setting
  chrome.storage.sync.get("format", function (data) {
    formatSelect.value = data.format;
  });

  // Save the setting when the formatSelect is changed
  formatSelect.addEventListener("change", function () {
    chrome.storage.sync.set({ format: formatSelect.value });
  });
});
