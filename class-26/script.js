const addBtn = document.querySelector("#add-btn");
const removeBtn = document.querySelector("#remove-btn");
const closeBtn = document.querySelector("#close-btn");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const taskDetail = document.querySelector(".textArea-cont");
const taskcont = document.querySelector(".task-container");
const submitBtn = document.querySelector("#submit-btn");
const priorityTaskColors = document.querySelectorAll(".priority-color");
const toolboxColors = document.querySelectorAll(".color");

// Local Variables
let ogTickets = [];
let DEFAULT_COLOR = "pink";
let activePriorityColor = DEFAULT_COLOR;
let acrtiveToolBoxColor = "all";
const colors = ["pink", "lightblue", "green", "black"];

function refreshMainContainer() {
    mainCont.innerHTML = "";
    ogTickets.forEach(({ id, color, task }) => {
        createTicket({
            ticketColor: color,
            ticketId: id,
            ticketTask: task
        });
    });
}

function createTicket({ ticketTask, ticketColor, ticketId }) {
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `<div class="ticket-color">${ticketColor}</div>
            <div class="ticket-id">${ticketId}</div>
            <div class="ticket-area">${ticketTask}</div>
            <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`;

    mainCont.append(ticketCont);
}

function handleSubmit() {
    if (taskDetail.value && activePriorityColor) {
        ogTickets.push({
            task: taskDetail.value,
            color: activePriorityColor,
            id: "12345"
        });

        closeModal();
        clearSelectedPriorityColor();
        taskDetail.value = "";
        activePriorityColor = DEFAULT_COLOR;

        refreshMainContainer();
    }
}

function clearSelectedPriorityColor() {
    priorityTaskColors.forEach((elem) => {
        if (elem.classList.contains("active")) {
            elem.classList.remove("active")
        }
    })
}

function onPriorityColorClickInModal(event) {
    clearSelectedPriorityColor();
    const elem = event.target;
    activePriorityColor = elem.classList[1];
    elem.classList.add("active");
}

// Open/Close Modal
function openModal() {
    modalCont.style.display = "flex";
}
function closeModal() {
    modalCont.style.display = "none";
}

addBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
priorityTaskColors.forEach(function(elem) {
    elem.addEventListener("click", onPriorityColorClickInModal);
});
submitBtn.addEventListener("click", handleSubmit);