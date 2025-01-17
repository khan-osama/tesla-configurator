const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-img');
const interiorImage = document.querySelector('#interior-img');
const wheelButtonsSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDrivingCheckbox = document.querySelector('#full-self-driving-checkbox');
const accessoryCheckboxes = document.querySelectorAll('.accessory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = 'Stealth Grey';
const selectedOptions = {
    'Performance Wheels': false,
    'Performance Package': false,
    'Full Self-Driving': false
}

const pricing = {
    'Performance Wheels': 2500,
    'Performance Package': 5000,
    'Full Self-Driving': 8500,
    'Accessories': {
        'Center Console Trays': 35,
        'Sunshade': 105,
        'All-Weather Interior Liners': 225,
    }
}

// Update Total Price in UI
const updateTotalPrice = () => {
    //Reset Current Price To Base Price
    currentPrice = basePrice;

    if (selectedOptions['Performance Wheels']) {
        currentPrice += pricing['Performance Wheels'];
    }

    if (selectedOptions['Performance Package']) {
        currentPrice += pricing['Performance Package'];
    }

    if (selectedOptions['Full Self-Driving']) {
        currentPrice += pricing['Full Self-Driving'];
    }

    //Accessory Checkboxes
    accessoryCheckboxes.forEach((checkbox) => {
        //Extract each label from each accessory
        const accessoryLabel = checkbox.closest('label').querySelector('span').textContent.trim();
        const accessoryPrice = pricing['Accessories'][accessoryLabel];

        // Add to current price if accessory if selected
        if (checkbox.checked) {
            currentPrice += accessoryPrice;
        }

    })

    // Update Total Price in UI
    totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

    updatePaymentBreakdown();
}

// Update Payment Breakdown Based on Current Price
const updatePaymentBreakdown = () => {
    // Calculate Down Payment
    const downPayment = currentPrice * 0.1;
    downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

    // Calculate Loan Details (Assuming 60-Month Loan & 3% Interest Rate)
    const loanMonths = 60;
    const interestRate = 0.03;
    const loanAmount = currentPrice - downPayment;

    // Monthly Payment Formula
    const monthlyInterestRate = interestRate / 12;
    const monthlyPayment = (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanMonths))) / (Math.pow(1 + monthlyInterestRate, loanMonths) - 1);

    monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2).toLocaleString()}`;

}


// Handle Top Bar On Scroll
const handleScroll = () => {
    const atTop = window.scrollY === 0;
    topBar.classList.toggle('visible-bar', atTop);
    topBar.classList.toggle('hidden-bar', !atTop);
}

// Image Mapping
const exteriorImages = {
    'Stealth Grey': './images/model-y-stealth-grey.jpg',
    'Pearl White': './images/model-y-pearl-white.jpg',
    'Deep Blue Metallic': './images/model-y-deep-blue-metallic.jpg',
    'Solid Black': './images/model-y-solid-black.jpg',
    'Ultra Red': './images/model-y-ultra-red.jpg',
    'Quicksilver': './images/model-y-quicksilver.jpg'
}

const interiorImages = {
    'Dark': './images/model-y-interior-dark.jpg',
    'Light': './images/model-y-interior-light.jpg'
}

// Handle Color Selections (interior + exterior)
const handleColorButtonClick = (event) => {
    let button;

    if (event.target.tagName === 'IMG') {
        button = event.target.closest('button');
    } else if (event.target.tagName === 'BUTTON') {
        button = event.target;
    }

    if (button) {
        const buttons = event.currentTarget.querySelectorAll('button');
        buttons.forEach((btn) => btn.classList.remove('btn-selected'));
        button.classList.add('btn-selected');

        // Change Exterior Image
        if (event.currentTarget === exteriorColorSection) {
            selectedColor = button.querySelector('img').alt;
            updateExteriorImage();
        }

        // Change Exterior Image
        if (event.currentTarget === interiorColorSection) {
            const color = button.querySelector('img').alt;
            interiorImage.src = interiorImages[color];
        }
    }

}

// Update Exterior Image Based on Color and Wheels
const updateExteriorImage = () => {
    const performanceSuffix = selectedOptions['Performance Wheels'] ? '-performance' : '';
    const colorKey = selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
    exteriorImage.src = exteriorImages[colorKey].replace('.jpg', `${performanceSuffix}.jpg`);
}

//Wheel Selection
const handleWheelButtonClick = (event) => {
    if (event.target.tagName === 'BUTTON') {
        const buttons = document.querySelectorAll('#wheel-buttons button');
        buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));

        //Add Selected Styles To Clicked Button
        event.target.classList.add('bg-gray-700', 'text-white');

        selectedOptions['Performance Wheels'] = event.target.textContent.includes('Performance');

        updateExteriorImage();

        updateTotalPrice();
    }
} 

// Performance Package Selection
const handlePerformanceBtnClick = () => {
   const isSelected =  performanceBtn.classList.toggle('bg-gray-700');
    performanceBtn.classList.toggle('text-white');

    //Update selected options
    selectedOptions['Performance Package'] = isSelected;

    updateTotalPrice();
}

// Full Self Driving Selection
const fullSelfDrivingChange = () => {
    const isSelected = fullSelfDrivingCheckbox.checked;
    selectedOptions['Full Self-Driving'] = isSelected;

    updateTotalPrice();
}

// Initial Update Price
updateTotalPrice();

// Event Listeners
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener('click', handleColorButtonClick);
interiorColorSection.addEventListener('click', handleColorButtonClick);
wheelButtonsSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click', handlePerformanceBtnClick);
fullSelfDrivingCheckbox.addEventListener('change', fullSelfDrivingChange);
accessoryCheckboxes.forEach((checkbox) => checkbox.addEventListener('change', () => updateTotalPrice()));