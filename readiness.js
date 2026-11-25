const readinessCriteria = [
  ['Home page loads in under 3 seconds on a phone', 15],
  ['Checkout tested end to end on a phone', 15],
  ['Cart drawer, so shoppers never lose their place', 10],
  ['Trust badges near the add-to-cart button', 10],
  ['Clear delivery and returns info on product pages', 10],
  ['Product reviews with photos', 10],
  ['Search and filters that work on mobile', 10],
  ['Abandoned-cart email or WhatsApp reminder', 10],
  ['Clear add-to-cart button on mobile product pages', 10]
];

const readinessList = $('#readiness-list');
readinessCriteria.forEach(([title, points]) => {
  const row = element('label', 'readiness-item');
  const input = element('input');
  input.type = 'checkbox';
  input.value = points;
  row.append(input, element('span', '', title), element('small', '', '+' + points + ' pts'));
  readinessList.append(row);
});

function updateReadiness() {
  const total = Array.from(readinessList.querySelectorAll('input:checked'))
    .reduce((sum, item) => sum + Number(item.value), 0);
  let rating = 'Needs a scan';
  let advice = 'Start by checking how quickly your homepage loads and testing checkout on a phone.';
  if (total >= 80) {
    rating = 'Ready for shoppers';
    advice = total === 100 ? 'You’ve covered all nine checks. Repeat them after major store updates.' : 'You’ve covered most checks. Review the remaining items to see where you can improve.';
  } else if (total >= 50) {
    rating = 'Good foundation';
    advice = 'Look at the unchecked items and tackle the ones that make it harder to find a product or finish checkout.';
  }
  $('#readiness-value').textContent = total;
  $('#readiness-ring').style.setProperty('--score', total + '%');
  $('#readiness-announcement').textContent = total + ' out of 100.';
  $('#readiness-rating').textContent = rating;
  $('#readiness-advice').textContent = advice;
}

readinessList.addEventListener('change', updateReadiness);
updateReadiness();
