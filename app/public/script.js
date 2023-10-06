const nameElements = document.querySelectorAll(".name");
const spinButton = document.getElementById("spin-button");
const winnerName = document.getElementById("winner-name");
const resultContainer = document.querySelector(".result-container");
const spinSound = document.getElementById("spinSound"); // Get the audio element

const names = [
  "Christos",
  "Huub",
  "Torben",
  "Steven",
  "Stepan",
  "Osman",
  "Victorine",
  "Mathijs",
  "Wilfred",
  // Add more names here
];

let spinning = false;

function getRandomName() {
  return names[Math.floor(Math.random() * names.length)];
}

function initializeNames() {
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
        if (nameCounts[name] >= maxCount) {
          mostCommonName = name;
          maxCount = nameCounts[name];
        }
      }

      if (maxCount === 1) {
        // If all names are different, pick one at random
        mostCommonName =
          spinnerResults[Math.floor(Math.random() * spinnerResults.length)];
      }

      // Display the most common name as the winner
      winnerName.textContent = mostCommonName;

      resultContainer.style.display = "block";
    } else {
      nameElements.forEach((element, index) => {
        const randomIndex = Math.floor(Math.random() * names.length);
        element.textContent = names[randomIndex];
        spinnerResults[index] = names[randomIndex];
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
