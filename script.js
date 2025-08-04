let currentAge = 25;
let money = 10000;
let reputation = 50;
let events = [];

window.onload = () => {
  fetch('data/events.json')
    .then(res => res.json())
    .then(data => {
      events = data;

      // Start button from main menu
      document.getElementById("startBtn").addEventListener("click", () => {
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("introOverlay").style.display = "flex";

        // Setup delayed play button after text animation
        setTimeout(() => {
          const playBtn = document.getElementById("playBtn");
          playBtn.style.display = "flex";
          playBtn.style.alignItems = "center";
          playBtn.style.justifyContent = "center";
          setTimeout(() => playBtn.style.opacity = 1, 100);
        }, 6250); // Wait for fade-in text animations to finish
      });

      // Play button → fade overlay → start game
      document.getElementById("playBtn").addEventListener("click", () => {
        document.getElementById("introOverlay").style.backgroundColor = "rgba(0,0,0,0.5)";
        setTimeout(() => {
          document.getElementById("introOverlay").style.display = "none";
          document.getElementById("gameUI").style.display = "flex";
          document.getElementById("ageUpBtn").addEventListener("click", ageUp);
        }, 1000);
      });
    });
};

function ageUp() {
  currentAge++;
  document.getElementById("age").textContent = `Age: ${currentAge}`;
  document.getElementById("money").textContent = `Money: $${money}`;

  const logBox = document.getElementById("log");

  const ageEntry = document.createElement("div");
  ageEntry.className = "logEntry";
  ageEntry.innerHTML = `<strong>You turned ${currentAge}.</strong>`;
  logBox.append(ageEntry);

  // Random event (50% chance)
  if (Math.random() < 0.5) {
    const event = events[Math.floor(Math.random() * events.length)];
    showEventModal(event);
  }

  logBox.scrollTop = logBox.scrollHeight;
}

function showEventModal(event) {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <p><strong>${event.description}</strong></p>
      ${event.choices.map((c, i) =>
        `<button onclick="handleChoice(${i}, ${JSON.stringify(event).replace(/"/g, '&quot;')})">${c.text}</button>`
      ).join('')}
    </div>
  `;

  document.body.appendChild(modal);
}

function handleChoice(choiceIndex, eventObj) {
  const choice = eventObj.choices[choiceIndex];

  // Apply effects
  money += choice.effects.money || 0;
  reputation += choice.effects.reputation || 0;

  // Update UI
  document.getElementById("money").textContent = `Money: $${money}`;

  // Add to log
  const logBox = document.getElementById("log");
  const entry = document.createElement("div");
  entry.className = "logEntry";
  entry.innerHTML = `<em>${eventObj.description} → ${choice.text}</em>`;
  logBox.append(entry);
  logBox.scrollTop = logBox.scrollHeight;

  // Close modal
  document.querySelector(".modal").remove();
}