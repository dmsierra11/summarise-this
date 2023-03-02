function formatTranscript(input) {
  // Split the input string by new lines
  const lines = input.split("\n");
  // Create an empty string to store the output
  let output = "";
  // Loop through each line
  for (let i = 0; i < lines.length; i++) {
    // Check if the line starts with a timestamp
    if (
      /^\d{2}:\d{2}:\d{2}\.\d{3}\s-->\s\d{2}:\d{2}:\d{2}\.\d{3}$/.test(lines[i])
    ) {
      output = "";
      // Add a new line character before the timestamp, and a colon after it
      output += lines[i].trim() + ":";
    } else if (lines[i].trim() !== "") {
      // Add the line without any modification
      output += lines[i];
    }
    // Add a new line character after each line (except the last one)
    if (i < lines.length - 1) {
      output += "\n";
    }
  }
  // Return the modified string
  return output;
}

async function summarizeTranscript(input) {
  const url = "https://api.openai.com/v1/completions";
  const prompt = `Please summarize the following text:\n\n${input}\n\nSummary:`;
  const requestBody = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  const summary = data.choices[0].text.trim();
  return summary;
}

async function handleClick() {
  const inputText = document.getElementById("input-text").value;
  const formattedText = formatTranscript(inputText);
  const summaryText = await summarizeTranscript(formattedText);
  document.getElementById("output-text").textContent = summaryText;
}

document.querySelector("button").addEventListener("click", handleClick);
