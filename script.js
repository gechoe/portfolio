/*
  Prevent the browser from restoring an old scroll
  position before we place the page at Home.
*/
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

async function createSkyStars() {
  const starsLayer =
    document.getElementById("stars-layer");

  const threeLeafCloverDimensions =
    await loadImageDimensions(
      "images/3Leaf_Clover_Up.PNG"
    );

  const maximumStarSize = Math.max(
    threeLeafCloverDimensions.width,
    threeLeafCloverDimensions.height
  );

  document.documentElement.style.setProperty(
    "--story-star-size",
    `${maximumStarSize + 6}px`
  );

  const minimumStarSize = Math.min(
    18,
    maximumStarSize
  );

  const totalStars = 30;
  const fragment =
    document.createDocumentFragment();

  starsLayer.replaceChildren();

  for (let index = 0; index < totalStars; index++) {
    const star = document.createElement("img");

    star.src = "images/favicon_star.PNG";
    star.alt = "";
    star.className = "sky-star";

    star.style.left =
      `${4 + Math.random() * 92}%`;

    star.style.top =
      `${5 + Math.random() * 90}%`;

    star.style.setProperty(
      "--star-size",
      `${
        minimumStarSize +
        Math.random() *
          (maximumStarSize - minimumStarSize)
      }px`
    );

    star.style.setProperty(
      "--star-rotation",
      `${Math.random() * 360}deg`
    );

    star.style.setProperty(
      "--star-opacity",
      `${0.55 + Math.random() * 0.4}`
    );

    fragment.appendChild(star);
  }

  starsLayer.appendChild(fragment);
}

createSkyStars();

/*
  Edit these entries to personalize the page revealed by each
  fixed, sparkling About Me star.
*/
const aboutStories = [
  {
    title: "My Hobbies",
    text: "In my free time, I enjoy: Drawing 🎨 and photographing 📷 nature, Reading books and graphic novels 📚, Writing short stories ✏️, Going on scenic nature walks 🍀"
  },
  {
    title: "Favorite Colors",
    text: "My fav colors are Blue🩵, Green💚, Yellow💛, & White🤍 - naturalistic colors."
  },
  {
    title: "Favorite Animals",
    text: "My fav animals are Pandas 🐼 & Axolotls."
  },
  {
    title: "Fav Quote",
    text: "My fav quote is: \"The only real mistake is the one from which we learn nothing.\" 💬"
  },
//   {
//     title: "Photo Gallery",
//     text: "Here are some photos I've taken:"
//   },
  {
    title: "Lifelong Learner",
    text: "My main goal is to keep learning, thinking, and growing~!"
  },
//   {
//     title: "Mentor",
//     text: "I value helping other people build confidence, navigate unfamiliar problems, and grow their skills."
//   },
//   {
//     title: "Design Enthusiast",
//     text: "I care about clear, friendly UI and UX that helps technology feel intuitive and welcoming."
//   },
//   {
//     title: "Project Builder",
//     text: "I love bringing ideas from an early concept to something real that people can see, use, and enjoy."
//   },
//   {
//     title: "Easter Eggs",
//     text: "There are some easter eggs hiding around this website. Try and find them all~! :D"
//   }
];

const aboutStoryStars = [
  ...document.querySelectorAll(".about-story-star")
];

const aboutBookOverlay =
  document.getElementById("about-book-overlay");

const aboutBookClose =
  document.getElementById("about-book-close");

const aboutBookPageNumber =
  document.getElementById("about-book-page-number");

const aboutBookTitle =
  document.getElementById("about-book-title");

const aboutBookText =
  document.getElementById("about-book-text");

const aboutBookStoryPanel =
  document.getElementById("about-book-story-panel");

const aboutBookTabs = [
  ...document.querySelectorAll(".about-book-tab")
];

let lastAboutStar = null;
let aboutBookHideTimer = null;

function showAboutBookStory(storyIndex) {
  const story = aboutStories[storyIndex];

  if (!story) {
    return;
  }

  aboutBookTitle.textContent = story.title;
  aboutBookText.textContent = story.text;
  aboutBookPageNumber.textContent =
    `Fun Fact ${storyIndex + 1} of ${aboutStories.length}`;

  aboutBookTabs.forEach((tab, tabIndex) => {
    const isSelected = tabIndex === storyIndex;

    tab.setAttribute(
      "aria-selected",
      String(isSelected)
    );

    tab.tabIndex = isSelected ? 0 : -1;

    if (isSelected) {
      aboutBookStoryPanel.setAttribute(
        "aria-labelledby",
        tab.id
      );
    }
  });
}

function openAboutBook(storyIndex, starButton) {
  const story = aboutStories[storyIndex];

  if (!story) {
    return;
  }

  clearTimeout(aboutBookHideTimer);
  lastAboutStar = starButton;
  showAboutBookStory(storyIndex);

  aboutBookOverlay.hidden = false;
  document.body.style.overflow = "hidden";

  window.requestAnimationFrame(() => {
    aboutBookOverlay.classList.add("is-visible");
    aboutBookClose.focus();
  });
}

