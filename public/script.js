let books = [];
let searchTerm = "";

const fetchBooks = async () => {
  if (!searchTerm) {
    return;
  }

  response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyDNcGyk57dWBtic9VgXWNRzWOrf90PX7gU`
  ).then((res) => res.json());
  books = response.items || [];
};

const results = document.getElementById("results");
const input = document.querySelector("#search");

const showBooks = async () => {
  results.innerHTML = "";
  await fetchBooks();
  // getting the data
  const searchedBooks = books.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(searchTerm)
  );
  const ul = document.createElement("ul");
  searchedBooks.forEach((element) => {
    const img = document.createElement("img");
    const li = document.createElement("li");
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    const div = document.createElement("div");
    if (
      element.volumeInfo.imageLinks &&
      element.volumeInfo.imageLinks.thumbnail
    ) {
      img.setAttribute("src", element.volumeInfo.imageLinks.thumbnail);
    } else {
      img.setAttribute(
        "src",
        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
      );
    }
    h2.innerText = element.volumeInfo.title;
    p.innerText = element.volumeInfo.description || "No description";
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
