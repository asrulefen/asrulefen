async function listModels() {
  const apiKey = "AIzaSyBdyaDHSyeiVtW0DC69TOPwDK58IF8HomU";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  if (data.models) {
    console.log(data.models.map(m => m.name).join("\n"));
  } else {
    console.log(data);
  }
}
listModels();
