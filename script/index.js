const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLessons(data.data));
};

const createElement = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn" > ${el}</span >`);
  return htmlElements.join("");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (isloading) => {
  if (isloading) {
    document.getElementById("loadingSpinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("loadingSpinner").classList.add("hidden");
  }
};

const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;

  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
  <div class="bg-white border-2 border-blue-50 rounded-2xl p-6 shadow-sm">
              
              <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                ${word.word} 
                <span class="text-gray-700 font-medium">
                  ( <button class="hover:text-blue-600 transition-colors inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button> : ${word.pronunciation})
                </span>
              </h2>

              <div class="mb-6">
                <h3 class="text-lg font-bold text-gray-800 mb-2">Meaning</h3>
                <p class="text-gray-700 text-lg font-medium">${word.meaning}</p>
              </div>

              <div class="mb-6">
                <h3 class="text-lg font-bold text-gray-800 mb-2">Example</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  ${word.sentence}.
                </p>
              </div>

              <div class="mb-2">
                  ${
                    word.synonyms?.length > 0
                      ? `
                    <h3 class="text-lg font-bold text-gray-800 mb-3">সমার্থক শব্দ গুলো</h3>
                      <div class="flex flex-wrap items-start gap-2">
                        ${createElement(word.synonyms)}
                      </div>
                    `
                      : `<p class="text-gray-400 italic text-sm">কোনো সমার্থক শব্দ পাওয়া যায়নি।</p>`
                  }
              </div>
            </div>
  `;
  document.getElementById("details_modal").showModal();
};

const loadLevelWords = (id, event) => {
  // আগের সব বাটন থেকে btn-outline ক্লাস যোগ করুন
  const allBtns = document.querySelectorAll(".clickedbtn");
  allBtns.forEach((btn) => {
    btn.classList.add("btn-outline");
  });

  // বর্তমান ক্লিক করা বাটনে btn-outline ক্লাস রিমুভ করুন
  event.target.classList.remove("btn-outline");

  manageSpinner(true);

  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLevelWord(data.data));
};

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length === 0) {
    wordContainer.innerHTML = `
        <div class="col-span-full">
          <img class="mx-auto" src="./assets/alert-error.png" alt="">
          <p class="text-gray-500 mb-3"><span class="bangla-font">এই </span>Lesson<span class="bangla-font"> এ এখনো কোন</span> Vocabulary<span class="bangla-font"> যুক্ত করা হয়নি। </span></p>
          <h1 class="font-bold text-4xl"><span class="bangla-font">নেক্সট</span> Lesson <span class="bangla-font">এ যান</span></h1>
        </div>
        `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white h-full rounded-lg shadow-sm text-center py-10 px-5 space-y-5">
          <h2 class="font-bold text-4xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
          <p class="text-lg">Meaning /Pronounciation</p>
          <div class="font-semibold text-4xl text-gray-400 bangla-font">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "প্রোনাউনসিং পাওয়া যায়নি"}"</div>
          <div class="flex justify-between items-center">
            <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]"><i class="fa-solid fa-circle-info"></i></button>
            <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        </div>
        `;

    wordContainer.appendChild(card);
  });

  manageSpinner(false);
};



const displayLessons = (lessions) => {
  const levelContainer = document.getElementById("level-container");

  lessions.forEach((element) => {
    const btnDiv = document.createElement("div");
    // btnDiv.classList.add("flex flex-row ");
    btnDiv.innerHTML = `

        <button id="lesson-btn" onclick="loadLevelWords(${element.level_no}, event)" class="btn btn-outline btn-primary clickedbtn">
            <i class="fa-solid fa-book-open"></i>Lesson - ${element.level_no} 
        </button>

        `;

    levelContainer.appendChild(btnDiv);
  });
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
  
  const lessonsButtonDiactive = document.querySelectorAll("#lesson-btn");

  // ফর-ইচ (forEach) লুপ ব্যবহার করে প্রতিটি বাটনে ক্লাস যোগ করা
  lessonsButtonDiactive.forEach((button) => {
    button.classList.add("btn-outline");
  });
  const inputSearch = document.getElementById("input-search").value;
  const input = document.getElementById("input-search");
  const searchValue = input.value.toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      displayLevelWord(filterWords);
    });
  
});
