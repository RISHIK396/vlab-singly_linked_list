document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");

  // This event listener checks if the user has scrolled more than 10px
  // If yes, it adds the 'scrolled' class to the header (for styling changes like shrinking)
  // If not, it removes the 'scrolled' class
  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});

// Object to store references to different topic sections by their IDs
let topicElements = {
  aim: document.getElementById("aim"),
  theory: document.getElementById("theory"),
  procedure: document.getElementById("procedure"),
  practice: document.getElementById("practice"),
  code: document.getElementById("code"),
  result: document.getElementById("result"),
  quiz: document.getElementById("quiz"),
  references: document.getElementById("references"),
  tnt: document.getElementById("tnt"),
};

let currentTopic = "aim"; // Track the currently displayed topic
function switchContent(topic) {
    if (topic === currentTopic) {
        return; // Prevent unnecessary updates if the same topic is clicked again
    }

    topicElements[currentTopic].style.display = 'none'; // Hide the previous topic
    topicElements[topic].style.display = 'block'; // Show the selected topic
    if (topic === "practice") {
        document.body.classList.add("practice-active");
    } else {
        document.body.classList.remove("practice-active");
    }
    currentTopic = topic; // Update the current topic
}

// Generalized function to toggle language-based code blocks
function toggleCode(language) {
  const allCodeBlocks = document.querySelectorAll(".code-block");
  allCodeBlocks.forEach((block) => block.classList.remove("active"));

  const selectedCodeBlock = document.getElementById(language + "Code");
  selectedCodeBlock.classList.add("active");
}

// Clipboard copy function
function copyCode(elementId) {
  const codeBlock = document.getElementById(elementId);
  const code = codeBlock.querySelector("code").innerText;

  // Copy the selected code text to clipboard
  navigator.clipboard
    .writeText(code)
    .then(() => {
      const copyButton = codeBlock.querySelector(".copy-button");
      copyButton.textContent = "Copied!"; // Temporarily change button text
      setTimeout(() => {
        copyButton.textContent = "Copy"; // Reset text after 2 seconds
      }, 2000);
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}

// Event listeners for radio buttons
document
  .getElementById("cppRadio")
  .addEventListener("change", () => toggleCode("cpp"));
document
  .getElementById("pythonRadio")
  .addEventListener("change", () => toggleCode("python"));

// Event listener for copy buttons
document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", function () {
    const language = button.closest(".code-block").id.replace("Code", "");
    copyCode(language + "Code");
  });
});

// Quiz Logic
options = [
    {
        question:
            " Q1) Which of the following is true about the structure of a node in a singly linked list?",
        optionSelect: [
            "A) A node contains data and a pointer to the previous node.",
            "B) A node contains only data.",
            "C) A node contains data and a pointer to the next node.",
            "D) A node contains pointers to both previous and next nodes.",
        ],
        answer: [2],
        explanation: `<h3>In a singly linked list, each node contains two components:</h3>
        <ul>
            <li>Data: the actual value.</li>
            <li>Next: a pointer/reference to the next node in the sequence.</li>
        </ul>
        `
    },

    {
        question: " Q2) What is the time complexity of inserting a node at the beginning of a singly linked list?",
        optionSelect: [
            "A) O(n)",
            "B) O(1)",
            "C) O(log n)",
            "D) O(n log n)",
        ],
        answer: [1],
        explanation: `<h3>Inserting at the beginning involves:</h3>
        <ol>
        <li>Creating a new node.</li>
        <li>Creating a new node.</li>
        <li>Updating the head to this new node.</li><br/>
        <h3>All these are constant-time operations.</h3>        
        </ol>
        `
    },

        {
            question:
                " Q3) In a Singly Linked List, how do you delete the last node?",
            optionSelect: [
                "A) Update the second last node’s next to NULL.",
                "B) Update the last node's data to NULL. ",
                "C) Update the head to NULL. ",
                "D) It is not possible to delete the last node.",
            ],
            answer: [0],
            explanation:`<h3>We delete the last node in a singly linked list by setting the second last node’s next pointer to
    NULL.</h3>`

        },

        {
            question:
                " Q4) What does the next pointer in a node of a Singly Linked List represent?",
            optionSelect: [
                "A) Points to the previous node.",
                "B) Points to the next node.",
                "C) Points to the head.",
                "D) Points to NULL."
            ],
            answer: [1],
            explanation:`The next pointer stores the address of the next node in the sequence, enabling forward traversal.`
        },
        {
            question:
                " Q5) In a Singly Linked List, if the head is NULL, what does it indicate?",
            optionSelect: [
                "A) The list has one node.",
                "B) The list is empty.",
                "C) The list has an infinite loop.",
                "D) The list contains only NULL values",
            ],
            answer: [1],
            explanation:`If the head is NULL, it means there are no nodes in the list — the list is empty.`
        },

        {
            question:
                "Q6)Which application commonly uses singly linked lists for efficient memory management?",
            optionSelect: [
                "A) Image compression",
                "B) Operating system's memory allocation",
                "C) Database indexing",
                "D) Sorting algorithms",
            ],
            answer: [1],
            explanation:`Singly linked lists are used to manage free and allocated memory blocks in dynamic
    memory allocation.`
        },
         {
            question:
                "Q7) Why are singly linked lists suitable for implementing \"undo\" operations in text editors?",
            optionSelect: [
                "A) They support binary search.",
                "B) They allow backward traversal.",
                "C) They efficiently insert and remove actions at the beginning.",
                "D) They store characters in ASCII format.",
            ],
            answer: [2],
            explanation:`Undo operations require quick updates at the head, which singly linked lists support
    in constant time.`
        }, 
];

