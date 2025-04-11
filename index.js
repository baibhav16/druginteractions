let drugInfoList = [];
    
    // Animate the DrugCheck heading
    function setupAnimatedHeading() {
      const heading = document.getElementById("animatedHeading");
      const text = "DrugCheck";
      heading.innerHTML = '';
      
      for (let i = 0; i < text.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'heading-char';
        charSpan.style.setProperty('--char-index', i);
        charSpan.textContent = text[i];
        heading.appendChild(charSpan);
      }
    }

    function addDrug() {
      const name = document.getElementById("drugName").value.trim();
      const dosage = document.getElementById("drugDosage").value.trim();

      if (!name || !dosage) {
        alert("Please enter both drug name and dosage.");
        return;
      }

      const entry = ${name} - ${dosage};
      drugInfoList.push(entry);

      const listDiv = document.getElementById("drugList");
      listDiv.classList.remove("hidden");
      
      const drugItem = document.createElement("div");
      drugItem.className = "drug-item flex items-center bg-white dark:bg-gray-800 rounded-lg p-3 mb-2 shadow-sm";
      drugItem.innerHTML = `
        <span class="text-green-500 mr-2">✔</span>
        <span class="flex-grow">${entry}</span>
        <button onclick="removeDrug(${drugInfoList.length - 1})" class="text-red-500 hover:text-red-700">
          ✕
        </button>
      `;
      
      listDiv.appendChild(drugItem);

      document.getElementById("drugName").value = "";
      document.getElementById("drugDosage").value = "";
      document.getElementById("drugName").focus();
    }
    
    function removeDrug(index) {
      drugInfoList.splice(index, 1);
      renderDrugList();
    }
    
    function renderDrugList() {
      const listDiv = document.getElementById("drugList");
      
      if (drugInfoList.length === 0) {
        listDiv.classList.add("hidden");
        return;
      }
      
      listDiv.classList.remove("hidden");
      listDiv.innerHTML = "";
      
      drugInfoList.forEach((entry, index) => {
        const drugItem = document.createElement("div");
        drugItem.className = "drug-item flex items-center bg-white dark:bg-gray-800 rounded-lg p-3 mb-2 shadow-sm";
        drugItem.innerHTML = `
          <span class="text-green-500 mr-2">✔</span>
          <span class="flex-grow">${entry}</span>
          <button onclick="removeDrug(${index})" class="text-red-500 hover:text-red-700">
            ✕
          </button>
        `;
        
        listDiv.appendChild(drugItem);
      });
    }

    async function submitDrugs() {
      if (drugInfoList.length === 0) {
        alert("Add at least one drug before submitting.");
        return;
      }

      document.getElementById("loading").classList.remove("hidden");
      
      // Clear previous results
      document.getElementById("interactions").innerText = "";
      document.getElementById("dosage").innerText = "";
      document.getElementById("warnings").innerText = "";
      document.getElementById("recommendations").innerText = "";
      
      // Reset icons
      document.getElementById("interactions-icon").innerText = "";
      document.getElementById("dosage-icon").innerText = "";
      document.getElementById("warnings-icon").innerText = "";
      document.getElementById("recommendations-icon").innerText = "";

      try {
        const response = await fetch("https://drugback-ftne.onrender.com/analyze", {
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
        document.getElementById("loading").classList.add("hidden");
      }
    }

    function showResult(id, text) {
      const container = document.getElementById(id);
      container.innerText = text;

      const icon = document.getElementById(id + "-icon");
      const safe = !/(risk|danger|warning|increase|monitor|avoid|fatal|toxic|contraindicat)/i.test(text);

      icon.innerText = safe ? "✅" : "❌";
      icon.className = safe ? "result-safe" : "result-warning";
    }

    function toggleDarkMode() {
      const body = document.body;
      const isDark = body.classList.toggle("dark-mode");

      localStorage.setItem("theme", isDark ? "dark" : "light");
      
      document.getElementById("themeIcon").innerText = isDark ? "☀" : "🌓";
    }

    // Load saved theme on page load
    window.onload = function () {
      setupAnimatedHeading();
      
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("themeIcon").innerText = "☀";
      }
    };
