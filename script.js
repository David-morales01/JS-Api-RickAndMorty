var inicio = 1,
    final = inicio + 11,
    image = [],
    characters = [],
    personaje, origin,
    allIdParameter;
const loading = document.querySelector(".loading"),
    container = document.querySelector(".container"),
    containerBody = document.querySelector(".container__body"),
    containerEL = document.querySelector(".search"),
    search = document.querySelector(".inputSearch"),
    resultados = document.querySelector(".resultados");

async function fetchImage() {
    allIdParameter = inicio;
    for (var i = inicio + 1; i <= final; i++) {
        allIdParameter = allIdParameter + "," + i;
    }

    const response = await fetch('https://rickandmortyapi.com/api/character/' + allIdParameter);
    image = await response.json();
    return image;

}
fetchImage().then(image => {

    image.forEach(function(image) {
        createImg(image)
    });

});

async function fetchdetails(idCharacter) {

    const response3 = await fetch('https://rickandmortyapi.com/api/character/' + idCharacter);
    details = await response3.json();
    return details;

}




async function fetchData(characterName) {

    const response2 = await fetch('https://rickandmortyapi.com/api/character/?name=' + characterName);
    characters = await response2.json();
    return characters;

}



function createImg(image) {

    const imageContainerEl = document.createElement("div");

    imageContainerEl.classList.add("image-container");

    const imageEl = document.createElement("img");

    imageEl.src = image.image;
    imageEl.dataset.id = image.id;
    imageContainerEl.dataset.idContainer = image.id;
    imageContainerEl.appendChild(imageEl);
    containerBody.appendChild(imageContainerEl);

    container.classList.remove("noShow")
    loading.classList.add("noShow")


}

function createResults(character) {

    const resultsContainerEl = document.createElement("div");

    resultsContainerEl.classList.add("result-container");

    const imageResult = document.createElement("img");
    const descriptionResult = document.createElement("p");
    imageResult.src = character.image;
    origin = character.origin.name;
    if (origin != "unknown") {
        origin = " Origin : " + origin;
    } else {
        origin = "";
    }
    descriptionResult.textContent = character.name + " " + origin;

    resultsContainerEl.appendChild(imageResult);
    resultsContainerEl.appendChild(descriptionResult);

    resultados.appendChild(resultsContainerEl);
}





search.addEventListener("input", function(e) {
    resultados.innerHTML = '';
    characters = [];
    personaje = e.target.value;

    if (personaje != null && personaje.length > 0) {
        const existActive = document.querySelector(".image-container.active");
        const existTooltip = document.querySelector(".tooltip");
        if (existActive) {
            existActive.classList.remove("active")
        }
        if (existTooltip) {

            existActive.removeChild(existTooltip);
        }
        container.classList.add("shadow");
        containerEL.classList.add("writing");
        resultados.classList.remove("noShow")
        fetchData(personaje).then(characters => {

            if (characters.error) {

                resultados.innerHTML = '';
                const messageError = document.createElement("span");
                messageError.textContent = "No existe el personaje " + personaje;
                messageError.classList.add("messageError")
                resultados.appendChild(messageError);

            } else {

                var { results } = characters;
                results.forEach(function(characters) {
                    createResults(characters)
                });
            }

        });
    } else {

        resultados.classList.add("noShow")
        containerEL.classList.remove("writing");

        container.classList.remove("shadow");
    }
})

containerBody.addEventListener("mouseover", function(e) {


    const imagen = e.target;
    if (imagen.tagName == "IMG") {
        search.value = "";

        container.classList.add("shadow");

        containerEL.classList.remove("writing");
        resultados.classList.add("noShow")
        var indice = imagen.dataset.id;

        const existActive = document.querySelector(".image-container.active");
        const existTooltip = document.querySelector(".tooltip");
        if (existActive) {
            existActive.classList.remove("active")
        }
        if (existTooltip) {

            existActive.removeChild(existTooltip);
        }
        fetchdetails(indice).then(details => {
            var { name, status, species, type, gender, origin } = details;

            const elementDivActive = document.querySelector("[data-id-container=" + CSS.escape(indice) + "]");
            elementDivActive.classList.add("active");
            elementDivActive.addEventListener("mouseleave", function(e) {
                const existActive = document.querySelector(".image-container.active");
                const existTooltip = document.querySelector(".tooltip");
                if (existActive) {
                    existActive.classList.remove("active")
                }
                if (existTooltip) {

                    existActive.removeChild(existTooltip);

                    container.classList.remove("shadow");
                }

            });
            const tooltip = document.createElement("div");

            tooltip.classList.add("tooltip")

            const tooltipHeader = document.createElement("div");
            tooltipHeader.classList.add("tooltipHeader")
            tooltipHeader.textContent = "Name : " + name;

            const tooltipBody = document.createElement("div");
            tooltipBody.classList.add("tooltipBody")
            const paragraph1 = document.createElement("p");
            const paragraph2 = document.createElement("p");
            const paragraph3 = document.createElement("p");
            const paragraph4 = document.createElement("p");
            const paragraph5 = document.createElement("p");

            paragraph1.textContent = "Status : " + status;
            paragraph2.textContent = "Species : " + species;;
            paragraph3.textContent = "Type : " + type;
            paragraph4.textContent = "Gender : " + gender;
            paragraph5.textContent = "Origin : " + origin.name;


            tooltipBody.appendChild(paragraph1);
            tooltipBody.appendChild(paragraph2);
            tooltipBody.appendChild(paragraph3);
            tooltipBody.appendChild(paragraph4);
            tooltipBody.appendChild(paragraph5);

            tooltip.appendChild(tooltipHeader);
            tooltip.appendChild(tooltipBody);
            elementDivActive.appendChild(tooltip);


            var position = elementDivActive.offsetLeft;
            if (position > 600) {

                tooltip.classList.add("tooltipright")
            }
        });
    }

});