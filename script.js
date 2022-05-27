/*
https://api.dictionaryapi.dev/api/v2/entries/en/hello

*/

let myform = document.querySelector(".form");
let clearBtn = document.querySelector("#clearBtn");
let word = document.querySelector("#word");
let partofSpeech = document.querySelector("#partofSpeech");
let phoneticsText = document.querySelector("#textPh");
let def = document.querySelector("#def");
let synonyms = document.querySelector("#synonyms");
let antonyms = document.querySelector("#antonyms");
let wordList = document.querySelector(".wordList");
let audiodiv = document.getElementById("phonetics");
document.querySelector("#phonetics").style.display = "none";

/**
 * adding submit event to form so that input word can be passed to fetch data
 */
myform.addEventListener("submit", (e) => {
  e.preventDefault();

  let searchText = document.querySelector(".searchText");

  if (
    word.innerText.toString().trim().toLowerCase() ==
    searchText.value.toString().trim().toLowerCase()
  ) {
    alert("Try searching new word");
    return;
  }

  getData(searchText.value);
});

/**
 * adding click event to icon to remove word from searached word list
 */
wordList.addEventListener("click", (e) => {
  if (e.target.nodeName == "I") {
    e.target.parentElement.remove();
  }
});

/**
 * adding click event to clear button to clear all data related to word
 */
clearBtn.addEventListener("click", (e) => {
  clearData();
});

/**
 * adding event listener to volume icon to play it on click
 */
audiodiv.addEventListener("click", (e) => {
  var wordsound = document.getElementById("wordsound");
  wordsound.load();
  wordsound.play();
});

/**
 *
 * @param {String}passing searched word in string format to API URL
 */
function getData(word) {
  const fetchPromise = fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  fetchPromise
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // we get data.title only when there is No Definitions for word
      if (data.title != null) {
        alert(data.message);
        return;
      }
      fillData(data);
    })
    .catch((error) => {
      clearData();
      console.log(error);
      alert("Error while fetching data!. Please try later", error);
    });
}

/**
 *
 * @param {object} passing API response  in object format
 * format to this function to fill required data
 */
function fillData(data) {
  let word = document.querySelector("#word");
  let partofSpeech = document.querySelector("#partofSpeech");

  let def = document.querySelector("#def");
  let synonyms = document.querySelector("#synonyms");
  let antonyms = document.querySelector("#antonyms");
  word.innerText = data[0].word;
  fillPhonetics(data[0].phonetics);
  partofSpeech.innerText = data[0].meanings[0].partOfSpeech;
  def.innerText = data[0].meanings[0].definitions[0].definition;
  synonyms.innerText = isempty(data[0].meanings[0].synonyms[0]);
  antonyms.innerText = isempty(data[0].meanings[0].antonyms[0]);
  addRecentlySearched(data[0].word);
}

/**
 *  clrearing all text on clear button click
 */

function clearData() {
  word.innerText = "";
  phoneticsText.innerText = "";
  partofSpeech.innerText = "";
  def.innerText = "";
  synonyms.innerText = "";
  antonyms.innerText = "";
  document.querySelector("#phonetics").style.display = "none";
}
function isempty(data) {
  if (data != null && data.length != 0) {
    return data;
  }
  return "Not Available";
}

/**
 *
 * @param {array} phonetics data array
 * lopping over each item to check if phonetics text and sound is available or not
 * if present adding data else hiding volume icon and setting text to empty
 */
function fillPhonetics(data) {
  let phoneticsText = document.querySelector("#textPh");
  let audiosrc = document.querySelector("#audiosrc");

  data.forEach((item) => {
    let audioel = document.getElementById("phonetics");
    if (item.text != null && item.audio != null && item.audio.length != 0) {
      phoneticsText.innerText = item.text;
      audiosrc.setAttribute("src", item.audio);

      if (audioel != null || audioel != undefined)
        audioel.style.display = "block";
      return;
    }
    phoneticsText.innerText = "";
    audiosrc.setAttribute("src", "");
    if (audioel != null || audioel != undefined) audioel.style.display = "none";
  });
}

/**
 *
 * @param {string} String of word  to be added to
 * recently searched item
 */
function addRecentlySearched(word) {
  wordList = document.querySelector(".wordList");
  let newWord = document.createElement("li");
  newWord.innerText = word;
  let close_el = document.createElement("i");
  close_el.setAttribute("class", "fa fa-times");
  newWord.append(close_el);
  wordList.prepend(newWord);
}
