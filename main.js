

var prodRows = document.getElementById("tbodyRows");
var prodRequest = new XMLHttpRequest();
var prodData;
var sortOrder = "D"; 

prodRequest.open("GET", "lab3.0.json");
prodRequest.send();

prodRequest.onload = function () {
    if (prodRequest.status === 200) {
        prodData = JSON.parse(prodRequest.responseText); 
        renderTable(prodData); 
    } else {
        console.error(`Failed to load JSON: ${prodRequest.statusText}`);
    }
};

function renderTable(data) {
    var prodRowData = ""; 
    for (var i = 0; i < data.length; i++) {
        prodRowData += `
            <tr>
                <td>${data[i].prodID}</td>
                <td><img src="${data[i].prodImg}" alt="${data[i].prodName}" width="100"></td>
                <td id="prodName${i}">${data[i].prodName}</td>
                <td>${data[i].prodDesc}</td>
                <td>$${data[i].prodPrice.toFixed(2)}</td>
                <td><input type="number" min="0" id="ProdQty${i}" value="0"></td>
            </tr>
        `;
    }

    prodRows.innerHTML = prodRowData; 
}

function sortID() {
    if (sortOrder === "A") {
        prodData.sort((a, b) => a.prodID - b.prodID); 
        sortOrder = "D";
    } else {
        prodData.sort((a, b) => b.prodID - a.prodID); 
        sortOrder = "A";
    }
    renderTable(prodData);
}

function sortName() {
    if (sortOrder === "A") {
        prodData.sort((a, b) => a.prodName.localeCompare(b.prodName)); 
        sortOrder = "D";
    } else {
        prodData.sort((a, b) => b.prodName.localeCompare(a.prodName)); 
        sortOrder = "A";
    }
    renderTable(prodData);
}

function sortPrice() {
    if (sortOrder === "A") {
        prodData.sort((a, b) => a.prodPrice - b.prodPrice); 
        sortOrder = "D";
    } else {
        prodData.sort((a, b) => b.prodPrice - a.prodPrice); 
        sortOrder = "A";
    }
    renderTable(prodData);
}

function confirmQty() {
    var selectedProducts = ""; // To store the confirmation message
    var localStorageData = []; // To store data for local storage

    for (var i = 0; i < prodData.length; i++) {
        var qty = document.getElementById(`ProdQty${i}`).value; 
        if (qty > 0) {
            
            selectedProducts += `${prodData[i].prodName} (ID: ${prodData[i].prodID}) - Qty: ${qty}\n`;

            
            localStorageData.push({
                prodID: prodData[i].prodID,
                prodName: prodData[i].prodName,
                quantity: qty
            });
        }
    }

    if (selectedProducts) {
        
        if (confirm(`Are you sure you want to order the following:\n${selectedProducts}`)) {
            // Save to local storage
            localStorage.setItem("orderData", JSON.stringify(localStorageData));
            alert("Thank you! Your order has been placed.");
        }
    } else {
        alert("Please select at least one product.");
    }
}


function confirmCancel() {
    if (confirm("Are you sure you want to cancel your selections?")) {
        document.querySelectorAll("input[type='number']").forEach(input => (input.value = "0"));
        localStorage.removeItem("orderData"); // Clear stored order data
    }
}


function viewOrderData() {
    var orderData = localStorage.getItem("orderData");
    if (orderData) {
        alert(`Stored Order Data:\n${orderData}`);
        console.log("Stored Order Data:", JSON.parse(orderData));
    } else {
        alert("No order data found in local storage.");
    }
}

