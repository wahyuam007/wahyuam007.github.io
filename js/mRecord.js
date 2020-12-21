if (!localStorage.getItem('accessToken')) {
    window.location.href = "login.html";
    console.log("pindah ke index.html")
}

document.getElementById('username-nav').innerHTML = localStorage.getItem('username')

let btnAdd = document.getElementById("btnTambah");
let btnUpdate = document.getElementById("btnUpdate");
btnAdd.addEventListener("click", () => { addKaryawan() });
btnUpdate.addEventListener("click", () => { updateKaryawan() });

let addKaryawan = () => {
    let karyawan = {
        "name" : document.getElementById("orangeForm-name").value,
        "position" : document.getElementById("orangeForm-position").value
    } 
    console.log(JSON.stringify(karyawan));

    fetch('http://localhost:8000/api/v1/puskesmas/mRecord', {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'POST',
        body : JSON.stringify(karyawan)
    })
    .then(res => res.text())
    .then(teks => {
        console.log(teks);
        location.reload();
    })
    .catch(err => console.log(err));
}

let deleteKaryawan = (nik) => {
    btnYes = document.getElementById("btnYes");
    btnYes.addEventListener("click", () => {
        fetch(`http://localhost:8000/api/v1/puskesmas/mRecord/${nik}`, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(teks => {
            console.log(teks);
            location.reload();
        })
        .catch(err => console.log(err))
    })
}

let viewAllData = (data) => {
    var i = 1;
    var table = document.getElementsByTagName('tbody')[0];
    for (let index = 0; index < data.length; index++) {
        var row = document.createElement("tr");
        
        var cellNomor = document.createElement("th");
        var cell2= document.createElement("td");
        var cell3 = document.createElement("td");
        var cell4 = document.createElement("td");
        var cell5 = document.createElement("td");
        var cell6 = document.createElement("td");
        var action = document.createElement("td");

        var btnDelete = document.createElement("button");
        var btnUpdate = document.createElement("button");

        btnDelete.classList.add("btn");
        btnUpdate.classList.add("btn");
        btnDelete.setAttribute('data-toggle', 'modal');
        btnDelete.setAttribute('data-target', '#modalConfirmDelete');
        btnUpdate.setAttribute('data-toggle', 'modal');
        btnUpdate.setAttribute('data-target', '#modalRegisterForm');
        btnDelete.classList.add("btn-danger");
        btnUpdate.classList.add("btn-primary");

        btnDelete.innerHTML = "delete";
        btnUpdate.innerHTML = "update";

        btnDelete.addEventListener('click', () => {
            deleteKaryawan(data[index].medicalRecordId);
        });

        btnUpdate.addEventListener('click', () => {
            getOneData(data[index]);
        });
        
        cellNomor.appendChild(document.createTextNode(i++));
        cell2.appendChild(document.createTextNode(data[index].medicalRecordId));
        cell3.appendChild(document.createTextNode(data[index].physical));
        cell4.appendChild(document.createTextNode(data[index].complaint));
        cell5.appendChild(document.createTextNode(data[index].diagnosis));
        cell6.appendChild(document.createTextNode(data[index].therapy));
        action.appendChild(btnUpdate);
        action.appendChild(btnDelete);

        row.appendChild(cellNomor);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);
        row.appendChild(cell6);
        row.appendChild(action);

        table.appendChild(row);
    }
}

let updateKaryawan = () => {
    let dataKaryawan = {
        "name" : document.getElementById("orangeForm-name").value,
        "position" : document.getElementById("orangeForm-position").value
    }

    fetch(`https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/mRecord/${document.getElementById("orangeForm-nik").value}`, {
        headers : {
            "content-type" : "application/json; charset=UTF-8"
        },
        method : 'PUT',
        body : JSON.stringify(dataKaryawan)
    })
    .then(res => res.text())
    .then(teks => {
        console.log(teks);
        location.reload();
    })
    .catch(err => console.log(err));
}

let getOneData = (data) => {
    document.getElementById("orangeForm-name").value = data.name;
    document.getElementById("orangeForm-position").value = data.position;
    document.getElementById("orangeForm-nik").value = data.nik;
    btnAdd.classList.add("d-none");
    btnUpdate.classList.remove("d-none");
}

let getAllData = () => {
    fetch('https://guarded-crag-15965.herokuapp.com/api/v1/puskesmas/mRecord/all')
    .then((res) => res.json())
    .then(data => {
        if(data.response.length <= 0 ){
            document.getElementById("infoEmptyData").classList.remove("d-none");
        }
        else {
            viewAllData(data.response);
        }
    })
    .catch(err => console.log(err));
}

getAllData();