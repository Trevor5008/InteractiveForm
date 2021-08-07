const form = document.querySelector('form');

/* Basic Info */
const nameFld = document.getElementById('name');
const emailFld = document.getElementById('email');
nameFld.focus();

const jobRoleSlct = document.getElementById('title');
const otherJobFld = document.getElementById('other-job-role');

otherJobFld.style.display = 'none';

/* T-Shirt Info */
const tShirtDesignSlct = document.getElementById('design');
const tShirtColorSlct = document.getElementById('color');
const colorOptions = tShirtColorSlct.querySelectorAll('option');

tShirtColorSlct.setAttribute('disabled', '');
colorOptions.forEach(option => option.setAttribute('hidden', true));

/* Activities Section */
const activitySctn = document.getElementById('activities');
const activitiesCost = document.getElementById('activities-cost');
let totalCost = 0;

/* Payment Info */
const payMethodSlct = document.getElementById('payment');
// initial default = credit card option
const options = ['credit-card', 'paypal', 'bitcoin'];
payMethodSlct.querySelector(`option[value="${options[0]}"]`)
   .setAttribute('selected', true);

const hideNonOptions =(chosen)=> {
   const chosenIdx = options.indexOf(chosen);
   options.forEach(option => {
      const div = document.getElementById(option);
      div.setAttribute('hidden', true);
      if (div.matches(`#${options[chosenIdx]}`)) {
         div.removeAttribute('hidden');
      }
   });
};

// hide non-cc options on initial load
hideNonOptions('credit-card');

/* Event Listeners */
jobRoleSlct.addEventListener('change', e => {
   const selected = e.target.value;
   if (selected === 'other') {
      otherJobFld.style.display = 'block';
      otherJobFld.focus();
   } else {
      otherJobFld.style.display = 'none';
   }
});

tShirtDesignSlct.addEventListener('change', e => {
   // store selected design value
   let design = e.target.value;
   // enable color selector
   tShirtColorSlct.removeAttribute('disabled');
   // remove default color select field text
   colorOptions[0].removeAttribute('selected');
   // all options start at hidden state, none selected
   colorOptions.forEach(option => {
      if (option.hasAttribute('selected')) {
         option.removeAttribute('selected');
      }
      option.setAttribute('hidden', '')
   });

   // store node list of viable options (3 for each design)
   let options = tShirtColorSlct.querySelectorAll(`option[data-theme='${design}']`);

   for (let i = 0; i < options.length; i++) {
      options[i].removeAttribute('hidden');
      if (i === 0) {
         options[i].setAttribute('selected', '');
      }
   }
});

activitySctn.addEventListener('change', e => {
   let cost = parseInt(e.target.getAttribute('data-cost'));

   e.target.toggleAttribute('checked');
   let checked = e.target.hasAttribute('checked');
   if (checked) {
      totalCost += cost;
   } else {
      totalCost -= cost;
   }
   // update subtotal (display)
   activitiesCost.textContent = `Total: $${totalCost}`;
});

payMethodSlct.addEventListener('change', e => {
   document.querySelectorAll('#payment option')
      .forEach((option) => option.removeAttribute('selected'));

   const option = e.target.value;
   payMethodSlct.querySelector(`option[value=${option}]`)
      .toggleAttribute('selected');
   hideNonOptions(option);
});

form.addEventListener('submit', (e) => {
   e.preventDefault();
   const nameFldRegEx = /[a-z]+/i;
   const emailFldRegEx = /^[a-z\d]+@[a-z]+\.(com)$/i;
   const validName = nameFldRegEx.test(nameFld.value);   
   const validEmail = emailFldRegEx.test(emailFld.value);
   if (!validName && !validEmail) {
      nameFld.focus()
      console.log('correct incorrect entries')
   } else if (!validName) {
      nameFld.focus();
      console.log('please correct name field')
   } else if (!validEmail) {
      emailFld.focus();
      console.log('please correct email field')
   } else {
      console.log('submitted')
   }
});