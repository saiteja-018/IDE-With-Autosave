// Cache textarea elements
const editors = {
  html: document.getElementById('htmlCode'),
  css: document.getElementById('cssCode'),
  js: document.getElementById('jsCode')
};

// Restore saved code from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  Object.keys(editors).forEach(lang => {
    const saved = localStorage.getItem(`scoder_${lang}`);
    if (saved !== null) editors[lang].value = saved;
  });
  runCode(); // auto-run on load
});

// Save code to localStorage whenever the user types
Object.entries(editors).forEach(([lang, textarea]) => {
  textarea.addEventListener('input', () => {
    localStorage.setItem(`scoder_${lang}`, textarea.value);
    runCode(); // live preview
  });
});

// Tab switching with smooth fade-in
function openTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('fade-in');
  });

  document.querySelectorAll('.tab-buttons button').forEach(b => {
    b.classList.remove('active');
  });

  const activeTab = document.getElementById(tabId);
  activeTab.style.display = 'block';
  setTimeout(() => activeTab.classList.add('fade-in'), 10);
  btn.classList.add('active');
}

// Run code in output iframe
function runCode() {
  const html = editors.html.value;
  const css = `<style>${editors.css.value}</style>`;
  const js = `<script>${editors.js.value}<\/script>`;
  const output = document.getElementById('output');
  output.srcdoc = html + css + js;
}

// Clear all code and storage
function clearAll() {
  Object.keys(editors).forEach(lang => {
    editors[lang].value = '';
    localStorage.removeItem(`scoder_${lang}`);
  });
  runCode();
}

// Download project as a single HTML file
function downloadProject() {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Scoder Project</title>
<style>
${editors.css.value}
</style>
</head>
<body>
${editors.html.value}
<script>
${editors.js.value}
<\/script>
</body>
</html>
  `.trim();

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "scoder_project.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function downloadZip() {
  const zip = new JSZip();

  // Get code from editors
  const htmlCode = editors.html.value;
  const cssCode = editors.css.value;
  const jsCode = editors.js.value;

  // Add files to the ZIP
  zip.file("index.html", `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Scoder Project</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
${htmlCode}
<script src="script.js"></script>
</body>
</html>
  `.trim());

  zip.file("style.css", cssCode);
  zip.file("script.js", jsCode);

  // Generate ZIP and trigger download
  zip.generateAsync({ type: "blob" }).then(content => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "scoder_project.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  });
}

