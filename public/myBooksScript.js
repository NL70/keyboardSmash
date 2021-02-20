let myBooks = [];
const results = document.getElementById("results");

const fetchMyBooks = async () => {
  const response = await fetch(`http://localhost:3002/books`).then((res) =>
    res.json()
  );

  myBooks = response.data;
  //   console.log(myBooks);
};

const showMyBooks = async () => {
  await fetchMyBooks();
  console.log(myBooks);
  myBooks.forEach((element) => {
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    h2.innerText = element.title;
    p.innerText = element.author;
    results.appendChild(h2);
    results.appendChild(p);
  });
};

showMyBooks();
