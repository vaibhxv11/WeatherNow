// VAIBHAV

const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const  grantAccessContainer=document.querySelector(".grant-location-container");
const  serachForm=document.querySelector("[data-searchForm]");
const  loadingScreen=document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");

 
var oldTab=userTab;
const API_KEY="b82fbe99ed3e16e3fbac1db339bfec5d";




const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');

oldTab.classList.add("current-tab")
getfromSessionstorage();






function switchTab(newTab)
{
    notFound.classList.remove("active");
    if(newTab!=oldTab)
    {
         oldTab.classList.remove("current-tab");
         oldTab=newTab;
         oldTab.classList.add("current-tab");

    }
    else
    {
        return;
    }

         if(!serachForm.classList.contains("active")){

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            serachForm.classList.add("active");
         }
         else
         {
            // mai pehle search wale tab pe tha ab your wetaher tab pe

           
            serachForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab main your weather me aa gaya hu ,
            //lets check locakl storage for coordinates 
           getfromSessionstorage();


         }

    


}

userTab.addEventListener("click", () => {
    // Pass userTab as an argument
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // Pass searchTab as an argument
    switchTab(searchTab);
});


//check if cordinates are already present in session storage
function getfromSessionstorage()
{
    const localCoordinates =sessionStorage.getItem("userCoordinates");
    if(!localCoordinates)
    {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");

    }
    else
    {
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }

}

function retryFetch() {
    notFound.classList.remove("active");
    getfromSessionstorage();
}


async function fetchUserWeatherInfo(coordinates)
{
    const {lat, lon}= coordinates;
    //make grant container invisible 

    grantAccessContainer.classList.remove('active');
    //make loader visible 
    loadingScreen.classList.add('active');

    // now call APi
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data= await response.json();

        if (!data.sys) {
            throw data;
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    } 

       catch(err)
    {
       
        //HW
        loadingScreen.classList.remove('active');
        notFound.classList.add('active');
        errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener("click", retryFetch);

    }
}

function renderWeatherInfo(weatherInfo)
{
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp =document.querySelector("[data-temp]"); 
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    // fetch values from weatherInfo object and put in UI elements

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText=`${weatherInfo?.main?.temp} °C`;
   windspeed.innerText =`${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText=`${weatherInfo?.main?.humidity}%` ;
   cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;

}


const grantAccessButton = document.querySelector('[data-grantAccess]');
function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);


    }
    else{
        //HW - SHOW AN ALERT FOR NO SUPPORT GEO OACTION AVAILABLE 
      grantAccessButton.style.display='none';

    }

}

function showPosition(position)
{
    const userCoordinates={
        lat : position.coords.latitude ,
        lon : position.coords.longitude ,
    }

    sessionStorage.setItem("userCoordinates" , JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);   
}


grantAccessButton.addEventListener('click', getLocation);


const searchInput =document.querySelector("[data-searchInput]");
serachForm.addEventListener("submit" , (e)=>{
    e.preventDefault();
    let cityName=searchInput.value;


    if (searchInput.value === "") {
        return;
    }
    // console.log(searchInput.value);
    fetchSearchWeatherInfo(searchInput.value);
    searchInput.value = "";
     

});

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active");

    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        
        renderWeatherInfo(data);


    }
    catch(err)
    {
        //HW
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
        
    }




}





