const form = document.querySelector('form');

/* Basic Info */
const nameFld = document.getElementById('name');
nameFld.addEventListener('blur', () => {
   console.log(nameFld.value)
})
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
const activityChkBxs = activitySctn.querySelectorAll('input');
const activitiesCost = document.getElementById('activities-cost');
// store selected activities
let activities = [];
// accumulator for activity cost
let totalCost = 0;

/* Payment Info */
const payMethodSlct = document.getElementById('payment');
const creditCardFlds = document.getElementById('credit-card');
const cardNumber = creditCardFlds.querySelector('#cc-num');
const cardZip = creditCardFlds.querySelector('#zip');
const cardCVV = creditCardFlds.querySelector('#cvv');
// initial default = credit card option
const options = ['credit-card', 'paypal', 'bitcoin'];
let chosenOption = options[0];
payMethodSlct.querySelector(`option[value="${chosenOption}"]`)
   .setAttribute('selected', true);

/* Helper Functions */
const hideNonOptions = chosen => {
   const chosenIdx = options.indexOf(chosen);
   options.forEach(option => {
      const div = document.getElementById(option);
      div.setAttribute('hidden', true);
      if (div.matches(`#${options[chosenIdx]}`)) {
         div.removeAttribute('hidden');
      }
   });
};

/* RegEx Helpers */
const isValidName = name => /^[a-z]+$/i.test(name);
const isValidEmail = email => /^[a-z\d]+@[a-z]+\.(com)$/i.test(email);
const isValidCardNumber = cardNum => /[\d]{13,16}/.test(cardNum);
const isValidZip = zip => /[\d]{5}/.test(zip);
const isValidCVV = cvv => /[\d]{3}/.test(cvv);

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
   let activity = e.target.name;
   e.target.toggleAttribute('checked');
   let checked = e.target.hasAttribute('checked');

   if (checked) {
      activities.push(activity);
      totalCost += cost;
   } else {
      let activityIdx = activities.indexOf(activity);
      activities.splice(activityIdx, 1);
      totalCost -= cost;
   }
   // update subtotal (display)
   activitiesCost.textContent = `Total: $${totalCost}`;
});

payMethodSlct.addEventListener('change', e => {
   document.querySelectorAll('#payment option')
      .forEach((option) => option.removeAttribute('selected'));

   chosenOption = e.target.value;
   payMethodSlct.querySelector(`option[value=${chosenOption}]`)
      .toggleAttribute('selected');
   hideNonOptions(chosenOption);
});

activityChkBxs.forEach(chkBx => {
   chkBx.addEventListener('focus', () => {
      chkBx.parentElement.className = 'focus';
   });
   chkBx.addEventListener('blur', () => {
      chkBx.parentElement.className = '';
   })
})

/* Form submit handler */
form.addEventListener('submit', (e) => {
   // s/b removed after testing
   e.preventDefault();

   const validName = isValidName(nameFld.value);   
   const validEmail = isValidEmail(emailFld.value);

   if (chosenOption === 'credit-card') {
      const num = cardNumber.value, zip = cardZip.value, cvv = cardCVV.value;
      const validCardNum = isValidCardNumber(num), 
         validZip = isValidZip(zip), validCVV = isValidCVV(cvv);
      if (!validCardNum) {
         console.log('invalid card number')
         e.preventDefault();
      } 
      if (!validZip) {
         console.log('invalid zip code')
         e.preventDefault();
      } 
      if (!validCVV) {
         console.log('invalid CVV')
         e.preventDefault();
      } else {
         console.log('valid credit card')
      }
   }

   if (activities.length === 0) {
      e.preventDefault();
      console.log('please choose at least one activity to proceed')
   }

   if (!validName) {
      nameFld.focus();
      console.log('please correct name field')
   } 
   if (!validEmail) {
      emailFld.focus();
      console.log('please correct email field')
   } 
});