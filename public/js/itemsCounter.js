let decrement = document.getElementsByClassName("decrement");
let increment = document.getElementsByClassName("increment");
let currentCount = document.getElementsByClassName("input");
let btn = document.getElementById("orderbtn");
let continuebtn = document.getElementById("continue");
let selectedItems = [];

Array.from(decrement).map((but, index) => {
  but.addEventListener("click", () => {
    if (currentCount[index].innerText > 0) {
      currentCount[index].innerText--;
    }
    selectedItems.map((ele) => {
      if (ele.id == currentCount[index].id) {
        if (ele.quantity > 0) {
          ele.quantity--;
        } else {
          ele.quantity = 0;
        }
      }
    });
  });
});

Array.from(increment).map((but, index) => {
  but.addEventListener("click", () => {
    currentCount[index].innerText++;
    let key = 0;
    selectedItems.map((ele) => {
      if (ele.id == currentCount[index].id) {
        ele.quantity++;
        key = 1;
      }
    });
    if (!key) {
      selectedItems.push({
        name: currentCount[index].getAttribute("name"),
        id: currentCount[index].id,
        quantity: 1,
        price: currentCount[index].getAttribute("price"),
      });
    }
  });
});
btn.addEventListener("click", async () => {
  document.querySelector(".box1").classList.add("show");
  Array.from(document.getElementsByClassName("input")).map((ele) => {
    ele.innerText = "0";
  });
  selectedItems.map((ele, i) => {
    if (ele.quantity == 0) {
      selectedItems.splice(i, 1);
    }
  });
  await fetch("http://localhost:3000/customer/cart", {
    method: "POST",
    body: JSON.stringify(selectedItems),
    credentials: "same-origin",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  selectedItems = [];
});

continuebtn.addEventListener("click", () => {
  document.querySelector(".box1").classList.remove("show");
});
