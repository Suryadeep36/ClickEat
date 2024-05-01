let increment = document.querySelectorAll('#increment')
let decrement = document.querySelectorAll('#decrement')
let quantity = document.querySelectorAll('.input');
let update = document.getElementById('updatebtn');
let orderbtn = document.getElementById('confirmOrder')
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
function checkIfZero(item){
    return item.quantity !== '0';
}
Array.from(quantity).map((ele, id) => {
    addItems(id);
})
update.addEventListener("click",async (e) =>{
   
    let newSelectedItems = selectedItems.filter(checkIfZero);
    e.preventDefault();
        await fetch("https://clickeat.onrender.com/customer/updateItem", {
            method: "POST",
            body: JSON.stringify(newSelectedItems),
            credentials: "same-origin",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            }
          }).then((response) =>{
            window.location.reload();
          })
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

orderbtn.addEventListener('click',(e) => {
    let newSelectedItems = selectedItems.filter(checkIfZero);
    let totalPrice = 0;
    let quantity = 0; 
    newSelectedItems.map((ele) => {
        quantity += Number(ele.quantity);
        totalPrice += Number(ele.price) * Number(ele.quantity);
    })
    let finalPrice = ((totalPrice + 5 + totalPrice*0.05)*0.95).toFixed(2);
    let finalOrder ={
        selectedItems: newSelectedItems,
        finalPrice: finalPrice,
        totalPrice: totalPrice,
        quantity: quantity
    }
    fetch("https://clickeat.onrender.com/customer/placeOrder", {
        method: 'POST',
        body: JSON.stringify(finalOrder),
        credentials: "same-origin",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
    })
})
