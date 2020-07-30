// getting DOM elements
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');


const apiURL = 'https://api.lyrics.ovh';


//Search by song or artist

/*
function searchSongs(term){
     fetch(`${apiURL}/suggest/${term}`)
     .then(res => res.json())
     .then(data => console.log(data));
}
*/

//craeting same function using async/await
async function searchSongs(term){
    //calling await before fetch 
    //because fetch is asynchronous so we are waiting the response from fetch call
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();

    showData(data);
}


//Get prev and next songs
/*
CORS
Its for allowing cross platform access to a server and every server or api has diff cors policies
One thing we can do is use a proxy by using Heroku’s proxy called corsanywhere
*/
async function getMoreSongs(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();

    showData(data);
} 


//get lyrics for song
async function getLyrics(artist, songTitle){
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    
    if(res.status === 404){
        alert("LYRICS NOT FOUND");
    }
    else{
            const data = await res.json();

            //g gloabal -> to check for all
            //its a regular expression which checks for \r or \n and replaces it with break tag
            const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

            result.innerHTML = `<h2><strong>${artist}</strong> -${songTitle} </h2>
                <span>${lyrics}</span>`;

            
            more.innerHTML = ''; //clearing next and prev buttons
    }

}


//show songs in DOM
function showData(data){

    //One way to display
    /*
    let output = '';

    // data-artist="${song.artist.name}" is adding custom attributes
    //one data is the data var we craeted and 2nd is an array (named data) inside the result we got
    data.data.forEach(song => {
        output +=  `
            <li>
                <span><strong>${song.artist.name}</strong> -${song.title}</span>
                <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}"> Get Lyrics</button>
            </li>
        `;
    });

    result.innerHTML= `
        <ul class="songs">
            ${output} 
        </ul>
    `;
    */

    //2nd way to display

    //result is the id of a div tag
    result.innerHTML = `
        <ul class="songs">
        ${data.data.map(song => `
            <li>
            <span><strong>${song.artist.name}</strong> -${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}"> Get Lyrics</button>
            </li>`)
            .join('')
        } 
        </ul>
    `;


    if(data.prev || data.next){
        //data.prev and data.next are urls
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ``}
            ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ``}
        `;
    }
    else{
        more.innerHTML = '';
    }
}



//Event listenrs

form.addEventListener('submit', e => {
    e.preventDefault();

    const searchedTerm = search.value.trim();

    if(!searchedTerm)
    {
        alert('Please enter an artist name or a song name');
    }
    else{
    searchSongs(searchedTerm);
    }
});


//get lyrics button click
result.addEventListener('click', e=>{
    //this will click on complete line
    const clickedElement = e.target;

    if(clickedElement.tagName === 'BUTTON'){
        //console.log("1234");
        //to get name of the artist and song we added as custom attribute
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');

        getLyrics(artist,songTitle);
    }
});