function closeAboutBook() {
  aboutBookOverlay.classList.remove("is-visible");
  document.body.style.overflow = "";

  aboutBookHideTimer = setTimeout(() => {
    aboutBookOverlay.hidden = true;
  }, 260);

  lastAboutStar?.focus();
}

aboutStoryStars.forEach((starButton) => {
  starButton.addEventListener("click", () => {
    openAboutBook(
      Number(starButton.dataset.story),
      starButton
    );
  });
});

aboutBookTabs.forEach((tab, tabIndex) => {
  tab.setAttribute(
    "aria-label",
    `Page ${tabIndex + 1}: ${aboutStories[tabIndex].title}`
  );

  tab.addEventListener("click", () => {
    showAboutBookStory(
      Number(tab.dataset.story)
    );
  });

  tab.addEventListener("keydown", (event) => {
    let nextTabIndex = null;

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      nextTabIndex =
        (tabIndex + 1) % aboutBookTabs.length;
    } else if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {
      nextTabIndex =
        (tabIndex - 1 + aboutBookTabs.length) %
        aboutBookTabs.length;
    } else if (event.key === "Home") {
      nextTabIndex = 0;
    } else if (event.key === "End") {
      nextTabIndex = aboutBookTabs.length - 1;
    }

    if (nextTabIndex === null) {
      return;
    }

    event.preventDefault();
    showAboutBookStory(nextTabIndex);
    aboutBookTabs[nextTabIndex].focus();
  });
});

aboutBookClose?.addEventListener(
  "click",
  closeAboutBook
);

aboutBookOverlay?.addEventListener(
  "click",
  (event) => {
    if (event.target === aboutBookOverlay) {
      closeAboutBook();
    }
  }
);

window.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    aboutBookOverlay?.classList.contains("is-visible")
  ) {
    closeAboutBook();
  }
});

const homeSection =
  document.getElementById("home");

const navigationButtons = [
  ...document.querySelectorAll(
    '.menu-button[href^="#"]'
  )
];