function start_quiz(){
    const instruct = document.getElementById('instruction_quiz');
    const main = document.getElementById('quiz_main');

    instruct.style.display = 'none';
    main.style.display = "block";
}



let your_ans = [];
let questions = document.querySelector("#question");

let index = 0;
questions.innerText = options[index].question;
optionSelect(index);

let quiz = document.querySelector("#quiz_main");

let result = document.querySelector("#result1");
result.style.display = "none";

// score of quiz
let selectIndex = null;
let score = 0;

function optionSelect(index1) {
    // clearing previous button

    let options1 = document.querySelector("#options");
    options1.innerHTML = "";
    // restore previous answer
    for (let i = 0; i < options[index1].optionSelect.length; i++) {
        let op = document.createElement("button");  


        // adding option in the button and appending into the html
        op.innerText = options[index1].optionSelect[i];
        options1.append(op);

        // retain option
        if (your_ans[index] === i) {
            op.style.backgroundColor = "rgb(21, 148, 252)";
            op.style.color = "white";
            op.style.borderColor = "black";
        }

        op.onclick = function () {
            selectIndex = i;
            your_ans[index] = i;
            op.style.backgroundColor = "white";
            op.style.color = "black";
            op.style.borderColor = "black";
        }

        op.addEventListener("click", () => {
            selectIndex = i;
            optionSelect(index); // re-render with selection
        });
        options1.appendChild(op);
    }
}

// summary of the quiz
function summary(ans) {
    for (let i = 0; i < ans.length; i++) {
        let questionBlock = document.createElement("div");
        questionBlock.style.marginBottom = "20px";
        questionBlock.style.padding = "10px";
        questionBlock.style.border = "3px solid #ccc";
        questionBlock.style.borderRadius = "10px";
        // questionBlock.lineHeight = "1.8";

        let questionTitle = document.createElement("h3");
        questionTitle.innerText = options[i].question;
        questionBlock.appendChild(questionTitle);

        let yourAnswer = document.createElement("h3");
        let actual_ans = options[i].answer[0];
        let explanation = document.createElement("div");
        if (ans[i] === actual_ans) {
            yourAnswer.innerText = `✅${options[i].optionSelect[ans[i]]}`;
            yourAnswer.style.backgroundColor = "lightgreen";
            // explanation
            explanation.innerHTML = `<h2><b>Explanation:<b/></h2>${options[i].explanation}`;
        }
        else {
            yourAnswer.innerText = `❌ ${options[i].optionSelect[ans[i]]}`;
            yourAnswer.style.backgroundColor = "#f98";

        }
        questionBlock.appendChild(yourAnswer);
        if (ans[i] != options[i].answer[0]) {
            let correct_ans = document.createElement("h3");
            correct_ans.innerText = `✅ ${options[i].optionSelect[options[i].answer[0]]}`;
            correct_ans.style.backgroundColor = "lightgreen";
            questionBlock.appendChild(correct_ans);

            // explanation
            explanation.innerHTML = `<h2><b>Explanation:<b/></h2>${options[i].explanation}`;
        }
        explanation.style.fontSize = "15px";
        explanation.style.textAlign = "left";
        explanation.style.marginLeft = "10px";
        questionBlock.appendChild(explanation);

        result.appendChild(questionBlock);

    }
}


