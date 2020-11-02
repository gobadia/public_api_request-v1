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

  const profiles = getProfiles()
    .then(res => {
      console.log(res.results);
      const profiles= res.results;
      //profiles.forEach(addToGallery);
      profiles.forEach(buildElements);
    })
    .then(addModalToggle);

    searchInput.addEventListener('keyup', (e)=>{
      let query = searchInput.value.toLowerCase();
      let regex = new RegExp(`[.+]?${query}[.+]?`);
      console.log(`Seach is ${query}`);
      let profiles = document.getElementsByClassName('card-name cap');
      let count = 12;
      for(let x=0; x<profiles.length; x++){
        if(regex.test(profiles[x].innerText.toLowerCase())){
          profiles[x].parentElement.parentElement.style.display ='block';
          count+=1;
        }
        else{
          profiles[x].parentElement.parentElement.style.display ='none';
          count -=1;
        };
      }
    })

});


//HELPER Functions
function getProfiles(){
  return $.ajax({
    url: 'https://randomuser.me/api/?nat=US&results=12',
    dataType: 'json',
    success: function(data) {
      return data;
    }
  });
}

function buildElements(profile, index){
  addToGallery(profile, index);
  createModal(profile, index);
  console.log(`modal${index}`);
  $(`#modal${index}`).hide();
}

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
  $(jqueryScript).before(
  `<div class="modal-container" id=modal${index}>
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${profile.picture.large}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${profile.name.first} ${profile.name.last}</h3>
              <p class="modal-text">${profile.email}</p>
              <p class="modal-text cap">${profile.location.city}</p>
              <hr>
              <p class="modal-text">${profile.cell}</p>
              <p class="modal-text">${profile.location.street.number} ${profile.location.street.name}, ${profile.location.city}, ${profile.location.state} ${profile.location.postcode}</p>
              <p class="modal-text">${profile.dob.date}</p>
          </div>
      </div>`);
}

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
  console.log(e.target.id);
  //check if click is on card by seeing if 'card' is included in class name
  if(e.target.className.indexOf('card')> -1){
    const clickedId = parseInt(e.target.id.replace('profile',''));
    console.log(clickedId);
    $(`#modal${clickedId}`).show();
    $('.modal-btn-container').show();


  }
  else if(e.target.id === 'modal-prev'){
    console.log('PREVIOUS');
    let modals = document.getElementsByClassName('modal-container');
    for(let i=0; i< modals.length; i++){
      if(modals[i].style.display!== 'none'){
        if(i===0){
          console.log(`i is 0`);
          $('#modal0').hide();
          $('#modal11').show();
          break;
        }
        else{
          console.log(`modal${i}`);
          $(`#modal${i}`).hide();
          $(`#modal${i-1}`).show();
        }
      }
    }
  }
  else if(e.target.id === 'modal-next'){
    console.log('PREVIOUS');
    let modals = document.getElementsByClassName('modal-container');
    for(let i=0; i< modals.length; i++){
      if(modals[i].style.display!== 'none'){
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
  else if(e.target.id==='modal-close-btn'){
      e.target.parentElement.parentElement.style.display = 'none';
      $('.modal-btn-container').hide();
  }

});
