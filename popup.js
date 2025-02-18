const toggleButton = document.createElement("button");
const settings = chrome.runtime
  .sendMessage({ action: "getSettings" })
  .then((data) => {
    const state = data.settings.state ?? true;

    if (state) {
      toggleButton.innerText = "Disable";
      toggleButton.style.backgroundColor = "#FFB4B4";
      toggleButton.style.border = "2px solid #EC7694";
    } else {
      toggleButton.innerText = "Enable";
      toggleButton.style.backgroundColor = "#B2FFD6";
      toggleButton.style.border = "2px solid #689F38";
    }

    const history = data.history ?? [];

    history.forEach((url) => {
      const link = document.createElement("button");
      // link.href = url.link;
      link.target = "_blank";
      link.innerText = url.title;
      link.style.position = "relative";
      link.style.left = "42%";
      link.style.marginTop = "10px";
      link.style.backgroundColor = "#c5dbe6";
      link.style.border = "2px solid #45a";
      link.style.borderRadius = "10px";
      link.style.height = "40px";
      link.style.width = "80%";
      link.style.overflowWrap = "break-word";

      const deleteButton = document.createElement("button");
      deleteButton.style.position = "absolute";
      deleteButton.style.right = "-40px";
      deleteButton.style.top = "0px";
      deleteButton.innerText = "X";
      deleteButton.style.backgroundColor = "#EC7694";
      deleteButton.style.border = "none";
      deleteButton.style.borderRadius = "10px";
      deleteButton.style.height = "40px";
      deleteButton.style.width = "30px";
      deleteButton.style.cursor = "pointer";
      link.appendChild(deleteButton);

      deleteButton.onclick = (e) => {
        e.stopPropagation();
        const newHistory = history.filter(
          (item) => item.link !== url.link && item.title !== url.title
        );
        chrome.runtime.sendMessage({
          action: "saveSettings",
          settings: { ...data, history: newHistory },
        });
        link.remove();
      };

      // link.style.fontSizeAdjust = "0.3"
      link.style.transform = "translateX(-50%)";
      link.style.cursor = "pointer";
      document.body.appendChild(link);

      link.onclick = () => {
        chrome.tabs.create({ url: url.link });
      };
    });
  });
toggleButton.style.width = "50%";
toggleButton.style.borderRadius = "10px";
toggleButton.style.fontFamily = "Roboto, sans-serif";
toggleButton.style.fontWeight = "bold";
toggleButton.style.height = "30px";
toggleButton.style.position = "relative";
toggleButton.style.bottom = "10px";
toggleButton.style.left = "25%";
document.body.appendChild(toggleButton);

toggleButton.onclick = () => {
  chrome.runtime.sendMessage({ action: "getSettings" }).then((data) => {
    data.settings.state = !data.settings.state;
    chrome.runtime.sendMessage({
      action: "saveSettings",
      settings: data,
    });

    // console.log(data);
    const state = data.settings.state;
    if (state) {
      toggleButton.innerText = "Disable";
      toggleButton.style.backgroundColor = "#FFB4B4";
      toggleButton.style.border = "2px solid #EC7694";
    } else {
      toggleButton.innerText = "Enable";
      toggleButton.style.backgroundColor = "#B2FFD6";
      toggleButton.style.border = "2px solid #689F38";
    }
  });
};
document.body.appendChild(toggleButton);
