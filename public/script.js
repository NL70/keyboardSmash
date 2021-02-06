let books;
let searchTerm = "";

const fetchBooks = async () => {
  books = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyDNcGyk57dWBtic9VgXWNRzWOrf90PX7gU`
  ).then((res) => res.json());
};

const results = document.getElementById("results");
const input = document.querySelector("#search");

const showBooks = async () => {
  results.innerHTML = "";
  await fetchBooks();
  console.log(books.items);
  // getting the data

  const searchedBooks = books.items.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(searchTerm)
  );
  const ul = document.createElement("ul");
  searchedBooks.forEach((element) => {
    const img = document.createElement("img");
    const li = document.createElement("li");
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    const div = document.createElement("div");
    img.setAttribute("src", element.volumeInfo.imageLinks.thumbnail);
    h2.innerText = element.volumeInfo.title;
    p.innerText = element.volumeInfo.description;
    li.appendChild(img);
    div.appendChild(h2);
    div.appendChild(p);
    li.appendChild(div);
    ul.appendChild(li);
  });
  results.appendChild(ul);
};
showBooks();

input.addEventListener("input", updateValue);
function updateValue(e) {
  searchTerm = e.target.value.toLowerCase();
  showBooks();
}
