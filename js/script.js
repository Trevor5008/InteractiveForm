/* Basic Info */
const nameFld = document.getElementById('name');
nameFld.focus();

const jobRoleSlct = document.getElementById('title');
const otherJobFld = document.getElementById('other-job-role');

otherJobFld.style.display = 'none';

/* T-Shirt Info */
const tShirtDesignSlct = document.getElementById('design');
const tShirtColorSlct = document.getElementById('color');
const colorOptions = tShirtColorSlct.querySelectorAll('option');

tShirtColorSlct.setAttribute('disabled', '');
colorOptions.forEach(option => option.setAttribute('hidden', ''));

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