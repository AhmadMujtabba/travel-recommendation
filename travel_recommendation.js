document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchbtn");
  const clearBtn = document.getElementById("clearbtn");
  const searchInput = document.getElementById("searchinput");

  const clearSearch = () => {
    if (searchInput) searchInput.value = "";
    const dropdown = document.getElementById("dropdown");
    if (dropdown) dropdown.style.display = "none";
  };

  const showResults = (results) => {
    let dropdown = document.getElementById("dropdown");
    let resultContainer = document.getElementById("resultContainer");

    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.id = "dropdown";
      dropdown.style.position = "absolute";
      dropdown.style.top = "80px";
      dropdown.style.left = "50%";
      dropdown.style.transform = "translateX(-50%)";
      dropdown.style.width = "80%";
      dropdown.style.background = "rgba(255,255,255,0.95)";
      dropdown.style.borderRadius = "10px";
      dropdown.style.padding = "20px";
      dropdown.style.zIndex = "999";
      dropdown.innerHTML = `<div id="resultContainer"></div>`;
      document.body.appendChild(dropdown);
      resultContainer = document.getElementById("resultContainer");
    }

    dropdown.style.display = "block";
    resultContainer.innerHTML = "";

    if (results.length === 0) {
      resultContainer.innerHTML = `<p class="notfound">Sorry, no recommendations found.</p>`;
      return;
    }

    results.forEach((item) => {
      const resultCard = `
        <div class="result-card" style="margin-bottom:20px;">
          <h3>${item.name}</h3>
          <img src="${item.imageUrl}" alt="${item.name}" style="width:200px;height:120px;border-radius:8px;">
          <p>${item.description}</p>
        </div>
      `;
      resultContainer.innerHTML += resultCard;
    });
  };

  // Fetch JSON & handle search
  if (searchBtn) {
    fetch("travel_recommendation_api.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const performSearch = () => {
          const query = searchInput.value.toLowerCase().trim();
          if (!query) {
            clearSearch();
            return;
          }

          const foundResults = [];
          const keywords = ["temple", "beach", "country"];
          let searchType = "";

          if (keywords.some((k) => query.includes(k))) {
            if (query.includes("temple")) searchType = "temples";
            if (query.includes("beach")) searchType = "beaches";
          }

          if (searchType) {
            foundResults.push(...data[searchType]);
          } else {
            data.countries.forEach((country) => {
              if (country.name.toLowerCase().includes(query)) {
                foundResults.push(...country.cities);
              } else {
                country.cities.forEach((city) => {
                  if (city.name.toLowerCase().includes(query))
                    foundResults.push(city);
                });
              }
            });
          }

          showResults(foundResults);
        };

        searchBtn.addEventListener("click", performSearch);
        searchInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
          }
        });
      })
      .catch((error) => console.error("Error fetching travel data:", error));
  }

  if (clearBtn) clearBtn.addEventListener("click", clearSearch);
});
