(async function loadSections() {
  const includeElements = document.querySelectorAll("[data-include]");

  try {
    for (const includeElement of includeElements) {
      const partialPath = includeElement.dataset.include;
      const response = await fetch(partialPath);

      if (!response.ok) {
        throw new Error(
          `Could not load ${partialPath} (${response.status})`
        );
      }

      const template = document.createElement("template");
      template.innerHTML = (await response.text()).trim();
      includeElement.replaceWith(template.content);
    }

    /*
      Website JavaScript starts only after every HTML section has been inserted into the page.
    */
    const siteScript = document.createElement("script");
    siteScript.src = "script.js";
    document.body.appendChild(siteScript);
  } catch (error) {
    console.error(
      "The portfolio sections could not be loaded.",
      error
    );

    document.documentElement.classList.remove(
      "initializing-home"
    );

    const message = document.createElement("p");
    message.className = "section-load-error";
    message.textContent =
      "The page sections could not load. Please view this site through a local web server or GitHub Pages.";

    document.body.appendChild(message);
  }
})();