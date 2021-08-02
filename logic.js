//Class that I use to create movie objects
//Movies have a title, year, genre, duration, country of production, language, director, and rating
class Movie {
    constructor(title, year, genre, duration, country, language, director, rating){
        this.title = title
        this.year = year
        this.genre = genre
        this.duration = duration
        this.country = country
        this.language = language
        this.director = director
        this.rating = rating
    }
}

//================================ Important =============================
//This code loads the dataset variable into a variable called data. This is a 2D array of movies
var data = dataset

//Array that will store movie objects
let moviesList = []

//In this for loop, I create new Movie objects and push them onto the moviesList array
for(let i = 0; i < data.length; i++)
{
    let currMovie = new Movie(data[i].title, data[i].year, data[i].genre, data[i].duration, 
        data[i].country, data[i].language, data[i].director, data[i].rating)
    moviesList.push(currMovie)
}

//Custom function I made that sorts moviesList array in alphanumeric order based on the movie titles
moviesList.sort(function(first, second){
    if(first.title.toString().toLowerCase() < second.title.toString().toLowerCase()) return -1;
    if(first.title.toString().toLowerCase() > second.title.toString().toLowerCase()) return 1;
    return 0;
})

//This removes first 1180 elements in the moviesList array because they have weird characters
//That do not allow proper alphanumeric comparisons of movie names
for(let i = 0; i < 1180; i++)
    moviesList.shift()


//======================================= Jump Search Implementation ======================
//Jump search implementation:
function MovieJumpSearch(array, movieToFind){
    //This is the amount that this method will jump to iterate through the array
    let jump = Math.sqrt(array.length) 

    curr = 0 //Current position that we will use to find movie

    while (true)
    {
        //If the current's next movie's title is alphabetically greater than the movie to find then break
        if (array[Math.floor(Math.min(jump, array.length) - 1)].title > movieToFind)
            break
            
        //Increment
        curr += Math.sqrt(array.length)
        jump += Math.sqrt(array.length)

        //If curr is passed the array lenght then return -1 becuase movie is not in dataset
        if (curr >= array.length) 
            return -1
    }

    //While curr < length and current movie's title is less than movietoFind do a linear search
    while (Math.floor(curr) <= array.length && array[Math.floor(curr)].title < movieToFind)
    {
        curr++; //Incremennt

        //If current movie's title equals movieToFind then return current index
        if(array[Math.floor(curr)].title.toString() === movieToFind)
            return Math.floor(curr)
    }
    return -1 //If movie does not exist
}

function MovieTernarySearch(leftIndex, rightIndex, array, movieToFind)
{
    //If right passed in minus left is greater than 0 then right is to right of left
    if (rightIndex - leftIndex > 0)
    {
        //Calculate two differt positions in between array
        firstMid = leftIndex + Math.floor((rightIndex - leftIndex) / 3)
        secondMid = firstMid + Math.floor((rightIndex - leftIndex) / 3)

        //If the current film matches the film to find, return the current index
        if(array[firstMid].title == movieToFind)
            return firstMid
        else if (array[secondMid].title == movieToFind)
            return secondMid
        else if (movieToFind < array[firstMid].title) //Recursiveky call function for three different cases
            return MovieTernarySearch(leftIndex, firstMid, array, movieToFind)
        else if (movieToFind > array[secondMid].title)
            return MovieTernarySearch(secondMid + 1, rightIndex, array, movieToFind)
        else 
            return MovieTernarySearch(firstMid, secondMid, array, movieToFind)
    }

    return -1 //If first condition is not met, return -1
}

//==================== HTML query functions and rendering functions ============================
const buttonForSearch = document.querySelector('.searchButton')
let ternTime = 0
let jumpTime = 0
let movieIndex = -1
buttonForSearch.addEventListener("click", function(event){

    const movieToSearch = document.querySelector(".searchBarBar").value //Find search form

    let t0Tern = performance.now() //Gets current time
    MovieTernarySearch(0, moviesList.length, moviesList, movieToSearch)
    let t1Tern = performance.now() 
    ternTime = (t1Tern - t0Tern).toFixed(5)

    let t0Jump = performance.now()
    movieIndex = MovieJumpSearch(moviesList, movieToSearch) //Calculates how long MovieJumpSearch Function takes
    let t1Jump = performance.now()
    jumpTime = (t1Jump- t0Jump).toFixed(5)
    
    if(document.querySelector(".mainExplanation") !== null) //If main div is present, this removes it
        document.querySelector(".mainExplanation").remove()
    
    document.querySelector(".searchBarBar").value=''
        
    RenderMovieInformation(movieIndex) //Calls function to render movie data onto page
    RenderSearchMethodsSpeeds() //Calls function to render searching algorithm speed data onto page
})

function RenderMovieInformation(string){
    //If this div is already in the page, remove to remake it with new information
    if(document.querySelector(".movieDiv") !== null) 
        document.querySelector(".movieDiv").remove()

    const movieInfoDiv = document.createElement("div") //Create new div
    movieInfoDiv.classList.add("movieDiv") //Add a class to the div
    document.body.appendChild(movieInfoDiv) //Add div to document body

    if(movieIndex === -1)
        MovieDoesNotExistFunc(movieInfoDiv)
    else
        RenderMovieInfoText(movieInfoDiv)
}

//Function to display that movie does not exist
function MovieDoesNotExistFunc(movieDiv){
    let noMovie = document.createElement("p")
    noMovie.classList.add("MovieNotFound")
    noMovie.innerHTML = "The movie that you have searched is not contained" + "<br> within our dataset. <br>" +
    "Please search for another movie."
    movieDiv.appendChild(noMovie)
}

function RenderMovieInfoText(movieDivInfo){
    let movieInfo = document.createElement("p")
    movieInfo.classList.add("movieInformation")
    movieInfo.innerHTML = "Title: " + moviesList[movieIndex].title + "<br> Year: " + moviesList[movieIndex].year +
    "<br> Genre: " + moviesList[movieIndex].genre + "<br> Duration (mins): " + moviesList[movieIndex].duration +
    "<br> Country: " + moviesList[movieIndex].country + "<br> Language: " + moviesList[movieIndex].language +
    "<br> Director: " + moviesList[movieIndex].director + "<br> Rating: " + moviesList[movieIndex].rating
    movieDivInfo.appendChild(movieInfo)
}

//Similar to code in the RenderMovieInformation function but for searching algorithm info
function RenderSearchMethodsSpeeds(){
    if(document.querySelector(".complexityDiv") !== null)
        document.querySelector(".complexityDiv").remove()
    const searchMethodsDiv = document.createElement("div")
    searchMethodsDiv.classList.add("complexityDiv")
    document.body.appendChild(searchMethodsDiv)

    let searchFuncCompTex = document.createElement("p")
    searchFuncCompTex.classList.add("searchFunctionText")
    searchFuncCompTex.innerHTML = "Ternary Searching Algorithm runtime: " + ternTime +
    " milliseconds <br> <br>Jump Searchig Algorithm runtime: " + jumpTime +
    " milliseconds"

    searchMethodsDiv.appendChild(searchFuncCompTex)
}

