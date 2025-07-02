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
const questions = [
   {
        question: "What is the advantage of using singly linked list over an array ? ",
        choices: ["Faster Random Access Time", "Dynamic memory Allocation Without Predefined Size", "Lower Memory Usage", "Easier to Implement"],
        correctAnswers: [1]
    },
    {
        question: " Q2) In a Singly Linked List, how do you delete the last node?",
        choices: ["Update the second last node’s next to NULL.", " Update the last node's data to NULL.", "Update the head to NULL.", " It is not possible to delete the last node."],
        correctAnswers: [0]
    },
    {
        question: " Q3) What does the next pointer in a node of a Singly Linked List represent?",
        choices: ["Points to the previous node.", "Points to the next node.", " Points to the head.", "Points to NULL."],
        correctAnswers: [1]
    },
    {
        question: " Q4) Which operation is faster in a Singly Linked List compared to an array?",
        choices: [" Searching for an element.", "Accessing the middle element.", " Inserting an element at the beginning.", "Inserting an element at the end."],
        correctAnswers: [2]
    },
    {
        question: " Q5) In a Singly Linked List, if the head is NULL, what does it indicate?",
        choices: ["The list has one node.", "The list is empty.", "The list has an infinite loop.", "The list contains only NULL values"],
        correctAnswers: [1]
    },

    {
        question: "Q6) Is it possible to traverse a singly linked list backward ? If not, why ?",
        choices:["Yes, by using a previous pointer","No, because the pointer points to the next node's address","Yes, by reversing the list first","No, because singly linked lists are circular"],
        correctAnswers:[1]
    },
  ];
  
  let currentQuestionIndex = 0;
  let score = 0;
  let userAnswers = []; // Array to store user answers as an array of selected indexes
  
  const questionElement = document.getElementById("question");
  const choicesContainer = document.getElementById("choices");
  const saveButton = document.getElementById("save-btn");
  const nextButton = document.getElementById("next-btn");
  const retakeButton = document.getElementById("retake-btn");
  const quizReport = document.getElementById("quiz-report");
  
  function showQuestion() {
      let currentQuestion = questions[currentQuestionIndex];
      questionElement.textContent = currentQuestion.question;
      choicesContainer.innerHTML = "";
  
      currentQuestion.choices.forEach((choice, index) => {
          const button = document.createElement("button");
          button.textContent = choice;
          button.classList.add("choice");
          button.addEventListener("click", () => toggleSelection(index)); // Listen for user selection
          choicesContainer.appendChild(button);
      });
  
      saveButton.style.display = "block"; // Show the save button
      nextButton.style.display = "none"; // Hide the next button initially
      retakeButton.style.display = "none"; // Hide the retake button
      saveButton.disabled = true; // Disable save button initially
  }
  
  function toggleSelection(selectedIndex) {
      // Toggle selection for multiple answers
      if (!userAnswers[currentQuestionIndex]) {
          userAnswers[currentQuestionIndex] = [];
      }
  
      const answerIndex = userAnswers[currentQuestionIndex].indexOf(selectedIndex);
  
      if (answerIndex > -1) {
          // Remove the selection if already selected
          userAnswers[currentQuestionIndex].splice(answerIndex, 1);
      } else {
          // Add the selection
          userAnswers[currentQuestionIndex].push(selectedIndex);
      }
  
      // Highlight selected buttons
      const choiceButtons = document.querySelectorAll(".choice");
      choiceButtons.forEach((button, index) => {
          if (userAnswers[currentQuestionIndex].includes(index)) {
              button.style.backgroundColor = "#4285F4"; // Selected answer color
              button.style.color = "white";
          } else {
              button.style.backgroundColor = "#f1f1f1"; // Reset other button colors
              button.style.color = "black";
          }
      });
  
      // Enable the Save button if there is at least one selection
      saveButton.disabled = userAnswers[currentQuestionIndex].length === 0;
  }
  
  function saveAnswer() {
      // Show the Next button once the answer is saved
      nextButton.style.display = "block";
      saveButton.style.display = "none"; // Hide the Save button
      saveButton.disabled = true; // Disable the Save button after saving the answer
  }
  
  function checkAnswer() {
      const correctAnswers = questions[currentQuestionIndex].correctAnswers;
      const userAnswer = userAnswers[currentQuestionIndex];
  
      // Check if the user's selected answers match the correct ones
      if (arraysEqual(correctAnswers, userAnswer)) {
          score++; // Increment score if the answer is correct
      }
  
      nextButton.style.display = "none"; // Hide the Next button
      if (currentQuestionIndex < questions.length - 1) {
          // Move to the next question
          currentQuestionIndex++;
          showQuestion();
      } else {
          showResults();
      }
  }
  
  function arraysEqual(a, b) {
      return a.length === b.length && a.every((val, index) => val === b[index]);
  }
  
  function showResults() {
      questionElement.textContent = `Quiz Completed! Your Score: ${score} / ${questions.length}`;
      choicesContainer.innerHTML = "";
      saveButton.style.display = "none";
      nextButton.style.display = "none";
      retakeButton.style.display = "block";
  
      // Display quiz report
      displayQuizReport();
  }
  
  function displayQuizReport() {
      quizReport.style.display = "block"; // Show the report section
      quizReport.innerHTML = ""; // Clear previous report
      
      const reporttitle = document.createElement("h3");
      reporttitle.textContent = "Quiz Report"; // Set the title
      quizReport.appendChild(reporttitle);

      questions.forEach((question, index) => {
          const userAnswer = userAnswers[index] || [];
          const correctAnswer = question.correctAnswers;
          const questionDiv = document.createElement("div");
          questionDiv.classList.add("quiz-report-question");
  
          const questionText = document.createElement("p");
          questionText.textContent = `${question.question}`;
          questionDiv.appendChild(questionText);
  
          const choicesList = document.createElement("ul");
          question.choices.forEach((choice, i) => {
              const choiceItem = document.createElement("li");
              const isSelected = userAnswer.includes(i);
              const isCorrect = correctAnswer.includes(i);
  
              // Highlight correct and incorrect answers
              if (isSelected) {
                  choiceItem.textContent = choice;
                  choiceItem.style.backgroundColor = isCorrect ? "green" : "red";
                  choiceItem.style.color = "white";
              }
  
              choicesList.appendChild(choiceItem);
          });
  
          questionDiv.appendChild(choicesList);
          quizReport.appendChild(questionDiv);
      });
  }
  
  retakeButton.addEventListener("click", () => {
      currentQuestionIndex = 0;
      score = 0;
      userAnswers = [];
      quizReport.style.display = "none"; // Hide the report on retake
      showQuestion();
  });
  
  saveButton.addEventListener("click", saveAnswer);
  nextButton.addEventListener("click", checkAnswer);
  
  showQuestion();

  // practise script js

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

    // Reset previous styles
    nodes.forEach(n => n.classList.remove("traverse-node", "blink-node", "blink-found"));
    arrows.forEach(a => a.classList.remove("traverse-arrow"));
    nodeVals.forEach(v => {
        v.classList.remove("blink-node", "blink-found");
        if (v.dataset.blinkInterval) clearInterval(v.dataset.blinkInterval);
    });

    let curr = this.head;
    let prev = null;
    let index = 1;

    // Animate head
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

    if (nullSign) {
        nullSign.classList.add("blink-null");
        await this.sleep(1000);
        nullSign.classList.remove("blink-null");
    }

    alert("Value not found in the list.");
}