// next button functinality
function next_ques() {
    if (index<options.length && options[index].answer[0] === selectIndex) {
        your_ans[index] = selectIndex;  //save only when next is clicked
        score++;
    } 
    
    else if (selectIndex === null) {
        alert("⚠️ Please Select an Option Then Proceed Forward");
        return;
    }

    if (index < options.length - 1) {
        index += 1;
        questions.innerHTML = options[index].question;
        optionSelect(index);
        selectIndex = null;
    }

    else {
        quiz.style.display = "none";
        result.style.display = "flex";
        result.style.textAlign = "left";
        result.style.flexDirection = "column";
        result.style.alignItem = "center";  
        

        let score_finish = document.createElement("h3");

        if (score === options.length) {
            score_finish.innerText = `🏆 Perfect! Your Score: ${score}/${options.length}`;
        } else if (score >= options.length * 0.8) {
            score_finish.innerText = `🎉 Great Job! Your Score: ${score}/${options.length}`;
        } else if (score >= options.length * 0.5) {
            score_finish.innerText = `👍 Not Bad! Your Score: ${score}/${options.length}`;
        } else {
            score_finish.innerText = `😐 Keep Practicing! Your Score: ${score}/${options.length}`;
        }
        score_finish.style.fontSize = "28px";
        score_finish.style.border = "2px solid grey";
        score_finish.style.borderRadius = "5px";
        score_finish.style.margin="20px";
        score_finish.style.textAlign = "center";
        result.append(score_finish);
        result.append(score_finish);

        // for (let i = 0; i < your_ans.length; i++) {
        //     console.log(your_ans[i]);
        // }
        summary(your_ans);
        document.getElementById("retake").style.display = "inline";
    }
}

let back = document.querySelector("#back");

function back_ques() {
    if (index > 0) {
        index--;
        questions.innerHTML = options[index].question;
        optionSelect(index);
    }
}

function retakeQuiz() {
    index = 0;
    score = 0;
    your_ans = [];
    selectIndex = null;

    document.querySelector("#result1").style.display = "none";
    document.querySelector("#retake").style.display = "none";
    document.querySelector("#quiz_main").style.display = "block";

    document.querySelector("#result1").innerHTML = ""; // clear previous summary
    questions.innerText = options[index].question;
    optionSelect(index);

}


  // practice script js

  class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    sleep = ms => new Promise(res => setTimeout(res, ms));

    getNodeAt(index) {
        let curr = this.head, i = 1;
        while (curr && i < index) curr = curr.next, i++;
        return curr;
    }

    async traverseToIndex(index) {
        let curr = this.head, i = 1;
        const [arrows, nodes, head, headarrow] = [
            document.querySelectorAll(".arrow"),
            document.querySelectorAll(".node"),
            document.querySelector(".head-pointer"),
            document.querySelector(".head-arrow")
        ];

        head.classList.add("blink-found");
        await this.sleep(1000);
        head.classList.remove("blink-found");

        headarrow.classList.add("pointer-expands");
        await this.sleep(1000);
        headarrow.classList.remove("pointer-expands");

        while (curr && i < index) {
            if (nodes[i - 1]) nodes[i - 1].classList.add("traverse-node");
            await this.sleep(400);
            if (arrows[i - 1]) arrows[i - 1].classList.add("traverse-arrow");
            await this.sleep(400);
            if (nodes[i - 1]) {
                nodes[i - 1].classList.add("blink-node");
                await this.sleep(300);
                nodes[i - 1].classList.remove("blink-node", "traverse-node");
            }
            if (arrows[i - 1]) arrows[i - 1].classList.remove("traverse-arrow");
            curr = curr.next;
            i++;
        }
    }

    async insertAt(value, index) {
        document.getElementById("searchResult").textContent = "";
        if (index < 1 || index > this.size + 1) return alert("Valid index: 1 to " + (this.size + 1));
        await this.traverseToIndex(index);

        const newNode = new Node(value);
        if (index === 1){
            newNode.next = this.head;
            this.head = newNode;
        }
        else {
            const prev = this.getNodeAt(index - 1);
            newNode.next = prev.next;
            prev.next = newNode;
        }
        this.size++;
        this.display();

        const nodes = document.querySelectorAll(".node");
        if (nodes[index - 1]) {
            nodes[index - 1].style.opacity = "0";
            nodes[index - 1].style.transform = "scale(0.7)";
            setTimeout(() => {
                nodes[index - 1].style.transition = "opacity 0.6s, transform 0.6s";
                nodes[index - 1].style.opacity = "1";
                nodes[index - 1].style.transform = "scale(1)";
            }, 100);
        }
    }

    async deleteAt(index) {
        document.getElementById("searchResult").textContent = "";
        if (index < 1 || index > this.size) return alert("Valid index: 1 to " + this.size);
        await this.traverseToIndex(index);

        const nodes = document.querySelectorAll(".node");
        if (nodes[index - 1]) {
            nodes[index - 1].style.transition = "opacity 0.5s";
            nodes[index - 1].style.opacity = "0";
            await this.sleep(500);
        }

        if (index === 1) this.head = this.head.next;
        else {
            const prev = this.getNodeAt(index - 1);
            prev.next = prev.next.next;
        }

        this.size--;
        this.display();
    }

