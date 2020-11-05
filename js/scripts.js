const jqueryScript = $("script[src^='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js']");


//Page Setup Functions
document.addEventListener('DOMContentLoaded', (e)=>{
  //Add search bar
  $('.search-container').append(
  `<form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>`);


  let searchInput = document.getElementById('search-input');
  let searchSubmit = document.getElementById('search-submit');

  const profiles = getProfiles()
    .then(res => {
      const profiles= res.results;
      //for each profile from api, build card and modal
      profiles.forEach(buildElements);
    })
    .then(addModalToggle);

    //listen for key entries in search box
    searchInput.addEventListener('keyup',search);
    //listen for clicks on search button
    searchSubmit.addEventListener('click', search);

});


//HELPER Functions
//Get profiles from API returning promise
function getProfiles(){
  return $.ajax({
    url: 'https://randomuser.me/api/?nat=US&results=12',
    dataType: 'json',
    success: function(data) {
      return data;
    }
  });
}

function search(e){
    let searchInput = document.getElementById('search-input');
    let query = searchInput.value.toLowerCase();
    let regex = new RegExp(`[.+]?${query}[.+]?`);
    let profiles = document.getElementsByClassName('card-name cap');
    for(let x=0; x<profiles.length; x++){
      if(regex.test(profiles[x].innerText.toLowerCase())){
        //show profiles that match query
        profiles[x].parentElement.parentElement.style.display ='block';
      }
      else{
        //hide profiles that don't match query
        profiles[x].parentElement.parentElement.style.display ='none';
      };
    }


}

//helper function to build each profile include card and modal
function buildElements(profile, index){
  addToGallery(profile, index);
  //creates all modals to have them ready and available to show, but hidden from beginning
  createModal(profile, index);
  //hide all modals at first
  $(`#modal${index}`).hide();
}

//Build gallery cards
function addToGallery(profile, index){
  $('#gallery')
    .append(
    `<div class="card" id='profile${index}'>
      <div class="card-img-container">
          <img class="card-img" src="${profile.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
          <p class="card-text">${profile.email}</p>
          <p class="card-text cap">${profile.location.city}, ${profile.location.state}</p>
      </div>
  </div>`
  );
}

function createModal(profile, index){
  //Format phone number from (555)-555-5555 to (555) 555-5555
  const regex = /\(([0-9]{3})\)-([0-9]{3})-([0-9]{4})/;
  let formattedCell = profile.cell.replace(regex, '($1) $2-$3');
  //Build modal box
  $(jqueryScript).before(
  `<div class="modal-container" id=modal${index}>
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${profile.picture.large}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${profile.name.first} ${profile.name.last}</h3>
              <p class="modal-text"><a href="mailto:${profile.email}">${profile.email}</a></p>
              <p class="modal-text cap">${profile.location.city}</p>
              <hr>
              <p class="modal-text">${formattedCell}</p>
              <p class="modal-text">${profile.location.street.number} ${profile.location.street.name}, ${profile.location.city}, ${profile.location.state} ${profile.location.postcode}</p>
              <p class="modal-text">Date of Birth: ${new Date(profile.dob.date).toLocaleDateString()}</p>
          </div>
      </div>`);
}

//Add modal toggle optin code when modal is opened
function addModalToggle(){
    $('.modal-container').append(`
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>`);
    $('.modal-btn-container').hide();
}
//EVENT LISTENERS

document.addEventListener('click', (e)=>{
  //check if click is on card by seeing if 'card' is included in class name
  // open modal
  if(e.target.className.indexOf('card')> -1){
    const clickedId = parseInt(e.target.id.replace('profile',''));
    console.log(clickedId);
    $(`#modal${clickedId}`).show();
    $('.modal-btn-container').show();


  }
  //if click on modal toggle 'previous' button, go back 1
  else if(e.target.id === 'modal-prev'){
    console.log('PREVIOUS');
    let modals = document.getElementsByClassName('modal-container');
    for(let i=0; i< modals.length; i++){
      if(modals[i].style.display!== 'none'){
        //check if clicking on 1st profile, to get the last 1 since can't subtract from 0
        if(i===0){
          console.log(`i is 0`);
          $('#modal0').hide();
          $('#modal11').show();
          break;
        }
        else{
          console.log(`modal${i}`);
          //hide current modal, open previous
          $(`#modal${i}`).hide();
          $(`#modal${i-1}`).show();
        }
      }
    }
  }
  //if click on modal toggle 'next' button, go forward 1
  else if(e.target.id === 'modal-next'){
    console.log('PREVIOUS');
    let modals = document.getElementsByClassName('modal-container');
    for(let i=0; i< modals.length; i++){
      if(modals[i].style.display!== 'none'){
        //check if clicking on last profile, to get the last 1 since can't add to 11
        if(i===11){
          console.log(`i is 11`);
          $('#modal0').show();
          $('#modal11').hide();
        }
        else{
          console.log(`modal${i}`);
          $(`#modal${i}`).hide();
          $(`#modal${i+1}`).show();
          break;
        }
      }
    }
  }
  // check if click is on X close button to hide the modal
  else if(e.target.id==='modal-close-btn'){
      e.target.parentElement.parentElement.style.display = 'none';
      $('.modal-btn-container').hide();
  }

});
