const form = document.querySelector('form');

/* Basic Info */
const nameFld = document.getElementById('name');
const emailFld = document.getElementById('email');
const jobRoleSlct = document.getElementById('title');
const otherJobFld = document.getElementById('other-job-role');

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
let scheduled = [];
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

/* Initial load */
nameFld.focus();
otherJobFld.style.display = 'none';
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

// hide non-cc options (initial load)
hideNonOptions('credit-card');

const validationPass = element => {
   const target = element.tagName === 'INPUT' 
      ? element.parentElement : element;
   target.classList.add('valid');
   target.classList.remove('not-valid');
   target.lastElementChild.style.display = 'none';
};

const validationFail = (element, evt) => {
   evt.preventDefault();
   const target = element.tagName === 'INPUT' 
      ? element.parentElement : element;
   target.classList.add('not-valid');
   target.classList.remove('valid');
   target.lastElementChild.style.display = 'inherit';
};

// helper for activity conflicts
const handleConflicts = (activity, slot, isChecked) => {
   activityChkBxs.forEach(act => {
      let time = act.getAttribute('data-day-and-time');
      if (act.name !== activity && time === slot) {
         if (isChecked) {
            act.parentElement.classList.add('disabled');
            act.setAttribute('disabled', true);
         } else {
            act.parentElement.classList.remove('disabled');
            act.removeAttribute('disabled');   
         }
      }
   });
}

/* RegEx Helpers */
const isValidName = name => /^[a-z]+$/i.test(name);
const isValidEmail = email => /^[a-z\d]+@[a-z]+\.(com)$/i.test(email);
const isValidCardNumber = cardNum => /[\d]{13,16}/.test(cardNum);
const isValidZip = zip => /[\d]{5}/.test(zip);
const isValidCVV = cvv => /[\d]{3}/.test(cvv);

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
   let timeSlot = e.target.getAttribute('data-day-and-time');

   e.target.toggleAttribute('checked');

   let checked = e.target.hasAttribute('checked');

   if (checked) {
      // disable conflicting activity opitions
      handleConflicts(activity, timeSlot, true);
      activities.push(activity);
      scheduled.push(timeSlot)
      totalCost += cost;
   } else {
      let activityIdx = activities.indexOf(activity);
      let scheduleIdx = scheduled.indexOf(timeSlot);
      handleConflicts(activity, timeSlot, false);
      activities.splice(activityIdx, 1);
      scheduled.splice(scheduleIdx, 1);
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

   !validName ? validationFail(nameFld, e) : validationPass(nameFld);
   !validEmail ? validationFail(emailFld, e) : validationPass(emailFld);
   activities.length === 0 ? validationFail(activitySctn, e) 
      : validationPass(activitySctn);

   if (chosenOption === 'credit-card') {
      const num = cardNumber.value, zip = cardZip.value, cvv = cardCVV.value;
      const validCardNum = isValidCardNumber(num), 
         validZip = isValidZip(zip), validCVV = isValidCVV(cvv);
      !validCardNum ? validationFail(cardNumber, e) : validationPass(cardNumber);
      !validZip ? validationFail(cardZip, e) : validationPass(cardZip);
      !validCVV ? validationFail(cardCVV, e) : validationPass(cardCVV);
   }
});