function setActiveNavigation(sectionId) {
  navigationButtons.forEach((button) => {
    if (
      button.getAttribute("href") ===
      `#${sectionId}`
    ) {
      button.setAttribute(
        "aria-current",
        "page"
      );
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

setActiveNavigation("home");

/*
  Change this number if the Home landing position
  needs to be moved farther down or higher.
*/
const homeScrollOffset = 0;

const homeReturnButton =
  document.getElementById("home-return-button");

const homeReturnArrow =
  document.getElementById("home-return-arrow");

const homeReturnLabel =
  document.getElementById("home-return-label");

function scrollToHome(behavior = "smooth") {
  if (!homeSection) {
    return;
  }

  window.scrollTo({
    top:
      homeSection.offsetTop +
      homeScrollOffset,
    left: 0,
    behavior
  });
}

document
  .querySelectorAll('a[href="#home"]')
  .forEach((homeLink) => {
    homeLink.addEventListener(
      "click",
      (event) => {
        event.preventDefault();

        setActiveNavigation("home");
        scrollToHome();

        history.replaceState(
          null,
          "",
          "#home"
        );
      }
    );
  });

/*
  Center the actual content in the viewport when a section
  button is used. The fixed logo bar is excluded from the
  available vertical space.
*/
function scrollSectionCardsToCenter(
  sectionId,
  behavior = "smooth"
) {
  const section =
    document.getElementById(sectionId);

  if (!section) {
    return;
  }

  const cards = [
    ...section.querySelectorAll(
      ".info-card, .about-content, .experience-content, .education-content, .projects-header"
    )
  ];

  if (cards.length === 0) {
    return;
  }

  const cardRectangles = cards.map(
    (card) => card.getBoundingClientRect()
  );

  const cardsTop =
    Math.min(
      ...cardRectangles.map(
        (rectangle) => rectangle.top
      )
    ) + window.scrollY;

  const cardsBottom =
    Math.max(
      ...cardRectangles.map(
        (rectangle) => rectangle.bottom
      )
    ) + window.scrollY;

  const cardsCenter =
    (cardsTop + cardsBottom) / 2;

  const maximumScroll = Math.max(
    0,
    document.documentElement.scrollHeight -
      window.innerHeight
  );

  const logoBar =
    document.querySelector(".top-bar");

  const logoBarBottom = logoBar
    ? logoBar.getBoundingClientRect().bottom
    : 0;

  const usableSpaceCenter =
    logoBarBottom +
    (window.innerHeight - logoBarBottom) / 2;

  const centeredScrollPosition =
    cardsCenter - usableSpaceCenter;

  window.scrollTo({
    top: Math.min(
      maximumScroll,
      Math.max(0, centeredScrollPosition)
    ),
    left: 0,
    behavior
  });
}

/*
  Experience is taller than the other sections, so its
  navigation link reveals the title instead of centering
  the complete timeline.
*/
function scrollExperienceTitleIntoView(
  behavior = "smooth"
) {
  const experienceTitle =
    document.querySelector(
      "#experience .experience-content > h2"
    );

  const educationTitle =
    document.querySelector(
      "#education .education-content > h2"
    );

  const educationContent =
    document.querySelector(
      "#education .education-content"
    );

  if (!experienceTitle) {
    return;
  }

  const logoBar =
    document.querySelector(".top-bar");

  const logoBarBottom = logoBar
    ? logoBar.getBoundingClientRect().bottom
    : 0;

  const experienceTitleTop =
    experienceTitle.getBoundingClientRect().top +
    window.scrollY;

  let desiredTitleTop = logoBarBottom + 56;

  /*
    Match the title position produced when Education is
    centered instead of using a viewport-specific gap.
  */
  if (educationTitle && educationContent) {
    const educationRectangle =
      educationContent.getBoundingClientRect();

    const educationContentCenter =
      (
        educationRectangle.top +
        educationRectangle.bottom
      ) / 2 + window.scrollY;

    const usableSpaceCenter =
      logoBarBottom +
      (window.innerHeight - logoBarBottom) / 2;

    const maximumScroll = Math.max(
      0,
      document.documentElement.scrollHeight -
        window.innerHeight
    );

    const educationCenteredScroll = Math.min(
      maximumScroll,
      Math.max(
        0,
        educationContentCenter -
          usableSpaceCenter
      )
    );

    const educationTitleTop =
      educationTitle.getBoundingClientRect().top +
      window.scrollY;

    desiredTitleTop =
      educationTitleTop -
      educationCenteredScroll;
  }

  window.scrollTo({
    top: Math.max(
      0,
      experienceTitleTop - desiredTitleTop
    ),
    left: 0,
    behavior
  });
}

/*
  Projects is taller than a single viewport once cards are
  added, so its link reveals the title with the same spacing.
*/
function scrollProjectsTitleIntoView(
  behavior = "smooth"
) {
  const projectsTitle =
    document.querySelector(
      "#projects .projects-header h2"
    );

  const educationTitle =
    document.querySelector(
      "#education .education-content > h2"
    );

  const educationContent =
    document.querySelector(
      "#education .education-content"
    );

  if (!projectsTitle) {
    return;
  }

  const logoBar =
    document.querySelector(".top-bar");

  const logoBarBottom = logoBar
    ? logoBar.getBoundingClientRect().bottom
    : 0;

  const projectsTitleTop =
    projectsTitle.getBoundingClientRect().top +
    window.scrollY;

  let desiredTitleTop = logoBarBottom + 56;

  if (educationTitle && educationContent) {
    const educationRectangle =
      educationContent.getBoundingClientRect();

    const educationContentCenter =
      (
        educationRectangle.top +
        educationRectangle.bottom
      ) / 2 + window.scrollY;

    const usableSpaceCenter =
      logoBarBottom +
      (window.innerHeight - logoBarBottom) / 2;

    const maximumScroll = Math.max(
      0,
      document.documentElement.scrollHeight -
        window.innerHeight
    );

    const educationCenteredScroll = Math.min(
      maximumScroll,
      Math.max(
        0,
        educationContentCenter -
          usableSpaceCenter
      )
    );

    const educationTitleTop =
      educationTitle.getBoundingClientRect().top +
      window.scrollY;

    desiredTitleTop =
      educationTitleTop -
      educationCenteredScroll;
  }

  window.scrollTo({
    top: Math.max(
      0,
      projectsTitleTop - desiredTitleTop
    ),
    left: 0,
    behavior
  });
}

[
  "about",
  "experience",
  "projects",
  "education"
].forEach((sectionId) => {
  document
    .querySelectorAll(`a[href="#${sectionId}"]`)
    .forEach((sectionLink) => {
      sectionLink.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          setActiveNavigation(sectionId);

          if (sectionId === "experience") {
            scrollExperienceTitleIntoView();
          } else if (sectionId === "projects") {
            scrollProjectsTitleIntoView();
          } else {
            scrollSectionCardsToCenter(
              sectionId
            );
          }

          history.replaceState(
            null,
            "",
            `#${sectionId}`
          );
        }
      );
    });
});

let navigationUpdateScheduled = false;

function updateActiveNavigation() {
  const logoBar =
    document.querySelector(".top-bar");

  const logoBarBottom = logoBar
    ? logoBar.getBoundingClientRect().bottom
    : 0;

  const usableSpaceCenter =
    logoBarBottom +
    (window.innerHeight - logoBarBottom) / 2;

  const centeredElement =
    document.elementFromPoint(
      window.innerWidth / 2,
      usableSpaceCenter
    );

  const centeredSection = centeredElement
    ? centeredElement.closest("section[id]")
    : null;

  if (
    centeredSection &&
    [
      "home",
      "experience",
      "projects",
      "education",
      "about"
    ].includes(centeredSection.id)
  ) {
    setActiveNavigation(centeredSection.id);
  }

  navigationUpdateScheduled = false;
}

function scheduleNavigationUpdate() {
  if (navigationUpdateScheduled) {
    return;
  }

  navigationUpdateScheduled = true;

  window.requestAnimationFrame(
    updateActiveNavigation
  );
}

window.addEventListener(
  "scroll",
  scheduleNavigationUpdate,
  { passive: true }
);

window.addEventListener(
  "resize",
  scheduleNavigationUpdate
);

function updateHomeReturnButton() {
  if (
    !homeSection ||
    !homeReturnButton ||
    !homeReturnArrow ||
    !homeReturnLabel
  ) {
    return;
  }

  const homeTop =
    homeSection.offsetTop;

  const homeBottom =
    homeTop + homeSection.offsetHeight;

  const viewportMiddle =
    window.scrollY +
    window.innerHeight / 2;

  if (viewportMiddle < homeTop) {
    homeReturnButton.hidden = false;

    homeReturnButton.setAttribute(
      "aria-label",
      "Return down to the home section"
    );

    homeReturnArrow.textContent = "↓";
    homeReturnLabel.textContent = "Back down";
  } else if (viewportMiddle > homeBottom) {
    homeReturnButton.hidden = false;

    homeReturnButton.setAttribute(
      "aria-label",
      "Return to the home section"
    );

    homeReturnArrow.textContent = "↑";
    homeReturnLabel.textContent = "Back to top";
  } else {
    homeReturnButton.hidden = true;
  }
}

window.addEventListener(
  "scroll",
  updateHomeReturnButton,
  { passive: true }
);

/*
  Position the hidden page at Home first. Reveal it only
  after the initial positioning is complete.
*/
function showPageAtHomeImmediately() {
  if (!homeSection) {
    document.documentElement.classList.remove(
      "initializing-home"
    );

    return;
  }

  const root =
    document.documentElement;

  const previousScrollBehavior =
    root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";

  window.scrollTo(
    0,
    homeSection.offsetTop +
      homeScrollOffset
  );

  updateHomeReturnButton();

  root.classList.remove(
    "initializing-home"
  );

  window.requestAnimationFrame(() => {
    root.style.scrollBehavior =
      previousScrollBehavior;
  });
}

showPageAtHomeImmediately();

function loadImageDimensions(source) {
  return new Promise(
    (resolve, reject) => {
      const image = new Image();

      image.addEventListener(
        "load",
        () => {
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight
          });
        }
      );

      image.addEventListener(
        "error",
        reject
      );

      image.src = source;
    }
  );
}