async deleteByValue(value) {
    document.getElementById("searchResult").textContent = "";
    if (!this.head) return alert("List is empty.");

    const nodes = document.querySelectorAll(".node"),
          arrows = document.querySelectorAll(".arrow"),
          nodeVals = document.querySelectorAll(".node-value"),
          head = document.querySelector(".head-pointer"),
          headArrow = document.querySelector(".head-arrow"),
          nullSign = document.querySelector(".null-sign");

    nodes.forEach(n => n.classList.remove("traverse-node", "blink-node", "blink-found"));
    arrows.forEach(a => a.classList.remove("traverse-arrow"));
    nodeVals.forEach(v => {
        v.classList.remove("blink-node", "blink-found");
        if (v.dataset.blinkInterval) clearInterval(v.dataset.blinkInterval);
    });

    let curr = this.head;
    let prev = null;
    let index = 1;
    let found = false;

    head.classList.add("blink-found");
    await this.sleep(1000);
    head.classList.remove("blink-found");
    headArrow.classList.add("pointer-expands");
    await this.sleep(1000);
    headArrow.classList.remove("pointer-expands");

    while (curr) {
        const node = nodes[index - 1];
        const arrow = arrows[index - 1];
        const valDiv = node?.querySelector(".node-value");

        if (curr.value === value) {
            found = true;

            if (valDiv) valDiv.classList.add("blink-found");
            await this.sleep(500);

            if (node) {
                node.style.transition = "opacity 0.5s";
                node.style.opacity = "0";
                await this.sleep(500);
            }

            if (prev === null) this.head = curr.next;
            else prev.next = curr.next;

            this.size--;
            this.display();

            document.getElementById("searchResult").textContent = `Deleted node with value: ${value}`;
            return;
        }

        if (valDiv) {
            valDiv.classList.add("blink-node");
            await this.sleep(300);
            valDiv.classList.remove("blink-node");
        }

        if (node) {
            node.classList.add("traverse-node");
            await this.sleep(400);
        }

        if (arrow) {
            arrow.classList.add("traverse-arrow");
            await this.sleep(400);
        }

        prev = curr;
        curr = curr.next;
        index++;
    }

    if (!found) {
        if (nullSign) {
            nullSign.classList.add("blink-null");
            await this.sleep(1000);
            nullSign.classList.remove("blink-null");
        }
        document.getElementById("searchResult").textContent = "Not Found";
    }
}




