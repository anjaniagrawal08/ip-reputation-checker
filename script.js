async function checkIP() {
  const ip = document.getElementById('ipInput').value;
  const resultDiv = document.getElementById('result');

  try {
    const response = await fetch('http://localhost:3000/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ip })
    });

    // If backend sends an error status (like 400 or 500)
    if (!response.ok) {
      const errorData = await response.json();
      resultDiv.innerHTML = `<p style="color:red;">Error: ${errorData.error || 'Unknown error'}</p>`;
      return;
    }

    // If success
    const data = await response.json();
    resultDiv.innerHTML = `
      <p><strong>IP:</strong> ${data.ipAddress}</p>
      <p><strong>Abuse Confidence Score:</strong> ${data.abuseConfidenceScore}</p>
      <p><strong>Country:</strong> ${data.countryCode}</p>
      <p><strong>ISP:</strong> ${data.isp}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">Something went wrong: ${err.message || JSON.stringify(err)}</p>`;
  }
}
