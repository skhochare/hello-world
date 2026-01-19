// init -> fn -> build whole chessboard
window.addEventListener("load", function() {
    let table = document.querySelector("#table");

    table.addEventListener("mouseleave", function() {
            for(let i = 0; i < boxesArr.length; i++) {
                boxesArr[i].classList.remove("yellow");
            }
        })

    // Chess grid creation
    for (let ri = 0; ri < 8; ri++) {
        let tr = document.createElement("tr");
        let white = ri % 2 == 0 ? true : false;
        // Cell Loop
        for (let ci = 0; ci < 8; ci++) {
            let cell = this.document.createElement("td");
            cell.setAttribute("class", `box ${white === true ? "white" : "black"}`);
            // cell.innerText = `${ri}-${ci}`;
            cell.setAttribute("data-index", `${ri}-${ci}`);
            tr.appendChild(cell);
            white = !white;
        }
        table.appendChild(tr);
    }

    let boxesArr = document.querySelectorAll(".box");
    // How to identify -> hover -> cell
    table.addEventListener("mouseover", function(e) {
        let dataIndex = e.target.dataset.index;
        let [cRi, cCi] = dataIndex.split("-");
        // Remove Yellow Color from every box
        for (let i = 0; i < boxesArr.length; i++) {
            boxesArr[i].classList.remove("yellow");
        }

        /** Marking the path for the bishop! */
        let storage = {};
        storage[dataIndex] = true;
        findTopLeft(cRi, cCi, storage);
        findTopRight(cRi, cCi, storage);
        findBottomLeft(cRi, cCi, storage);
        findBottomRight(cRi, cCi, storage);

        // Color whereever -> dataIndex
        for (let i = 0; i < boxesArr.length; i++) {
            let cDataIndex = boxesArr[i].dataset.index;
            if (storage[cDataIndex] == true) {
                boxesArr[i].classList.add("yellow");
            }
        }


        function findTopLeft(cRi, cCi, storage) {
            cRi--;
            cCi--;
            while(cRi >= 0 && cCi >= 0) {
                let dataIndex = `${cRi}-${cCi}`;
                storage[dataIndex] = true;
                cRi--;
                cCi--;
            }
        };

        function findTopRight(cRi, cCi, storage) {
            cRi--;
            cCi++;
            while(cRi >= 0 && cCi <= 7) {
                let dataIndex = `${cRi}-${cCi}`;
                storage[dataIndex] = true;
                cRi--;
                cCi++;
            }
        };

        function findBottomLeft(cRi, cCi, storage) {
            cRi++;
            cCi--;
            while(cRi <= 7 && cCi >= 0) {
                let dataIndex = `${cRi}-${cCi}`;
                storage[dataIndex] = true;
                cRi++;
                cCi--;
            }
        };

        function findBottomRight(cRi, cCi, storage) {
            cRi++;
            cCi++;
            while(cRi <= 7 && cCi <= 7) {
                let dataIndex = `${cRi}-${cCi}`;
                storage[dataIndex] = true;
                cRi++;
                cCi++;
            }
        };
    })
})