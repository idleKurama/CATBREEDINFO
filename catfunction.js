async function fetchBreeds() {
    try {
        const apiUrl = `https://api.thecatapi.com/v1/breeds`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch breeds");

        const data = await response.json();
        const select = document.getElementById("cat-select");
        
        data.forEach(breed => {
            const option = document.createElement("option");
            option.value = breed.id;
            option.textContent = breed.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading breeds:", error);
    }
}

async function fetchCatInfo() {
    const breedId = document.getElementById("cat-select").value;
    const loading = document.getElementById("loading");
    const infoDiv = document.getElementById("cat-info");
    
    if (!breedId) return;
    
    loading.style.display = "block";
    infoDiv.innerHTML = "";

    try {
        const [catData, imageUrl] = await Promise.all([
            fetchCatData(breedId),
            fetchCatImage(breedId)
        ]);

        loading.style.display = "none";

        infoDiv.innerHTML = `
            <h3>${catData.name}</h3>
            ${imageUrl ? `<img src="${imageUrl}" alt="${catData.name}">` : ''}
            <p><strong>Origin:</strong> ${catData.origin || 'Unknown'}</p>
            <p><strong>Temperament:</strong> ${catData.temperament || 'Unknown'}</p>
            <p><strong>Life Span:</strong> ${catData.life_span || 'Unknown'} years</p>
            <p><strong>Description:</strong> ${catData.description || 'No details available'}</p>
        `;
    } catch (error) {
        loading.style.display = "none";
        infoDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

async function fetchCatData(breedId) {
    try {
        const apiUrl = `https://api.thecatapi.com/v1/breeds/${breedId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch breed data");
        return await response.json();
    } catch (error) {
        return { name: "Unknown", description: "No breed information found." };
    }
}

async function fetchCatImage(breedId) {
    try {
        const apiUrl = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        const imageData = await response.json();
        return imageData.length > 0 ? imageData[0].url : "";
    } catch (error) {
        return "";
    }
}

window.onload = fetchBreeds;