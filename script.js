// ===== DOM refs =====
const form = document.getElementById("attendanceForm");
const counterEl = document.getElementById("liveCounter");
const searchBox = document.getElementById("searchBox");
const submitBtn = document.getElementById("submitBtn");
const copyBtn = document.getElementById("copyBtn");
const presentListEl = document.getElementById("present-list");
const outputBox = document.getElementById("attendanceOutput");
const themeToggle = document.getElementById("themeToggle");

let students = []; // will hold {roll, name}
let mounted = false;

// ===== Embedded fallback data (used if fetch fails) =====
const embeddedStudents = [
  { "roll": 1,  "name": "Aaditya Dadhich" },
  { "roll": 2,  "name": "Abhishek Kumar Meena" },
  { "roll": 3,  "name": "Abhishek Sharma" },
  { "roll": 4,  "name": "Aditya Singh" },
  { "roll": 5,  "name": "Ajay Singh Shekhawat" },
  { "roll": 6,  "name": "Akshay Vyas" },
  { "roll": 7,  "name": "Ankit Ojha" },
  { "roll": 8,  "name": "Anoop Sonkriya" },
  { "roll": 9,  "name": "Arjun Singh" },
  { "roll": 10, "name": "Atul Kumar Dwivedi" },
  { "roll": 11, "name": "Avantika Sharma" },
  { "roll": 12, "name": "Ayush Swami" },
  { "roll": 13, "name": "Bhavya Gupta" },
  { "roll": 14, "name": "Bhoomika Sri Srimal" },
  { "roll": 15, "name": "Bhumi Kochar" },
  { "roll": 16, "name": "Deepesh Kumar" },
  { "roll": 17, "name": "Devansh Jaiswal" },
  { "roll": 18, "name": "Devansh Joshi" },
  { "roll": 19, "name": "Dhanesh Kumar" },
  { "roll": 20, "name": "Dhruv Pancholi" },
  { "roll": 21, "name": "Divya" },
  { "roll": 22, "name": "Drona Gujjar" },
  { "roll": 23, "name": "Ekansh Tiwari" },
  { "roll": 24, "name": "Faizan Parihar" },
  { "roll": 26, "name": "Gaurav Sharma" },
  { "roll": 27, "name": "Gautam Kaswan" },
  { "roll": 28, "name": "Gourav Panchariya" },
  { "roll": 29, "name": "Hariom Singh Rathore" },
  { "roll": 30, "name": "Hemant Nagar" },
  { "roll": 31, "name": "Himanshu" },
  { "roll": 32, "name": "Himanshu Mudgal" },
  { "roll": 33, "name": "Hritika Vyas" },
  { "roll": 34, "name": "Jetha Ram" },
  { "roll": 35, "name": "Jitendra Saini" },
  { "roll": 36, "name": "Karan" },
  { "roll": 37, "name": "Karan Suthar" },
  { "roll": 38, "name": "Kartic" },
  { "roll": 39, "name": "Keshav Chimpa" },
  { "roll": 40, "name": "Keshav Shukla" },
  { "roll": 41, "name": "Keshav Vyas" },
  { "roll": 42, "name": "Keshav Vyas" },
  { "roll": 43, "name": "Koshal Agarwal" },
  { "roll": 44, "name": "Krishna Jangid" },
  { "roll": 45, "name": "Kritika Bhadauria" },
  { "roll": 46, "name": "Kumbha Ram Kumawat" },
  { "roll": 47, "name": "Mahendra Singh Bhati" },
  { "roll": 48, "name": "Manas Harsh" },
  { "roll": 49, "name": "Manish Kumar" },
  { "roll": 50, "name": "Milind Jangid" },
  { "roll": 51, "name": "Milind Mathur" },
  { "roll": 52, "name": "Mohammed Akil" },
  { "roll": 53, "name": "Mohammed Aman" },
  { "roll": 54, "name": "Mohammed Shahid" },
  { "roll": 55, "name": "Mohit" },
  { "roll": 56, "name": "Mohit Saini" },
  { "roll": 57, "name": "Moolchand Rewar" },
  { "roll": 58, "name": "Ms Aaysha Siddh" },
  { "roll": 59, "name": "Ms Dimple Shekhawat" },
  { "roll": 60, "name": "Ms Himanshu Kanwar" },
  { "roll": 61, "name": "Ms Jashanpreet Kaur" },
  { "roll": 62, "name": "Ms Kalpana Sidh" },
  { "roll": 63, "name": "Ms Kanishka Atal" },
  { "roll": 64, "name": "Ms Khushi Kushwah" }
];

