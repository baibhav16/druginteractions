let drugInfoList = [];

function addDrug() {
  const name = document.getElementById("drugName").value.trim();
  const dosage = document.getElementById("drugDosage").value.trim();

  if (!name || !dosage) {
    alert("Please enter both drug name and dosage.");
    return;
  }

  const entry = `${name} - ${dosage}`;
  drugInfoList.push(entry);

  const listDiv = document.getElementById("drugList");
  listDiv.innerHTML += `<div>✔️ ${entry}</div>`;

  document.getElementById("drugName").value = "";
  document.getElementById("drugDosage").value = "";
}

async function submitDrugs() {
  if (drugInfoList.length === 0) {
    alert("Add at least one drug before submitting.");
    return;
  }

  document.getElementById("loading").style.display = "block";

  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drugs: drugInfoList })
    });

    const result = await response.json();

    showResult("interactions", result.interactions);
    showResult("dosage", result.dosage_safety);
    showResult("warnings", result.clinical_warnings);
    showResult("recommendations", result.recommendations);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to analyze drug data.");
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

function showResult(id, text) {
  const container = document.getElementById(id);
  container.innerText = text;

  const icon = document.getElementById(id + "-icon");
  const safe = !/(risk|danger|warning|increase|monitor|avoid|fatal|toxic|contraindicat)/i.test(text);

  icon.innerText = safe ? "✅" : "❌";
}

function toggleDarkMode() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-mode");

  localStorage.setItem("theme", isDark ? "dark" : "light");

  const toggleBtn = document.getElementById("toggleModeBtn");
  toggleBtn.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Load saved theme on page load
window.onload = function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("toggleModeBtn").innerText = "☀️ Light Mode";
  } else {
    document.getElementById("toggleModeBtn").innerText = "🌙 Dark Mode";
  }
};