handleDeleteInput() {
        const valueInput = document.getElementById("deleteValue").value.trim();
        const indexInput = document.getElementById("deleteindex").value.trim();

        if (valueInput) {
            document.getElementById("deleteindex").disabled = true;
            if (!isNaN(valueInput)) {
                linkedList.deleteByValue(+valueInput);
            } else {
                alert("Enter a valid number to delete by value.");
            }
        } else if (indexInput) {
            document.getElementById("deleteValue").disabled = true;
            if (!isNaN(indexInput)) {
                linkedList.deleteAt(+indexInput);
            } else {
                alert("Enter a valid number to delete by index.");
            }
        } else {
            alert("Please enter a value or an index to delete.");
        }
        resetDeleteFields();
    }

    async search(value) {
        const nodes = document.querySelectorAll(".node"),
              arrows = document.querySelectorAll(".arrow"),
              nodeVals = document.querySelectorAll(".node-value"),
              head = document.querySelector(".head-pointer"),
              headArrow = document.querySelector(".head-arrow"),
              nullSign = document.querySelector(".null-sign");
        
        let curr = this.head, index = 1, found = [];

        nodes.forEach(n => n.classList.remove("traverse-node", "blink-node", "blink-found"));
        arrows.forEach(a => a.classList.remove("traverse-arrow"));
        nodeVals.forEach(v => {
            v.classList.remove("blink-node", "blink-found");
            if (v.dataset.blinkInterval) clearInterval(v.dataset.blinkInterval);
        });

        head.classList.add("blink-found");
        await this.sleep(1000);
        head.classList.remove("blink-found");
        headArrow.classList.add("pointer-expands");
        await this.sleep(1000);
        headArrow.classList.remove("pointer-expands");

        while (curr) {
            const valDiv = nodes[index - 1]?.querySelector(".node-value");
            if (valDiv) {
                valDiv.classList.add("blink-node");
                await this.sleep(300);
                valDiv.classList.remove("blink-node");
                if (curr.value === value) {
                    found.push(index);
                    valDiv.classList.add("blink-found");
                    document.getElementById("searchResult").textContent = `Result: ${found.join(", ")}`;
                }
            }
            if (nodes[index - 1]) {
                nodes[index - 1].classList.add("traverse-node");
                await this.sleep(400);
            }
            if (arrows[index - 1]) {
                arrows[index - 1].classList.add("traverse-arrow");
                await this.sleep(400);
            }
            curr = curr.next;
            index++;
        }

        if (nullSign) {
            nullSign.classList.add("blink-null");
            await this.sleep(1000);
            nullSign.classList.remove("blink-null");
        }

        await this.sleep(1000);
        nodeVals.forEach(v => v.classList.remove("blink-found"));
        if (!found.length) document.getElementById("searchResult").textContent = "Not Found";
    }

    async createFromValues(values) {
        this.head = null;
        this.size = 0;
        let prev = null;
        values.forEach((val, i) => {
            const newNode = new Node(val);
            if (i === 0) this.head = newNode;
            else prev.next = newNode;
            prev = newNode;
            this.size++;
        });
        this.display();
    }

    display() {
        const listContainer = document.getElementById("linkedList");
        listContainer.innerHTML = "";
        
        if (!this.head) {
            listContainer.textContent = "Empty list";
            alert("List is now Empty, Create a New list to Continue")
            return;
        }
        
        let curr = this.head, index = 1;

        while (curr) {
            const wrapper = document.createElement("div");
            wrapper.className = "node-wrapper";

            const node = document.createElement("div");
            node.className = "node";
            node.innerHTML = `
                ${index === 1 ? `<div class="head-pointer">HEAD</div><div class="head-arrow">↓</div>` : ""}
                <div class="node-value">${curr.value}</div>
                <div class="node-pointer"><span class="arrow">→</span></div>
            `;

            const indexDiv = document.createElement("div");
            indexDiv.className = "node-index";
            indexDiv.textContent = `Position: ${index}`;

            wrapper.appendChild(node);
            wrapper.appendChild(indexDiv);
            listContainer.appendChild(wrapper);
            curr = curr.next;
            index++;
        }

        const pointers = document.querySelectorAll(".node-pointer");
        if (pointers.length) pointers[pointers.length - 1].innerHTML = `<span class="null-sign">∅</span>`;
    }

    highlightNode(index) {
        const node = document.querySelectorAll(".node")[index - 1];
        if (node) {
            node.classList.add("blink-node");
            setTimeout(() => node.classList.remove("blink-node"), 500);
        }
    }

}

