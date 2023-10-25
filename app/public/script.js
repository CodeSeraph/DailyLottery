const nameElements = document.querySelectorAll(".name");
const spinButton = document.getElementById("spin-button");
const winnerName = document.getElementById("winner-name");
const resultContainer = document.querySelector(".result-container");
const spinSound = document.getElementById("spinSound");

const names = [
  "Christos",
  "Huub",
  "Torben",
  "Stepan",
  "Osman",
  "Victorine",
  "Mathijs",
  "Wilfred",
  // Add more names here
];

let spinning = false;
let selectedNames = [...names]; // Track selected names and initialize with all names

function getRandomName() {
  return selectedNames[Math.floor(Math.random() * selectedNames.length)];
}

function initializeNames() {
  nameElements.forEach((element) => {
    element.textContent = getRandomName();
  });

  const namesList = document.getElementById("names-list");

  namesList.innerHTML = ""; // Clear the names list

  selectedNames.forEach((name) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true; // By default, all names are selected
    checkbox.value = name;
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedNames.push(name);
      } else {
        selectedNames = selectedNames.filter(
          (selectedName) => selectedName !== name
        );
      }
      regenerateSlotMachineNames(); // Refresh slot machine names
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(name));
    namesList.appendChild(label);
  });
}

function regenerateSlotMachineNames() {
  nameElements.forEach((element) => {
    element.textContent = getRandomName();
  });
}

function rotateNames() {
  spinning = true;

  let animationDuration = 4000; // Adjust the animation duration here
  const interval = 100; // Interval between updates
  const totalFrames = animationDuration / interval;
  const framesPerReel = totalFrames / nameElements.length;

  let currentFrame = 0;
  let spinnerResults = [];

  // Get the initial names displayed in the slot-machine reels
  nameElements.forEach((element) => {
    spinnerResults.push(element.textContent);
  });

  const spinInterval = setInterval(() => {
    currentFrame++;

    if (currentFrame >= totalFrames) {
      clearInterval(spinInterval);
      spinning = false;

      // Determine the most common name
      const nameCounts = {};

      for (const name of spinnerResults) {
        if (name in nameCounts) {
          nameCounts[name]++;
        } else {
          nameCounts[name] = 1;
        }
      }

      let mostCommonName = "";
      let maxCount = 0;

      for (const name in nameCounts) {
        if (nameCounts[name] > maxCount) {
          mostCommonName = name;
          maxCount = nameCounts[name];
        }
      }

      if (maxCount === 1) {
        // If all names are different, pick one at random from the spinnerResults
        mostCommonName =
          spinnerResults[Math.floor(Math.random() * spinnerResults.length)];
      }

      // Display the most common name as the winner
      winnerName.textContent = mostCommonName;

      resultContainer.style.display = "block";
    } else {
      nameElements.forEach((element, index) => {
        const randomIndex = Math.floor(Math.random() * selectedNames.length);
        element.textContent = selectedNames[randomIndex];
        spinnerResults[index] = selectedNames[randomIndex];
      });
    }
  }, interval);
}

// Initialize names on page load
initializeNames();

spinButton.addEventListener("click", () => {
  if (!spinning) {
    resultContainer.style.display = "none";
    rotateNames();
    spinSound.play();

    setTimeout(() => {
      showPartyPopper();
    }, 4000);

    // Pause the sound when the spinning is complete
    const animationDuration = 7000; // The same duration as your animation
    setTimeout(() => {
      spinSound.pause();
      spinSound.currentTime = 0; // Reset the audio to the beginning
    }, animationDuration);
  }
});

function showPartyPopper() {
  const confettiCount = 400; // Increase the number of confetti particles
  const particleSize = 3; // Decrease the size of each particle

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw"; // Random horizontal position
    confetti.style.animationDelay = Math.random() * 4 + "s"; // Random animation delay
    confetti.style.backgroundColor = getRandomColor(); // Random background color
    confetti.style.width = particleSize + "px"; // Set particle width
    confetti.style.height = particleSize + "px"; // Set particle height
    document.body.appendChild(confetti);
  }

  // Remove the confetti elements after the animation is complete
  setTimeout(() => {
    const confettiElements = document.querySelectorAll(".confetti");
    confettiElements.forEach((confetti) => {
      confetti.remove();
    });
    resultContainer.style.display = "block"; // Show the winner result
  }, 5000); // Adjust the duration to match your confetti animation
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
