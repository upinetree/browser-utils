document.addEventListener("DOMContentLoaded", function () {
  let checkbox = document.getElementById("notifications");

  // Load the current setting
  chrome.storage.sync.get("notifications", function (data) {
    checkbox.checked = data.notifications;
  });

  // Save the setting when the checkbox is toggled
  checkbox.addEventListener("change", function () {
    chrome.storage.sync.set({ notifications: checkbox.checked });
  });
});