const linkedList = new LinkedList();
let isOperationRunning = false;

async function runSimulation() {
    if (isOperationRunning) return alert("Please wait, operation in progress.");
    isOperationRunning = true;

    try {
        const val = id => document.getElementById(id).value.trim();
        const get = id => document.getElementById(id);
        const [insVis, delVis, srcVis] = [
            get("insertDeleteFields").style.display !== "none",
            get("deleteField").style.display !== "none",
            get("searchField").style.display !== "none"
        ];

        if (insVis) {
            if (val("nodeValue") && val("nodeIndex") && !isNaN(val("nodeValue")) && !isNaN(val("nodeIndex")))
                await linkedList.insertAt(+val("nodeValue"), +val("nodeIndex"));
            else alert("Enter valid value and index.");
        } else if (srcVis) {
            if (val("searchValue") && !isNaN(val("searchValue")))
                await linkedList.search(+val("searchValue"));
            else alert("Enter valid value.");
        } else if (delVis) {
            linkedList.handleDeleteInput();
        }
    } finally {
        isOperationRunning = false;
    }
}

function createList() {
    const input = document.getElementById("nodeValues").value.trim();
    if (!input) return alert("Enter values to create a list.");
    const values = input.split(",").map(x => +x.trim()).filter(x => !isNaN(x));
    if (!values.length) return alert("Invalid input. Use comma-separated numbers.");
    if (values.length > 8) return alert("Max 8 values allowed.");
    linkedList.createFromValues(values);
    document.getElementById("operations").style.display = "block";
    document.getElementById("nodeValues").disabled = true;
    document.getElementById("first_button").disabled = true;

}

function resetInputs() {
    ["nodeValue", "nodeIndex", "deleteindex", "deleteValue", "searchValue"].forEach(id => document.getElementById(id).value = "");
}

function toggleFields(show) {
    resetInputs();
    document.getElementById('insertDeleteFields').style.display = show === "insert" ? 'block' : 'none';
    document.getElementById('deleteField').style.display = show === "delete" ? 'block' : 'none';
    document.getElementById('searchField').style.display = show === "search" ? 'block' : 'none';
    document.getElementById('runSimulationButton').style.display = 'block';
    document.getElementById('searchResult').textContent = "";
}

function showInsertFields() { toggleFields("insert"); }
function showDeleteFields() { toggleFields("delete"); }
function showSearchField() { toggleFields("search"); }





document.getElementById("deleteValue").addEventListener("input", function () {
    const value = this.value.trim();
    const indexField = document.getElementById("deleteindex");
    indexField.disabled = value.length > 0;
    indexField.title = "Either Enter Index or Value not Both"

});

document.getElementById("deleteindex").addEventListener("input", function () {
    const index = this.value.trim();
    const valueField = document.getElementById("deleteValue");
    valueField.disabled = index.length > 0;
    valueField.title = "Either Enter Index or Value not Both"

});

function resetDeleteFields() {
    const valueField = document.getElementById("deleteValue");
    const indexField = document.getElementById("deleteindex");

    valueField.disabled = false;
    indexField.disabled = false;

    valueField.value = "";
    indexField.value = "";
}


document.getElementById("deleteTabButton").addEventListener("click", () => {
    resetDeleteFields();
});

function reset() {
  document.getElementById("nodeValues").value = "";
  document.getElementById("insertDeleteFields").style.display = "none";
  document.getElementById("deleteField").style.display = "none";
  document.getElementById("searchField").style.display = "none";
  document.getElementById("nodeValue").value = "";
  document.getElementById("nodeIndex").value = "";
  document.getElementById("deleteValue").value = "";
  document.getElementById("deleteindex").value = "";
  document.getElementById("searchValue").value = "";
  document.getElementById("searchResult").innerText = "";
  document.getElementById("runSimulationButton").style.display = "none";
  document.getElementById("linkedList").innerHTML = "";
  document.getElementById("operations").style.display = "none";
  document.getElementById("nodeValues").disabled = false;
  document.getElementById("first_button").disabled = false;
}

console.log("Running Successfully")