// ===== Utilities =====
const pad2 = (n) => String(n).padStart(2, "0");
const rollFromValue = (val) => parseInt(String(val).split(" - ")[0]);

// ===== Theme from localStorage (unchanged) =====
try {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "🌙 Dark Mode";
  }
} catch {}

// ===== Try fetch students.json, otherwise use embeddedStudents =====
async function loadStudents() {
  try {
    const res = await fetch("students.json");
    if (!res.ok) throw new Error("students.json not found or returned " + res.status);
    const data = await res.json();
    students = data.map(s => ({ roll: Number(s.roll), name: String(s.name) }));
    students.sort((a, b) => a.roll - b.roll);
    console.log("Loaded students.json:", students.length, "students");
  } catch (err) {
    console.warn("Could not load students.json — using embedded data. Error:", err);
    students = embeddedStudents.map(s => ({ roll: Number(s.roll), name: String(s.name) }))
                              .sort((a,b) => a.roll - b.roll);
  }
  renderStudents(students);
  restoreCheckedFromStorage();
  updateCounter();
}

// ===== Render list =====
function renderStudents(list) {
  form.innerHTML = "";
  list.forEach((s, idx) => {
    const label = document.createElement("label");
    label.className = "student absent";
    label.style.animationDelay = `${Math.min(idx * 0.01, 0.2)}s`;
    label.dataset.roll = s.roll;
    label.dataset.name = s.name.toLowerCase();

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "student";
    input.value = `${pad2(s.roll)} - ${s.name}`;

    const span = document.createElement("span");
    span.className = "label-text";
    span.textContent = `${pad2(s.roll)} - ${s.name}`;

    input.addEventListener("change", () => {
      label.classList.toggle("present", input.checked);
      label.classList.toggle("absent", !input.checked);
      updateCounter();
      saveCheckedToStorage();
    });

    label.appendChild(input);
    label.appendChild(span);
    form.appendChild(label);
  });
  mounted = true;
}

// ===== Live counter =====
function updateCounter() {
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const total = checkboxes.length;
  const present = form.querySelectorAll('input[type="checkbox"]:checked').length;
  const absent = total - present;
  counterEl.textContent = `✔ Present: ${present} | ✖ Absent: ${absent}`;
}

// ===== Search / filter =====
searchBox.addEventListener("input", (e) => {
  const term = e.target.value.trim().toLowerCase();
  form.querySelectorAll(".student").forEach((row) => {
    const roll = String(row.dataset.roll);
    const name = row.dataset.name;
    const match = roll.includes(term) || name.includes(term);
    row.style.display = match ? "flex" : "none";
  });
});

// ===== Submit =====
submitBtn.addEventListener("click", () => {
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const present = [];
  const absent = [];
  checkboxes.forEach((cb) => (cb.checked ? present : absent).push(cb.value));
  const sortByRoll = (a, b) => rollFromValue(a) - rollFromValue(b);
  present.sort(sortByRoll);
  absent.sort(sortByRoll);

  const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  let text = `📅 ${dateStr} Attendance\n\n`;
  text += "✅ Present :-\n" + (present.length ? present.join("\n") : "None") + "\n\n";
  text += "❌ Absent :-\n" + (absent.length ? absent.join("\n") : "None") + "\n\n";
  text += `Total Present: ${present.length}\nTotal Absent: ${absent.length}`;

  presentListEl.textContent = "📋 Attendance generated below:";
  outputBox.style.display = "block";
  outputBox.value = text;
  copyBtn.style.display = "inline-block";
});

// ===== Copy =====
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(outputBox.value);
    alert("📋 Attendance copied to clipboard!");
  } catch {
    outputBox.select();
    document.execCommand("copy");
    alert("📋 Attendance copied to clipboard (fallback)!");
  }
});

// ===== Theme toggle =====
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  themeToggle.textContent = light ? "🌙 Dark Mode" : "☀️ Light Mode";
  try { localStorage.setItem("theme", light ? "light" : "dark"); } catch {}
});

// ===== Persistence (store checked) =====
function saveCheckedToStorage() {
  if (!mounted) return;
  try {
    const checkedVals = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.value);
    localStorage.setItem("attendance-checked", JSON.stringify(checkedVals));
  } catch {}
}
function restoreCheckedFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem("attendance-checked") || "[]");
    if (!saved.length) return;
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = saved.includes(cb.value);
      const label = cb.closest(".student");
      if (label) {
        label.classList.toggle("present", cb.checked);
        label.classList.toggle("absent", !cb.checked);
      }
    });
    updateCounter();
  } catch {}
}

// ===== Start =====
loadStudents();

