"use strict";

const countriesList = document.querySelector(".countries");
const regionsList = document.querySelector(".regions-list");
const btnRegion = document.querySelector(".btn-region");
const filterComp = document.querySelector(".filter-component");
const inputSearch = document.querySelector(".filter-search");
const formFilter = document.querySelector(".country-filter");

let countriesData = [];

const fetchAllURL =
  "https://restcountries.com/v3.1/all?fields=name,flags,region,population,capital,currencies";

fillSkeletons();
fetchRestAPI(fetchAllURL);
function fetchRestAPI(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Error getting data");
      return response.json();
    })
    .then((data) => {
      countriesData = data;
      renderCountry(countriesData);
    })
    .catch((err) => console.log(`Error: ${err}`));
}

formFilter.addEventListener("input", (e) => {
  e.preventDefault();
  fillSkeletons();
  const data = Object.fromEntries(new FormData(formFilter));
  const input = Object.values(data).join("").trim().toLowerCase();
  if (!input) {
    renderCountry(countriesData);
    return;
  }

  const filtered = countriesData.filter(({ name: { common } }) =>
    common.toLowerCase().startsWith(input)
  );
  if (!filtered.length) {
    countriesList.innerHTML = `<p class="text-blue-900 dark:text-white font-bold text-center col-span-full text-2xl">No matches found. 😢</p>`;
    return;
  }

  renderCountry(filtered, true);
});
formFilter.addEventListener("submit", (e) => e.preventDefault());
function renderCountry(data, search = false) {
  const reveal = search ? "" : "animate-reveal";
  countriesList.innerHTML = data
    .map(({ name, region, flags, population, currencies, capital }, i) => {
      const delay = i * 0.1;
      const currencyName = Object.values(currencies)?.[0]?.name || "N/A";
      return `
      <li
            class="country-card ${reveal}  bg-white dark:bg-blue-900 shadow-sm rounded-sm overflow-hidden group"
            style="animation-delay: ${0.2 * delay}s"
          >
            <a href="details.html?country=${name.common}">
              <img
                class="group-hover:scale-105 w-full h-[160px] object-cover object-center transition-transform duration-300"
                src="${flags.svg}"
                alt=""
              />
              <div
                class="country-content p-6 pb-14 flex flex-col gap-2 relative"
              >
                <p class="text-1 font-extrabold leading-none">${name.common}</p>
                <p
                  class="region text-base text-grey-400 dark:opacity-90 dark:text-gray-100 font-bold mb-2 -mt-0.5 uppercase"
                >
                  ${region}
                </p>
                <p class="population font-semibold text-base">
                  Population: <span class="font-light">${population > 1_000_000 ? (population / 1_000_000).toFixed(1) + "M" : population.toLocaleString("en-US")}</span>
                </p>
                <p class="currency font-semibold text-base">
                  Currency: <span class="font-light">${currencyName}</span>
                </p>
                <p class="capital font-semibold text-base">
                  Capital: <span class="font-light">${capital}</span>
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="opacity-0 duration-200 scale-70 animate-bounce group-hover:scale-100 group-hover:opacity-100 size-5 absolute right-6 bottom-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
            </a>
          </li>
      `;
    })
    .join("");
}

document.addEventListener("click", (e) => {
  if (
    !filterComp.classList.contains("filter-active") ||
    e.target.closest(".btn-region") ||
    e.target.closest(".regions-list")
  )
    return;
  filterComp.classList.remove("filter-active");
});

regionsList.addEventListener("click", (e) => {
  const regionEL = e.target.closest(".region-item");
  if (!regionEL) return;
  fillSkeletons();
  const region = regionEL.dataset.region;
  document.querySelector(".btnRegion-Text").textContent = region;
  regionsList.querySelector(".active").classList.remove("active");
  regionEL.classList.add("active");
  filterComp.classList.toggle("filter-active");

  if (regionEL.dataset.all) {
    fetchRestAPI(fetchAllURL);
    inputSearch.placeholder = `Search for a country...`;
    return;
  }
  fetchRestAPI(`https://restcountries.com/v3.1/region/${region}`);
  inputSearch.placeholder = `Search in ${region}...`;
});

function fillSkeletons() {
  countriesList.innerHTML = `
    <li
              class="country-card  bg-white dark:bg-blue-900 shadow-sm rounded-sm overflow-hidden group"
            >
              <div class="w-full h-[160px] animate-loading"></div>
  
              <div class="country-content p-6 pb-14 flex flex-col gap-3 relative">
                <p class="animate-loading h-6 w-3/4 rounded-xs"></p>
                <p class="mb-2 w-1/3 h-4 animate-loading rounded-xs"></p>
                <p class="w-[60%] h-3 animate-loading rounded-xs"></p>
                <p class="w-[60%] h-3 animate-loading rounded-xs"></p>
                <p class="w-[60%] h-3 animate-loading rounded-xs"></p>
              </div>
            </li>
  `.repeat("8");
}
