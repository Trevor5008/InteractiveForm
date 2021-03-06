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
   const hint = target.lastElementChild;
   target.classList.add('valid');
   target.classList.remove('not-valid');
   hint.style.display = 'none';
};

const validationFail = (element, evt, isEmpty) => {
   evt.preventDefault();
   const target = element.tagName === 'INPUT' 
      ? element.parentElement : element;
   const hint = target.lastElementChild;
   const isActivity = element.getAttribute('id') === 'activities';
   target.classList.add('not-valid');
   target.classList.remove('valid');
   hint.textContent = isEmpty && !isActivity 
      ? `${element.getAttribute('id')} cannot be empty` 
      : isEmpty ? `Must choose at least one activity`
      : `${element.getAttribute('id')} must be formatted correctly`;
   hint.style.display = 'inherit';
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
};

/* RegEx Helpers */
const isValidName = name => /^[a-z]+$/i.test(name);
const isValidEmail = email => /^[a-z\d]+@[a-z]+\.(com)$/i.test(email);
const isValidCardNumber = cardNum => /^[\d]{13,16}$/.test(cardNum);
const isValidZip = zip => /^[\d]{5}$/.test(zip);
const isValidCVV = cvv => /^[\d]{3}$/.test(cvv);

/* Event Listeners */
nameFld.addEventListener('keyup', (e) => {
   const name = nameFld.value;
   if (!isValidName(name)) {
      validationFail(nameFld, e);
   } else {
      validationPass(nameFld);
   }
});

emailFld.addEventListener('keyup', (e) => {
   const email = emailFld.value;
   !isValidEmail(email) ? validationFail(emailFld, e) : validationPass(emailFld);
});

cardNumber.addEventListener('keyup', (e) => {
   const cardNum = cardNumber.value;
   !isValidCardNumber(cardNum) ? validationFail(cardNumber, e) 
      : validationPass(cardNumber);
});

cardZip.addEventListener('keyup', (e) => {
   const zip = cardZip.value;
   !isValidZip(zip) ? validationFail(cardZip, e) : validationPass(cardZip);
});

cardCVV.addEventListener('keyup', (e) => {
   const cvv = cardCVV.value;
   !isValidCVV(cvv) ? validationFail(cardCVV, e) : validationPass(cardCVV);
});

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
      // re-enable any disabled activities
      handleConflicts(activity, timeSlot, false);
      let activityIdx = activities.indexOf(activity);
      let scheduleIdx = scheduled.indexOf(timeSlot);
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

// Add listeners on each checkbox w/in activities section
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
   const name = nameFld.value, email = emailFld.value;
   
   if (nameFld.value === '') {
      validationFail(nameFld, e, true); 
   } else if (!isValidName(name)) {
      validationFail(nameFld, e);
   }
   if (emailFld.value === '') {
      validationFail(emailFld, e, true); 
   } else if (!isValidEmail(email)) {
      validationFail(emailFld, e);
   }

   if (activities.length === 0) {
      validationFail(activitySctn, e, true); 
   } else {
      validationPass(activitySctn);
   }

   if (chosenOption === 'credit-card') {
      const cardNum = cardNumber.value, 
        zip = cardZip.value, cvv = cardCVV.value;
        
      if (cardNumber.value === '') {
         validationFail(cardNumber, e, true); 
      } else if (!isValidCardNumber(cardNum)) {
         validationFail(cardNumber, e);
      }
      if (cardZip.value === '') {
         validationFail(cardZip, e, true) ;
      } else if (!isValidZip(zip)) {
         validationFail(cardZip, e);
      }
      if (cardCVV.value === '') {
         validationFail(cardCVV, e, true); 
      } else if (!isValidCVV(cvv)) {
         validationFail(cardCVV, e);
      }
   }
});