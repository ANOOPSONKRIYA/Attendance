document.getElementById("submitBtn").addEventListener("click", () => {
  const form = document.getElementById("attendanceForm");
  const checked = [];

  form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
    checked.push(cb.value);
  });

  // Sort by roll number
  checked.sort((a, b) => {
    const rollA = parseInt(a.split(" - ")[0]);
    const rollB = parseInt(b.split(" - ")[0]);
    return rollA - rollB;
  });

  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  });

  const attendanceText =
    checked.length > 0
      ? `*${dateStr} Attendance*\n\n` + checked.join("\n")
      : "⚠️ No one marked present.";

  document.getElementById("present-list").textContent =
    checked.length > 0 ? "✅ Attendance list generated below:" : "⚠️ No one marked present.";

  const outputBox = document.getElementById("attendanceOutput");
  outputBox.style.display = "block";
  outputBox.value = attendanceText;

  document.getElementById("copyBtn").style.display = checked.length > 0 ? "inline-block" : "none";
});

// Copy attendance text
document.getElementById("copyBtn").addEventListener("click", () => {
  const outputBox = document.getElementById("attendanceOutput");
  outputBox.select();
  document.execCommand("copy");
  alert("📋 Attendance copied to clipboard!");
});

// 🌙 Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const btn = document.getElementById("themeToggle");
  if (document.body.classList.contains("light")) {
    btn.textContent = "🌙 Dark Mode";
  } else {
    btn.textContent = "☀️ Light Mode";
  }
});
