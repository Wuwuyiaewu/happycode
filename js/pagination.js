const list_items = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
  "Item 9",
  "Item 10",
  "Item 11",
  "Item 12",
  "Item 13",
  "Item 14",
  "Item 15",
  "Item 16",
  "Item 17",
  "Item 18",
  "Item 19",
  "Item 20",
  "Item 21",
  "Item 22",
];

const list_element = document.getElementById("list");
const pagination_element = document.getElementById("pagination");

let current_page = 1;
let rows = 5;

DisplayList(list_items, list_element, rows, current_page);
SetupPagination(list_items, pagination_element, rows);

function DisplayList(item, wrapper, rows_per_page, page) {
  wrapper.innerHTML = "";
  page--;
  let start = rows_per_page * page;
  console.log(
    "start " + start,
    "rows_per_page " + rows_per_page,
    "page " + page
  );
  let end = start + rows_per_page;
  console.log("end " + end);
  let paginationItems = item.slice(start, end);
  console.log("paginationItems " + paginationItems);

  for (let i = 0; i < paginationItems.length; i++) {
    let item = paginationItems[i];
    console.log("item " + item);
    let item_element = document.createElement("div");
    item_element.classList.add("item");
    item_element.innerText = item;
    wrapper.appendChild(item_element);
  }
}

function SetupPagination(items, wrapper, rows_per_page) {
  wrapper.innerHTML = "";
  let page_count = Math.ceil(items.length / rows_per_page);
  console.log(
    `page_count ${page_count}, items.length ${items.length}, rows_per_page ${rows_per_page}`
  );
  for (let i = 1; i < page_count + 1; i++) {
    let btn = PaginationButton(i, items);
    wrapper.appendChild(btn);
  }
}

function PaginationButton(page, items) {
  let button = document.createElement("button");
  button.innerText = page;
  if (current_page == page) button.classList.add("active");
  button.addEventListener("click", function () {
    current_page = page;
    DisplayList(items, list_element, rows, current_page);
    let current_btn = document.querySelector(".pagenumbers button.active");
    current_btn.classList.remove("active");
    button.classList.add("active");
  });

  return button;
}