async function lockExperienceCloudPosition() {
  const experienceSection =
    document.getElementById("experience");

  if (!experienceSection) {
    return;
  }

  try {
    const cloudDimensions =
      await loadImageDimensions(
        "images/Clouds.PNG"
      );

    const renderedCloudWidth = 1200;

    const renderedCloudHeight =
      cloudDimensions.height *
      (
        renderedCloudWidth /
        cloudDimensions.width
      );

    const centeredCloudTop =
      (
        experienceSection.clientHeight -
        renderedCloudHeight
      ) / 2 + 60;

    experienceSection.style.backgroundPosition =
      `center ${centeredCloudTop}px, center`;
  } catch {
    experienceSection.style.backgroundPosition =
      "center calc(50% + 20px), center";
  }
}

lockExperienceCloudPosition();

window.addEventListener(
  "load",
  lockExperienceCloudPosition,
  { once: true }
);

let experienceCloudResizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(experienceCloudResizeTimer);

  experienceCloudResizeTimer = setTimeout(
    lockExperienceCloudPosition,
    180
  );
});

/*
  Keep exactly 50px of grass showing below the View More
  button regardless of how many cards are currently visible.
*/
const grassBottomGap = 50;

function syncGrassSectionHeight() {
  const section =
    document.querySelector(".extended-page");

  const viewMoreWrap =
    document.querySelector(
      ".projects-view-more-wrap"
    );

  if (!section || !viewMoreWrap) {
    return;
  }

  section.style.minHeight = "";

  const sectionTop =
    section.getBoundingClientRect().top +
    window.scrollY;

  const viewMoreBottom =
    viewMoreWrap.getBoundingClientRect().bottom +
    window.scrollY;

  const desiredHeight =
    viewMoreBottom -
    sectionTop +
    grassBottomGap;

  section.style.minHeight =
    `${desiredHeight}px`;
}

const cloverSource =
  "images/3Leaf_Clover_Up.PNG";

const cloverDimensionsPromise =
  loadImageDimensions(cloverSource);

