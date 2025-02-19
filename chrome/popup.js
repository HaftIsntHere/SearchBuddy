function mainPage() {
  clearPage();
  // document.createElement("h1").innerText = "Search Buddy"
  const title = document.createElement("h1");
  title.innerText = "Search Buddy";
  title.style.textAlign = "center";
  document.body.appendChild(title);

  const toggleButton = document.createElement("button");
  const settingsButton = document.createElement("button");

  chrome.runtime.sendMessage({ action: "getSettings" }).then((data) => {
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

  settingsButton.style.background = "none";
  settingsButton.style.border = "none";
  settingsButton.style.position = "absolute";
  settingsButton.style.left = "5%";
  settingsButton.style.top = "4%";
  settingsButton.style.cursor = "pointer";

  const settingsButtonImage = document.createElement("img");
  settingsButtonImage.src = "img/gear.png";
  settingsButtonImage.style.background = "none";
  settingsButtonImage.style.width = "40px";
  settingsButtonImage.style.position = "relative";
  settingsButtonImage.style.right = "5%";
  settingsButtonImage.style.top = "0px";
  settingsButtonImage.style.cursor = "pointer";
  settingsButton.appendChild(settingsButtonImage);

  document.body.appendChild(settingsButton);

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

  settingsButton.onclick = () => {
    settingsPage();
  };
}

function settingsPage() {
  clearPage();
  const title = document.createElement("h1");
  title.innerText = "Settings";

  // modeToggle.innerText = "Enable blacklist";

  const listTitle = document.createElement("h2");
  listTitle.style.textAlign = "center";
  document.body.appendChild(listTitle);

  const modeToggle = document.createElement("button");
  modeToggle.style.width = "50%";
  modeToggle.style.borderRadius = "10px";
  modeToggle.style.fontFamily = "Roboto, sans-serif";
  modeToggle.style.fontWeight = "bold";
  modeToggle.style.height = "30px";
  modeToggle.style.position = "relative";
  modeToggle.style.bottom = "10px";
  modeToggle.style.left = "25%";
  document.body.appendChild(modeToggle);

  chrome.runtime.sendMessage({ action: "getSettings" }).then((data) => {
    const mode = data.settings.listMode ?? "blacklist";
    if (mode === "whitelist") {
      modeToggle.style.backgroundColor = "#F7DC6F";
      modeToggle.style.border = "2px solid #F1C40F";
      modeToggle.innerText = "Enable blacklist";
      listTitle.innerText = "Whitelist";
    } else {
      modeToggle.style.backgroundColor = "#A1C9F2";
      modeToggle.style.border = "2px solid #4F7AC7";
      modeToggle.innerText = "Enable whitelist";
      listTitle.innerText = "Blacklist";
    }

    modeToggle.onclick = () => {
      chrome.runtime.sendMessage({ action: "getSettings" }).then((data) => {
        const mode = data.settings.listMode ?? "blacklist";
        if (mode === "blacklist") {
          modeToggle.style.backgroundColor = "#F7DC6F";
          modeToggle.style.border = "2px solid #F1C40F";
          modeToggle.innerText = "Enable blacklist";
          listTitle.innerText = "Whitelist";
        } else {
          modeToggle.style.backgroundColor = "#A1C9F2";
          modeToggle.style.border = "2px solid #4F7AC7";
          modeToggle.innerText = "Enable whitelist";
          listTitle.innerText = "Blacklist";
        }
        chrome.runtime.sendMessage({
          action: "saveSettings",
          settings: {
            ...data,
            settings: {
              ...data.settings,
              listMode: mode === "blacklist" ? "whitelist" : "blacklist",
            },
          },
        });
      });
    };
  });

  const addItemInput = document.createElement("input");
  addItemInput.type = "text";
  // addItemInput.style.position = "relative";
  // addItemInput.style.top = "5%";
  // addItemInput.style.left = "37%";
  // addItemInput.style.transform = "translate(-50%, -50%)";
  addItemInput.style.width = "60%";
  addItemInput.style.padding = "10px";
  addItemInput.style.borderRadius = "10px";
  addItemInput.placeholder = "Add item";

  const addItemButton = document.createElement("button");
  addItemButton.innerHTML = "Add";
  // addItemButton.style.position = "relative";
  addItemButton.style.width = "20%";
  addItemButton.style.height = "30px";
  addItemButton.style.backgroundColor = "#B2FFD6";
  addItemButton.style.borderRadius = "10px";
  addItemButton.style.border = "none";
  addItemButton.style.cursor = "pointer";

  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "10%";
  container.style.display = "flex";
  container.style.gap = "10px";
  // container.style.flexDirection = "column";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";

  document.body.appendChild(container);
  container.appendChild(addItemButton);
  container.appendChild(addItemInput);

  chrome.runtime.sendMessage({ action: "getSettings" }).then((data) => {
    const list = data.settings.list ?? [];
    list.forEach((item) => {
      newItem(false, item);
    });
  });

  addItemButton.onclick = () => {
    if (addItemInput.value === "") return;
    newItem(true);
  };

  async function newItem(fromInput = false, value = null) {
    const item = document.createElement("button");
    // link.href = url.link;
    // link.target = "_blank";
    let textvalue
    if (fromInput) textvalue = addItemInput.value;
    else textvalue = value;

    item.innerText = textvalue;

    let shouldReturn = false;
    if (fromInput) {
      await chrome.runtime
        .sendMessage({
          action: "getSettings",
        })
        .then((data) => {
          if (data.settings.list.includes(addItemInput.value)) {
            shouldReturn = true;
          }
        });
    }

    if(shouldReturn) return;

    item.style.color = "black";
    item.style.left = "40%";
    item.style.position = "relative";
    item.style.marginTop = "10px";
    item.style.backgroundColor = "#c5dbe6";
    item.style.border = "2px solid #45a";
    item.style.borderRadius = "10px";
    item.style.height = "40px";
    item.style.width = "80%";
    item.style.overflowWrap = "break-word";

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
    item.appendChild(deleteButton);

    deleteButton.onclick = (e) => {
      e.stopPropagation();
      chrome.runtime
        .sendMessage({
          action: "getSettings",
        })
        .then((data) => {
          chrome.runtime.sendMessage({
            action: "saveSettings",
            settings: {
              ...data,
              settings: {
                ...data.settings,
                list: data.settings.list.filter((i) => i !== textvalue),
              },
            },
          });
          item.remove();
        });
    };

    // link.style.fontSizeAdjust = "0.3"
    item.style.transform = "translateX(-50%)";
    // link.style.cursor = "pointer";
    document.body.appendChild(item);
    // list.appendChild(item);

    // item.onclick = () => {
    //   chrome.tabs.create({ url: url.link });
    // };

    if (fromInput) {
      chrome.runtime
        .sendMessage({
          action: "getSettings",
        })
        .then((data) => {
          if (!data.settings.list) data.settings.list = [];
          chrome.runtime.sendMessage({
            action: "saveSettings",
            settings: {
              ...data,
              settings: {
                ...data.settings,
                list: [...data.settings.list, addItemInput.value],
              },
            },
          });
          addItemInput.value = "";
        });
    }
  }
}

function clearPage() {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
}

mainPage();
