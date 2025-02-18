let mouseInIframe = false;
/**
 *
 * @param {MouseEvent} e
 */
function showPreview(e) {
  "d".slice(0, "d".lastIndexOf("e"))
  let title = e.currentTarget.innerText ?? e.currentTarget.href;
  // Remove any existing iframe first
  removePreview();
  if (mouseInIframe) mouseInIframe = false;
  // chrome.runtime.sendMessage({ action: "log", log: e.currentTarget.href });
  // Create the iframe
  const container = document.createElement("div");
  container.classList.add("preview-container");

  const iframe = document.createElement("iframe");
  iframe.src = e.currentTarget.href;

  iframe.onerror = () => {
    chrome.runtime.sendMessage({ action: "log", log: "iframe error" });
  };

  iframe.classList.add("preview");
  iframe.style.position = "absolute";
  iframe.style.width = "400px";
  iframe.style.height = "300px";
  iframe.style.zIndex = "9999998";
  iframe.style.border = "1px solid #ccc";
  iframe.style.backgroundColor = "#fff";
  iframe.style.opacity = "0"; // Full opacity for visibility
  iframe.style.transition = "opacity 0.2s ease-in-out";
  iframe.style.borderRadius = "10px";
  iframe.style.background = "rgba(255, 255, 255, 0.7);";
  // iframe.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2);"
  iframe.style.border = "2px solid rgba(0, 0, 0, 0.1);";
  iframe.style.backdropFilter = "blur(8px)";
  iframe.style.visibility = "hidden";

  setTimeout(() => {
    if (iframe) iframe.style.visibility = "visible";
  }, 500);

  const saveBadge = document.createElement("div");
  const saveImage = document.createElement("img");

  saveBadge.appendChild(saveImage);
  saveBadge.classList.add("save-badge");
  saveBadge.style.position = "absolute";
  saveBadge.style.zIndex = "9999999";
  // saveBadge.textContent = "hi"

  saveImage.src = chrome.runtime.getURL("img/save.webp");
  saveImage.style.width = "50px";
  saveImage.style.opacity = "0";
  saveImage.style.transition = "opacity 0.2s ease-in-out";
  // iframe.style.opacity = "1"

  // iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");

  // Get link position
  const rect = e.target.getBoundingClientRect();
  iframe.style.top = `${rect.bottom + window.scrollY}px`;
  iframe.style.left = `${rect.left + window.scrollX}px`;

  saveBadge.style.top = `${rect.bottom + window.scrollY + 20}px`;
  saveBadge.classList.add("save-badge");
  saveBadge.style.left = `${rect.left + window.scrollX + 350}px`;

  // Append to the body
  document.body.appendChild(iframe);
  document.body.appendChild(saveBadge);

  setTimeout(() => {
    iframe.style.opacity = "1"; // transition
    saveImage.style.opacity = "1";
  }, 700);

  // iframe.onload = () => {
  //   const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  //   const links = iframeDoc.querySelectorAll("a");
  //   links.forEach((a) => {
  //     a.target = "_top"; // This makes links open in the main window
  //   });
  // };
  // ^ Doesn't work, CORS is preventing :(

  let mouseInSave = false;

  saveBadge.addEventListener("mouseenter", () => (mouseInSave = true));
  saveBadge.addEventListener("mouseleave", () => (mouseInSave = false)); 

  saveBadge.addEventListener("click", async () => {
    const settings = await chrome.runtime.sendMessage({ action: "getSettings" });
    if(!settings.history) settings.history = []
    settings.history.unshift({link: document.querySelector("iframe.preview").src, title: title.length < 1 ? document.querySelector("iframe.preview").src : !title.includes("http") ? title : title.slice(0, title.lastIndexOf("http"))}); // save button thingy
    chrome.runtime.sendMessage({ action: "saveSettings", settings });
    saveBadge.style.transform = "scale(1.2)";
    setTimeout(() => {
      saveBadge.style.transform = "scale(1)";
    }, 100);
  }
)

  let timeout;
  iframe.addEventListener("mouseleave", () => {
    if(mouseInSave) return; // prevent closing when hovering over save badge
    iframe.style.transition = "opacity 0.5s ease-in-out";
    setTimeout(() => {
      if (timeout) iframe.style.opacity = "0";
    }, 1000);
    timeout = setTimeout(() => {
      removePreview();
    }, 2000);
  });

  iframe.addEventListener("mouseenter", () => {
    // chrome.runtime.sendMessage({ action: "log", log: "iframe enter" });
    mouseInIframe = true;
    iframe.style.transition = "opacity 0.15s ease-in-out";
    iframe.style.opacity = "1";
    clearTimeout(timeout);
    timeout = null;
  });

  e.currentTarget.addEventListener("mouseleave", () => {
    // chrome.runtime.sendMessage({ action: "log", log: mouseInIframe });
    setTimeout(() => {
      if (!mouseInIframe) removePreview();
    }, 100);
  });
}

// Function to remove the iframe
function removePreview() {
  const existingIframe = document.querySelector("iframe.preview");
  if (existingIframe) {
    existingIframe.remove();
  }
  const existingSaveBadge = document.querySelector("div.save-badge");
  if (existingSaveBadge) {
    existingSaveBadge.remove();
  }
}

chrome.runtime.sendMessage({ action: "getSettings" }).then((data) => {
  const state = data.settings.state ?? true;
  if (state) {
    document.querySelectorAll("a").forEach((element) => {
      element.onmouseover = showPreview;
    });
  }
});
