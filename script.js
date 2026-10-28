const COLUMNS = ["To Study", "Studying", "Revising", "Done"];
const WIP_LIMIT = { "Studying": 3, "Revising": 2 };

let topics = JSON.parse(localStorage.getItem("examTopics")) || [];

function save() {
    localStorage.setItem("examTopics", JSON.stringify(topics));
}

function count(column) {
    return topics.filter(function (t) { return t.column === column; }).length;
}

function move(id, step) {
    const topic = topics.find(function (t) { return t.id === id; });
    const newIndex = COLUMNS.indexOf(topic.column) + step;
    if (newIndex < 0 || newIndex >= COLUMNS.length) {
        return;
    }
    const target = COLUMNS[newIndex];
    if (WIP_LIMIT[target] && count(target) >= WIP_LIMIT[target]) {
        document.getElementById("message").textContent =
            "Limit reached: " + target + " can hold only " + WIP_LIMIT[target] + " topics.";
        return;
    }
    document.getElementById("message").textContent = "";
    topic.column = target;
    save();
    show();
}

function remove(id) {
    topics = topics.filter(function (t) { return t.id !== id; });
    save();
    show();
}

function makeButton(label, action) {
    const b = document.createElement("button");
    b.textContent = label;
    b.onclick = action;
    return b;
}

function show() {
    COLUMNS.forEach(function (name) {
        const col = document.getElementById(name);
        col.innerHTML = "";
        const heading = document.createElement("h3");
        const limit = WIP_LIMIT[name] ? " / " + WIP_LIMIT[name] : "";
        heading.textContent = name + " (" + count(name) + limit + ")";
        col.appendChild(heading);

        topics.filter(function (t) { return t.column === name; })
            .forEach(function (t) {
                const card = document.createElement("div");
                card.className = "card";
                const title = document.createElement("strong");
                title.textContent = t.topic;
                const sub = document.createElement("p");
                sub.textContent = t.subject;
                card.append(title, sub,
                    makeButton("< Back", function () { move(t.id, -1); }),
                    makeButton("Next >", function () { move(t.id, 1); }),
                    makeButton("Delete", function () { remove(t.id); }));
                col.appendChild(card);
            });
    });
    const done = count("Done");
    document.getElementById("summary").textContent =
        "Completed " + done + " of " + topics.length + " topics";
}

document.getElementById("topicForm").addEventListener("submit", function (e) {
    e.preventDefault();
    topics.push({
        id: Date.now() + Math.random(),
        topic: document.getElementById("topicName").value.trim(),
        subject: document.getElementById("subjectName").value.trim(),
        column: "To Study"
    });
    save();
    show();
    e.target.reset();
});

show();