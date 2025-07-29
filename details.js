"use strict";
const detailsContainer = document.querySelector(".country-details");
const params = new URLSearchParams(window.location.search);
const countryName = params.get("country");

fetch(`https://restcountries.com/v3.1/name/${countryName}`)
  .then((response) => {
    if (!response.ok) throw new Error("Cuntry NOT Found");
    return response.json();
  })
  .then(renderCountry)
  .catch((err) => {
    detailsContainer.innerHTML = `<p class="text-red-600 text-xl">Country not found 😢</p>`;
    console.error(err);
  });

function renderCountry([data]) {
  // prettier-ignore
  const {name, flags, region, population, subregion, capital, currencies, languages, tld, borders} = data
  const nativeName = Object.values(name.nativeName)?.[0]?.common || "N/A";
  const currencyName = Object.values(currencies)?.[0]?.name || "N/A";
  const langs = Object.values(languages);

  detailsContainer.innerHTML = `
  <div
          class="img-box self-center rounded-sm h-fit shadow-sm group cursor-pointer overflow-hidden  transition-transform duration-300"
        >
          <img    
            class="w-full animate-reveal object-cover  delay-150 transition-transform duration-300  "
            src="${flags.svg}"
            alt=""
          />
        </div>

        <div class="info-box lg:self-center">
          <p class="text-1 font-extrabold mb-4">${name.common}</p>
          <div class="main-content flex flex-col xs:flex-row gap-8">
            <div class="main-info flex-1 space-y-2">
              <p class="native-name font-semibold text-base">
                Native name: <span class="font-light">${nativeName}</span>
              </p>
              <p class="population font-semibold text-base">
                Population: <span class="font-light">${population > 1_000_000 ? (population / 1_000_000).toFixed(1) + "M" : population.toLocaleString("en-US")}</span>
              </p>
              <p class="region font-semibold text-base">
                Region: <span class="font-light">${region}</span>
              </p>
              <p class="subregion font-semibold text-base">
                Sub Region: <span class="font-light">${subregion}</span>
              </p>
              <p class="capital font-semibold text-base">
                Capital: <span class="font-light">${capital}</span>
              </p>
            </div>
            <div class="secondary-info space-y-2 flex-1">
              <p class="domain font-semibold text-base">
                Top Level Domain: <span class="font-light">${tld}</span>
              </p>
              <p class="currency font-semibold text-base">
                Currencies: <span class="font-light">${currencyName}</span>
              </p>
              <p class="languages font-semibold text-base">
                Languages: <span class="font-light">${langs?.join(", ")}</span>
              </p>
            </div>
          </div>

          <aside
            class="border-countries mt-8 flex flex-col  gap-2 col-span-2 sm:flex-col"
          >
            <p class="text-lg font-bold inline text-nowrap">${!borders ? "No border Countries" : "Border Countries:"}</p>
            <ul class="borders flex gap-4 text-base flex-wrap ">
              
            </ul>
          </aside>
        </div>
  `;

  if (!borders) return;
  Promise.all(
    borders.map((code) =>
      fetch(`https://restcountries.com/v3.1/alpha/${code}?fields=name`).then(
        (res) => res.json()
      )
    )
  ).then(renderBorders);
}

function renderBorders(data) {
  const bordersList = document.querySelector(".borders");
  bordersList.innerHTML = data
    .map(({ name: { common } }, i) => {
      const delay = i * 0.1;
      return `
      <li
        class="group xs:animate-fadeIn hover:-translate-y-1 relative transition-transform duration-300 border-item shadow-sm rounded-sm dark:bg-blue-900 bg-white"
        style="animation-delay: ${0.2 * delay}s"
        >
          <a
            class="px-5 py-3 inline-block"
            href="details.html?country=${common}"
            >${common}</a
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="opacity-0 duration-200 scale-70 animate-bounce group-hover:scale-100 group-hover:opacity-100 size-3 absolute top-2 right-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
     </li>
      `;
    })
    .join("");
}
