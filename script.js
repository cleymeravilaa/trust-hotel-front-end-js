const API_BASE_URL = 'https://improved-goldfish-4jqp7xj7666gfqpxw-8080.app.github.dev/api/v1'

async function getHotels(){
    try {
        const response = await fetch(`${API_BASE_URL}/hotels`);
        if(!response.ok){
            throw new Error('Erorr al obtener los hoteles');
        }

        return await response.json();
    } catch (error){
        console.error(error);
        return [];
    }
}

function loadHotels(hotels){
    const container = document.getElementById('main-content');
    container.innerHTML = '';

    hotels.forEach(hotel => {
        const div = document.createElement('div');
        div.className = 'hotel';
        div.innerHTML = `
            <h2>Nombre del hotel: ${hotel.name}</h2>
            <p>Dirección: ${hotel.address}</p>
            <p>Numero de estrella (categoria): ${hotel.numberStars}</p>
            <p>Numero de telefono: ${hotel.phone}</p>
        `;
        container.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    let hotels = await getHotels();
    console.log(hotels);
    loadHotels(hotels);
});

