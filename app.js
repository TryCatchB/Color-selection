const cols = document.querySelectorAll(".col");

document.addEventListener("keydown", (event) => {
  event.preventDefault();
  if (event.code.toLowerCase() === "space") {
    setRandomColours();
  }
});

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;

  if (type === "lock") {
    const node =
      event.target.tagName.toLowerCase() === "i"
        ? event.target
        : event.target.children[0];

    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClickBoard(event.target.textContent);
  }
});

function copyToClickBoard(title) {
  return navigator.clipboard.writeText(title);
}

function setRandomColours(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    const isLocked = col.querySelector("i").classList.contains("fa-lock");
    const title = col.querySelector("h2");
    const text = col.querySelector("p");
    const button = col.querySelector("button");

    title.addEventListener("mouseup", () => {
      text.textContent = "copied";
      text.style.display = "block";
    });

    title.addEventListener("mouseleave", () => {
      text.style.display = "none";
    });

    if (isLocked) {
      colors.push(title.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) {
      colors.push(color);
    }

    title.textContent = color;
    col.style.background = color;

    setTextColour(title, color);
    setTextColour(button, color);
  });
  updateColorsnHash(colors);
}

function setTextColour(title, color) {
  const luminance = chroma(color).luminance();
  title.style.color = luminance > 0.5 ? "black" : "white";
}

function updateColorsnHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }

  return [];
}

setRandomColours(true);
