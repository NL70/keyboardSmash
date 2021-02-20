let books = [];
let searchTerm = "";

const fetchBooks = async () => {
  if (!searchTerm) {
    return;
  }

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyDNcGyk57dWBtic9VgXWNRzWOrf90PX7gU`
  ).then((res) => res.json());
  books = response.items || [];
};
const addBook = async (author, title) => {
  const data = {
    author: author,
    title: title,
  };
  const response = await fetch(`https://booksapinllc.herokuapp.com/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
  console.log(response);
  //   console.log(myBooks);
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
    const titleanddescriptioncontainer = document.createElement("div");
    const overallcontainer = document.createElement("div");
    const button = document.createElement("button");
    overallcontainer.classList.add("overallcontainer");
    button.onclick = async () => {
      await addBook(
        element.volumeInfo.authors
          ? element.volumeInfo.authors.join(", ")
          : "Unknown Author",
        element.volumeInfo.title
      );
    };
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
    button.innerText = "Add Book";
    p.innerText = element.volumeInfo.description || "No description";
    overallcontainer.appendChild(img);
    titleanddescriptioncontainer.appendChild(h2);
    titleanddescriptioncontainer.appendChild(p);
    overallcontainer.appendChild(titleanddescriptioncontainer);
    li.appendChild(overallcontainer);
    ul.appendChild(li);
    li.appendChild(button);
  });
  results.appendChild(ul);
};
showBooks();

input.addEventListener("input", updateValue);
function updateValue(e) {
  searchTerm = e.target.value.toLowerCase();
  showBooks();
}
