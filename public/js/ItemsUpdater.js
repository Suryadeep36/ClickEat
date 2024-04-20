let increment = document.querySelectorAll('#increment')
let decrement = document.querySelectorAll('#decrement')
let quantity = document.querySelectorAll('.input');
let update = document.getElementById('updatebtn');
let selectedItems = [];
function addItems(id){
    let key = 0;
    selectedItems.map((items)=>{
        if(items.id == quantity[id].id){
            items.quantity = quantity[id].innerText;
            key = 1;
        }
        
    })
    if(!key){
        selectedItems.push({
            name: quantity[id].getAttribute('name'),
            price: quantity[id].getAttribute('price'),
            id: quantity[id].id,
            quantity: quantity[id].innerText
        })
    }
}
Array.from(quantity).map((ele, id) => {
    addItems(id);
})
update.addEventListener("click",async (e) =>{
    function checkIfZero(item){
        return item.quantity !== '0';
    }
    let newSelectedItems = selectedItems.filter(checkIfZero);
    e.preventDefault();
    await fetch("http://localhost:3000/customer/updateItem", {
        method: "POST",
        body: JSON.stringify(newSelectedItems),
        credentials: "same-origin",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      selectedItems = [];
})
Array.from(increment).map((ele, id) => {
    ele.addEventListener("click",(e) =>{
        e.preventDefault();
        quantity[id].innerText++;
        addItems(id);
    })
})

Array.from(decrement).map((ele, id) => {
    ele.addEventListener("click",(e) =>{
        e.preventDefault();
        quantity[id].innerText--;
        if(quantity[id].innerText <= '0'){
            quantity[id].innerHTML = '0'
        }
        addItems(id);
    })
})