function addEvenlySpacedClovers(
  section,
  amount,
  imageDimensions,
  options = {}
) {
  if (!section) {
    return;
  }

  const {
    minimumOpacity = 0.65,
    maximumOpacity = 1,
    topStart = 0,
    bottomEnd = 1,
    bandTopFromBottom = null,
    bandBottomFromBottom = null,
    edgePadding = 28,
    cardSelector = null,
    cardClearance = 28,
    candidateAttempts = 120
  } = options;

  section
    .querySelector(".clover-layer")
    ?.remove();

  const sectionRectangle =
    section.getBoundingClientRect();

  const sectionWidth =
    section.clientWidth;

  const sectionHeight =
    section.clientHeight;

  const minimumY =
    bandTopFromBottom === null
      ? Math.max(
          edgePadding,
          sectionHeight * topStart
        )
      : Math.max(
          edgePadding,
          sectionHeight -
            bandTopFromBottom
        );

  const maximumY =
    bandBottomFromBottom === null
      ? Math.min(
          sectionHeight - edgePadding,
          sectionHeight * bottomEnd
        )
      : Math.min(
          sectionHeight - edgePadding,
          sectionHeight -
            bandBottomFromBottom
        );

  const blockedRectangles =
    cardSelector
      ? [
          ...section.querySelectorAll(
            cardSelector
          )
        ].map((card) => {
          const rectangle =
            card.getBoundingClientRect();

          return {
            left:
              rectangle.left -
              sectionRectangle.left -
              cardClearance,

            right:
              rectangle.right -
              sectionRectangle.left +
              cardClearance,

            top:
              rectangle.top -
              sectionRectangle.top -
              cardClearance,

            bottom:
              rectangle.bottom -
              sectionRectangle.top +
              cardClearance
          };
        })
      : [];

  const layer =
    document.createElement("div");

  const placedClovers = [];

  layer.className = "clover-layer";

  layer.setAttribute(
    "aria-hidden",
    "true"
  );

  function isVisible(
    candidate,
    halfWidth,
    halfHeight
  ) {
    return !blockedRectangles.some(
      (rectangle) =>
        candidate.x + halfWidth >
          rectangle.left &&
        candidate.x - halfWidth <
          rectangle.right &&
        candidate.y + halfHeight >
          rectangle.top &&
        candidate.y - halfHeight <
          rectangle.bottom
    );
  }

  function distanceFromNearestClover(
    candidate
  ) {
    if (placedClovers.length === 0) {
      return Number.POSITIVE_INFINITY;
    }

    return Math.min(
      ...placedClovers.map((placed) =>
        Math.hypot(
          candidate.x - placed.x,
          candidate.y - placed.y
        )
      )
    );
  }

  for (let index = 0; index < amount; index++) {
    const quarterTurns =
      Math.floor(Math.random() * 4);

    const rotation =
      quarterTurns * 90;

    const swapsDimensions =
      quarterTurns % 2 === 1;

    const displayedWidth =
      swapsDimensions
        ? imageDimensions.height
        : imageDimensions.width;

    const displayedHeight =
      swapsDimensions
        ? imageDimensions.width
        : imageDimensions.height;

    const halfWidth =
      displayedWidth / 2;

    const halfHeight =
      displayedHeight / 2;

    /*
      The image diagonal is used as a conservative boundary
      so the clover remains fully inside the section when rotated.
    */
    const rotationSafeRadius =
      Math.hypot(
        imageDimensions.width,
        imageDimensions.height
      ) / 2;

    const cloverEdgeSafety = 6;

    const safeHalfWidth =
      Math.max(
        halfWidth,
        rotationSafeRadius
      ) + cloverEdgeSafety;

    const safeHalfHeight =
      Math.max(
        halfHeight,
        rotationSafeRadius
      ) + cloverEdgeSafety;

    const minimumX =
      edgePadding + safeHalfWidth;

    const maximumX =
      sectionWidth -
      edgePadding -
      safeHalfWidth;

    const boundedMinimumY =
      minimumY + safeHalfHeight;

    const boundedMaximumY =
      maximumY - safeHalfHeight;

    let bestCandidate = null;
    let bestDistance = -1;

    if (
      minimumX > maximumX ||
      boundedMinimumY > boundedMaximumY
    ) {
      continue;
    }

    for (
      let attempt = 0;
      attempt < candidateAttempts;
      attempt++
    ) {
      const candidate = {
        x:
          minimumX +
          Math.random() *
            (maximumX - minimumX),

        y:
          boundedMinimumY +
          Math.random() *
            (
              boundedMaximumY -
              boundedMinimumY
            )
      };

      if (
        !isVisible(
          candidate,
          safeHalfWidth,
          safeHalfHeight
        )
      ) {
        continue;
      }

      const nearestDistance =
        distanceFromNearestClover(candidate);

      if (nearestDistance > bestDistance) {
        bestCandidate = candidate;
        bestDistance = nearestDistance;
      }
    }

    if (!bestCandidate) {
      continue;
    }

    const clover =
      document.createElement("img");

    const opacity =
      minimumOpacity +
      Math.random() *
        (
          maximumOpacity -
          minimumOpacity
        );

    clover.src = cloverSource;
    clover.alt = "";
    clover.className = "random-clover";

    clover.width = imageDimensions.width;
    clover.height = imageDimensions.height;

    clover.style.left =
      `${bestCandidate.x}px`;

    clover.style.top =
      `${bestCandidate.y}px`;

    clover.style.setProperty(
      "--clover-rotation",
      `${rotation}deg`
    );

    clover.style.setProperty(
      "--clover-opacity",
      opacity.toFixed(2)
    );

    placedClovers.push(bestCandidate);
    layer.appendChild(clover);
  }

  section.prepend(layer);
}