handleDeleteInput() {
        const valueInput = document.getElementById("deleteValue").value.trim();
        const indexInput = document.getElementById("deleteindex").value.trim();

        if (valueInput && indexInput) {
            alert("Please enter either a value OR an index — not both.");
            return;
        }

        if (valueInput) {
            if (!isNaN(valueInput)) {
                linkedList.deleteByValue(+valueInput);
            } else {
                alert("Enter a valid number to delete by value.");
            }
        } else if (indexInput) {
            if (!isNaN(indexInput)) {
                linkedList.deleteAt(+indexInput);
            } else {
                alert("Enter a valid number to delete by index.");
            }
        } else {
            alert("Please enter a value or an index to delete.");
        }
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
                    document.getElementById("searchResult").textContent = `Indices: ${found.join(", ")}`;
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
            indexDiv.textContent = `Index: ${index}`;

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

function resetInputs() {
    ["nodeValues", "nodeValue", "nodeIndex", "deleteindex", "searchValue"].forEach(id => document.getElementById(id).value = "");
}

function toggleFields(show) {
    resetInputs();
    document.getElementById('insertDeleteFields').style.display = show === "insert" ? 'block' : 'none';
    document.getElementById('deleteField').style.display = show === "delete" ? 'block' : 'none';
    document.getElementById('searchField').style.display = show === "search" ? 'block' : 'none';
    document.getElementById('runSimulationButton').style.display = 'block';
}

function showInsertFields() { toggleFields("insert"); }
function showDeleteFields() { toggleFields("delete"); }
function showSearchField() { toggleFields("search"); }

function createList() {
    const input = document.getElementById("nodeValues").value.trim();
    if (!input) return alert("Enter values to create a list.");
    const values = input.split(",").map(x => +x.trim()).filter(x => !isNaN(x));
    if (!values.length) return alert("Invalid input. Use comma-separated numbers.");
    if (values.length > 8) return alert("Max 8 values allowed.");
    linkedList.createFromValues(values);
    document.getElementById("operations").style.display = "block";
}