async function placeAllClovers() {
  try {
    const imageDimensions =
      await cloverDimensionsPromise;

    const fourLeafCloverImage =
      document.getElementById(
        "four-leaf-clover-image"
      );

    if (fourLeafCloverImage) {
      fourLeafCloverImage.style.width =
        `${imageDimensions.width + 7}px`;

      fourLeafCloverImage.style.height =
        `${imageDimensions.height + 7}px`;
    }

    addEvenlySpacedClovers(
      document.querySelector(".hero"),
      15,
      imageDimensions,
      {
        bandTopFromBottom: 145,
        bandBottomFromBottom: 40,
        edgePadding: 24,
        candidateAttempts: 160
      }
    );

    const projectsSection =
      document.querySelector(".extended-page");

    if (projectsSection) {
      addEvenlySpacedClovers(
        projectsSection,
        projectsSection.classList.contains(
          "is-expanded"
        )
          ? 75
          : 55,
        imageDimensions,
        {
          topStart: 0.02,
          bottomEnd: 0.96,
          edgePadding: 32,
          cardSelector:
            ".project-card, .projects-view-more-wrap, .four-leaf-clover, .projects-header",
          cardClearance: 35,
          candidateAttempts: 200
        }
      );
    }
  } catch (error) {
    console.error(
      "The decorative clovers could not be created.",
      error
    );
  }
}

placeAllClovers();
syncGrassSectionHeight();

window.addEventListener(
  "load",
  syncGrassSectionHeight,
  { once: true }
);

let cloverResizeTimer;

window.addEventListener(
  "resize",
  () => {
    clearTimeout(cloverResizeTimer);

    cloverResizeTimer = setTimeout(() => {
      placeAllClovers();
      syncGrassSectionHeight();
    }, 200);
  }
);

const projectsSection =
  document.getElementById("projects");

const projectCards = [
  ...document.querySelectorAll(".project-card")
];

const projectsViewMore =
  document.getElementById("projects-view-more");

projectsViewMore?.addEventListener("click", () => {
  const isExpanded =
    projectsSection.classList.toggle(
      "is-expanded"
    );

  projectCards.forEach((card, index) => {
    card.classList.toggle(
      "is-hidden",
      !isExpanded && index >= 6
    );
  });

  projectsViewMore.setAttribute(
    "aria-expanded",
    String(isExpanded)
  );

  const label =
    projectsViewMore.querySelector(
      "span:last-child"
    );

  if (label) {
    label.textContent = isExpanded
      ? "View Less"
      : "View More";
  }

  const icon =
    projectsViewMore.querySelector(
      "span:first-child"
    );

  if (icon) {
    icon.textContent =
      isExpanded ? "−" : "＋";
  }

  requestAnimationFrame(() => {
    placeAllClovers();
    syncGrassSectionHeight();
  });
});

/*
  Project information appears on hover and keyboard focus
  through CSS. These listeners add equivalent behavior for
  tapping a project tile.
*/
const projectTiles = [
  ...document.querySelectorAll(".project-tile")
];

function closeProjectTiles(exceptTile = null) {
  projectTiles.forEach((tile) => {
    if (tile !== exceptTile) {
      tile.classList.remove("is-active");
    }
  });
}

projectTiles.forEach((tile) => {
  tile.addEventListener("click", (event) => {
    const wasActive =
      tile.classList.contains("is-active");

    closeProjectTiles(tile);

    tile.classList.toggle(
      "is-active",
      !wasActive
    );

    event.stopPropagation();
  });

  tile.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      tile.click();
    }

    if (event.key === "Escape") {
      tile.classList.remove("is-active");
      tile.blur();
    }
  });
});

document.addEventListener("click", () => {
  closeProjectTiles();
});

const experienceTriggers = [
  ...document.querySelectorAll(
    ".experience-trigger"
  )
];

/*
  Always begin with every experience collapsed
  and unselected.
*/
experienceTriggers.forEach((trigger) => {
  const item =
    trigger.closest(".experience-item");

  const details =
    document.getElementById(
      trigger.getAttribute("aria-controls")
    );

  trigger.setAttribute(
    "aria-expanded",
    "false"
  );

  item?.classList.remove("is-open");

  if (details) {
    details.hidden = true;
  }
});

experienceTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const wasOpen =
      trigger.getAttribute("aria-expanded") ===
      "true";

    experienceTriggers.forEach(
      (timelineTrigger) => {
        const item =
          timelineTrigger.closest(
            ".experience-item"
          );

        const details =
          document.getElementById(
            timelineTrigger.getAttribute(
              "aria-controls"
            )
          );

        const shouldOpen =
          timelineTrigger === trigger &&
          !wasOpen;

        timelineTrigger.setAttribute(
          "aria-expanded",
          String(shouldOpen)
        );

        item?.classList.toggle(
          "is-open",
          shouldOpen
        );

        if (details) {
          details.hidden = !shouldOpen;
        }
      }
    );
  });
});

const courseTabs = [
  ...document.querySelectorAll(".course-tab")
];

function activateCourseTab(selectedTab) {
  courseTabs.forEach((tab) => {
    const isSelected =
      tab === selectedTab;

    tab.setAttribute(
      "aria-selected",
      String(isSelected)
    );

    tab.tabIndex =
      isSelected ? 0 : -1;

    const panel =
      document.getElementById(
        tab.getAttribute("aria-controls")
      );

    if (panel) {
      panel.hidden = !isSelected;
    }
  });
}

courseTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    activateCourseTab(tab);
  });

  tab.addEventListener("keydown", (event) => {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) {
      return;
    }

    event.preventDefault();

    const direction =
      event.key === "ArrowRight"
        ? 1
        : -1;

    const nextTab =
      courseTabs[
        (
          index +
          direction +
          courseTabs.length
        ) % courseTabs.length
      ];

    activateCourseTab(nextTab);
    nextTab.focus();
  });
});

const fourLeafClover =
  document.getElementById("four-leaf-clover");

const cloverMessage =
  document.getElementById("clover-message");

const cloverMessageClose =
  document.getElementById(
    "clover-message-close"
  );

const developerLuck =
  document.getElementById("developer-luck");

const developerLuckMessages = [
  "A mysterious bug will be resolved today.",
  "Your next compile will succeed on the first try.",
  "A clever solution will appear after one good stretch.",
  "The documentation you need will be surprisingly clear.",
  "A forgotten side project will inspire your next great idea.",
  "Your next code review will contain more praise than changes.",
  "The perfect variable name will come to you immediately.",
  "A small refactor will bring unexpectedly large peace.",
  "Your curiosity will lead you to something worth building.",
  "The tab you almost closed contains exactly what you need."
];

function createCloverConfetti() {
  if (!fourLeafClover) {
    return;
  }

  const rectangle =
    fourLeafClover.getBoundingClientRect();

  const originX =
    rectangle.left +
    rectangle.width / 2;

  const originY =
    rectangle.top +
    rectangle.height / 2;

  const totalPieces = 26;

  for (
    let index = 0;
    index < totalPieces;
    index++
  ) {
    const piece =
      document.createElement("img");

    const angle =
      (
        Math.PI *
        2 *
        index
      ) / totalPieces +
      (
        Math.random() -
        0.5
      ) * 0.35;

    const distance =
      75 + Math.random() * 115;

    const isClover =
      index % 3 === 0;

    piece.src = isClover
      ? "images/Cursor_Click_Clover.PNG"
      : "images/favicon_star.PNG";

    piece.alt = "";
    piece.className =
      "clover-confetti-piece";

    piece.style.left =
      `${originX}px`;

    piece.style.top =
      `${originY}px`;

    piece.style.setProperty(
      "--burst-x",
      `${Math.cos(angle) * distance}px`
    );

    piece.style.setProperty(
      "--burst-y",
      `${Math.sin(angle) * distance}px`
    );

    piece.style.setProperty(
      "--piece-rotation",
      `${180 + Math.random() * 540}deg`
    );

    piece.style.setProperty(
      "--piece-size",
      `${12 + Math.random() * 12}px`
    );

    document.body.appendChild(piece);

    piece.addEventListener(
      "animationend",
      () => {
        piece.remove();
      }
    );
  }
}

function openCloverMessage() {
  if (
    !fourLeafClover ||
    !cloverMessage ||
    !developerLuck
  ) {
    return;
  }

  fourLeafClover.classList.remove(
    "is-celebrating"
  );

  void fourLeafClover.offsetWidth;

  fourLeafClover.classList.add(
    "is-celebrating"
  );

  createCloverConfetti();

  if (avatar) {
    avatarDefaultSource =
      "images/Avatar_wClover.PNG";

    avatarBlinkSource =
      "images/Avatar_wClover_Blink.PNG";

    avatar.src =
      avatarDefaultSource;
  }

  const randomLuck =
    developerLuckMessages[
      Math.floor(
        Math.random() *
          developerLuckMessages.length
      )
    ];

  developerLuck.textContent =
    randomLuck;

  window.setTimeout(() => {
    cloverMessage.classList.add(
      "is-visible"
    );

    cloverMessage.setAttribute(
      "aria-hidden",
      "false"
    );

    fourLeafClover.setAttribute(
      "aria-expanded",
      "true"
    );

    cloverMessageClose?.focus();
  }, 450);
}

function closeCloverMessage() {
  if (!cloverMessage || !fourLeafClover) {
    return;
  }

  cloverMessage.classList.remove(
    "is-visible"
  );

  cloverMessage.setAttribute(
    "aria-hidden",
    "true"
  );

  fourLeafClover.setAttribute(
    "aria-expanded",
    "false"
  );

  fourLeafClover.focus();
}

fourLeafClover?.addEventListener(
  "click",
  openCloverMessage
);

cloverMessageClose?.addEventListener(
  "click",
  closeCloverMessage
);

window.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      cloverMessage?.classList.contains(
        "is-visible"
      )
    ) {
      closeCloverMessage();
    }
  }
);

/*
  Mailbox and Contact navigation open the contact
  envelope dialog.
*/
const mailboxButton =
  document.getElementById("mailbox-button");

const contactNavButton =
  document.getElementById(
    "contact-nav-button"
  );

const contactEnvelopeOverlay =
  document.getElementById(
    "contact-envelope-overlay"
  );

const contactEnvelopeClose =
  document.getElementById(
    "contact-envelope-close"
  );

let lastContactTrigger = null;
let contactEnvelopeHideTimer = null;

function openContactEnvelope(triggerElement) {
  if (
    !contactEnvelopeOverlay ||
    !contactEnvelopeClose
  ) {
    return;
  }

  clearTimeout(contactEnvelopeHideTimer);

  lastContactTrigger =
    triggerElement || null;

  contactEnvelopeOverlay.hidden = false;
  document.body.style.overflow = "hidden";

  mailboxButton?.setAttribute(
    "aria-expanded",
    "true"
  );

  window.requestAnimationFrame(() => {
    contactEnvelopeOverlay.classList.add(
      "is-visible"
    );

    contactEnvelopeClose.focus();
  });
}

function closeContactEnvelope() {
  if (!contactEnvelopeOverlay) {
    return;
  }

  contactEnvelopeOverlay.classList.remove(
    "is-visible"
  );

  document.body.style.overflow = "";

  mailboxButton?.setAttribute(
    "aria-expanded",
    "false"
  );

  contactEnvelopeHideTimer = setTimeout(() => {
    contactEnvelopeOverlay.hidden = true;
  }, 260);

  lastContactTrigger?.focus();
}

/*
  Wait for the smooth scroll to Home to settle,
  then open the envelope.
*/
function revealContactAfterHomeScroll(
  triggerElement
) {
  window.setTimeout(() => {
    openContactEnvelope(triggerElement);
  }, 550);
}

mailboxButton?.addEventListener(
  "click",
  () => {
    setActiveNavigation("home");
    scrollToHome();

    history.replaceState(
      null,
      "",
      "#home"
    );

    revealContactAfterHomeScroll(
      mailboxButton
    );
  }
);

contactNavButton?.addEventListener(
  "click",
  () => {
    revealContactAfterHomeScroll(
      contactNavButton
    );
  }
);

contactEnvelopeClose?.addEventListener(
  "click",
  closeContactEnvelope
);

contactEnvelopeOverlay?.addEventListener(
  "click",
  (event) => {
    if (
      event.target ===
      contactEnvelopeOverlay
    ) {
      closeContactEnvelope();
    }
  }
);

window.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      contactEnvelopeOverlay?.classList.contains(
        "is-visible"
      )
    ) {
      closeContactEnvelope();
    }
  }
);

const avatar =
  document.getElementById("avatar");

let avatarDefaultSource =
  "images/Avatar.PNG";

let avatarBlinkSource =
  "images/Avatar_Blink.PNG";

avatar?.addEventListener(
  "click",
  () => {
    avatar.src = avatarBlinkSource;

    setTimeout(() => {
      avatar.src = avatarDefaultSource;
    }, 300);
  }
);

const changingText =
  document.getElementById("changing-text");

const phrases = [
  "Software Engineer",
  "curious problem solver",
  "creative artist",
  "lifelong learner"
];

let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;

function animateText() {
  if (!changingText) {
    return;
  }

  const currentPhrase =
    phrases[phraseIndex];

  if (isDeleting) {
    characterIndex--;
  } else {
    characterIndex++;
  }

  changingText.textContent =
    currentPhrase.substring(
      0,
      characterIndex
    );

  let delay =
    isDeleting ? 45 : 85;

  if (
    !isDeleting &&
    characterIndex === currentPhrase.length
  ) {
    isDeleting = true;
    delay = 2000;
  } else if (
    isDeleting &&
    characterIndex === 0
  ) {
    isDeleting = false;

    phraseIndex =
      (phraseIndex + 1) %
      phrases.length;

    delay = 400;
  }

  setTimeout(animateText, delay);
}

animateText();