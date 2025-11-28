// Assessment Form JavaScript

let currentStep = 1;
const totalSteps = 5;
let recognition = null;
let isRecording = false;

// Initialize Web Speech API for voice input
function initSpeechRecognition() {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Speech recognition not supported in this browser');
        return false;
    }
    
    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // Get current language (with fallback)
        const lang = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ta') ? 'ta-IN' : 'en-IN';
        recognition.lang = lang;
        
        recognition.onresult = function(event) {
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                }
            }
            
            if (finalTranscript) {
                const symptomsField = document.getElementById('symptoms');
                if (symptomsField) {
                    const currentValue = symptomsField.value.trim();
                    // Add space if there's existing content
                    const separator = currentValue ? ' ' : '';
                    symptomsField.value = currentValue + separator + finalTranscript.trim();
                }
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            
            let errorMessage = 'Speech recognition error: ';
            switch(event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not found. Please check your microphone.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                default:
                    errorMessage = 'Speech recognition error: ' + event.error;
            }
            
            // Show user-friendly error
            const voiceStatus = document.getElementById('voiceStatus');
            if (voiceStatus) {
                const statusText = document.getElementById('voiceStatusText');
                if (statusText) {
                    statusText.textContent = errorMessage;
                    statusText.style.color = '#E31837';
                }
            }
            
            stopVoiceInput();
        };
        
        recognition.onend = function() {
            if (isRecording) {
                // Restart if still recording (for continuous mode)
                try {
                    setTimeout(() => {
                        if (isRecording && recognition) {
                            recognition.start();
                        }
                    }, 100);
                } catch (e) {
                    console.error('Error restarting recognition:', e);
                    stopVoiceInput();
                }
            }
        };
        
        recognition.onstart = function() {
            console.log('Speech recognition started');
            const voiceStatus = document.getElementById('voiceStatus');
            if (voiceStatus) {
                const statusText = document.getElementById('voiceStatusText');
                if (statusText) {
                    statusText.textContent = 'Recording... Speak now';
                    statusText.style.color = '#E31837';
                }
            }
        };
        
        return true;
    } catch (error) {
        console.error('Error initializing speech recognition:', error);
        return false;
    }
}

// Language toggle function
function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'ta' : 'en';
    setLanguage(newLang);
}

// Check and show/hide dynamic fields based on age and gender
function checkDynamicFields() {
    const age = parseInt(document.getElementById('age')?.value) || 0;
    const gender = document.getElementById('gender')?.value || '';
    
    const femaleFields = document.getElementById('femaleFields');
    const age45Fields = document.getElementById('age45Fields');
    const pediatricFields = document.getElementById('pediatricFields');
    const pregnancyQuestion = document.getElementById('pregnancyQuestion');
    const menstrualQuestion = document.getElementById('menstrualQuestion');
    const menopauseQuestion = document.getElementById('menopauseQuestion');
    const birthControlQuestion = document.getElementById('birthControlQuestion');
    const youngChildFields = document.getElementById('youngChildFields');
    const adolescentFields = document.getElementById('adolescentFields');
    
    // Hide all dynamic sections first
    if (femaleFields) femaleFields.style.display = 'none';
    if (age45Fields) age45Fields.style.display = 'none';
    if (pediatricFields) pediatricFields.style.display = 'none';
    
    // Validate age
    if (!age || age < 1 || age > 120) {
        return; // Invalid age
    }
    
    // CHILDREN AND TEENAGERS (< 18 years)
    if (age < 18) {
        // Always show pediatric fields for children
        if (pediatricFields) {
            pediatricFields.style.display = 'block';
            
            // Show age-appropriate fields within pediatric section
            if (youngChildFields) {
                youngChildFields.style.display = age < 12 ? 'block' : 'none';
            }
            if (adolescentFields) {
                adolescentFields.style.display = age >= 12 ? 'block' : 'none';
            }
        }
        
        // For female teenagers (13-17), also show limited women's health questions
        if (gender === 'female' && age >= 13 && femaleFields) {
            femaleFields.style.display = 'block';
            
            // Pregnancy - only for older teenagers (16-17)
            if (pregnancyQuestion) {
                pregnancyQuestion.style.display = (age >= 16) ? 'block' : 'none';
            }
            
            // Menstrual cycle - for teenagers who may have started (13+)
            if (menstrualQuestion) {
                menstrualQuestion.style.display = 'block';
            }
            
            // No menopause questions for teenagers
            if (menopauseQuestion) {
                menopauseQuestion.style.display = 'none';
            }
            
            // Birth control - only for older teenagers (16-17)
            if (birthControlQuestion) {
                birthControlQuestion.style.display = (age >= 16) ? 'block' : 'none';
            }
        }
        
        // No adult screening questions for children
        return;
    }
    
    // ADULTS (age 18+)
    if (age >= 18) {
        // Show female-specific fields for adult females
        if (gender === 'female' && femaleFields) {
            femaleFields.style.display = 'block';
            
            // Pregnancy question - reproductive age (18-50)
            if (pregnancyQuestion) {
                pregnancyQuestion.style.display = (age >= 18 && age <= 50) ? 'block' : 'none';
            }
            
            // Menstrual cycle - for reproductive age (18-55)
            if (menstrualQuestion) {
                menstrualQuestion.style.display = (age >= 18 && age <= 55) ? 'block' : 'none';
            }
            
            // Menopause question - for older females (40+)
            if (menopauseQuestion) {
                menopauseQuestion.style.display = (age >= 40) ? 'block' : 'none';
            }
            
            // Birth control - reproductive age (18-50)
            if (birthControlQuestion) {
                birthControlQuestion.style.display = (age >= 18 && age <= 50) ? 'block' : 'none';
            }
        }
        
        // Show age 40+ screening fields for cardiovascular and diabetes
        if (age >= 40 && age45Fields) {
            age45Fields.style.display = 'block';
        }
    }
}

// Voice input functions
function toggleVoiceInput() {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari for voice input.');
        return;
    }
    
    // Initialize if not already done
    if (!recognition) {
        const initialized = initSpeechRecognition();
        if (!initialized) {
            alert('Failed to initialize voice input. Please refresh the page and try again.');
            return;
        }
    }
    
    if (isRecording) {
        stopVoiceInput();
    } else {
        startVoiceInput();
    }
}

function startVoiceInput() {
    if (!recognition) {
        const initialized = initSpeechRecognition();
        if (!initialized) {
            alert('Speech recognition is not available. Please use Chrome, Edge, or Safari.');
            return;
        }
    }
    
    // Request microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            // Permission granted, start recognition
            try {
                // Update language if needed
                const lang = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ta') ? 'ta-IN' : 'en-IN';
                recognition.lang = lang;
                
                recognition.start();
                isRecording = true;
                
                const voiceBtn = document.getElementById('voiceInputBtn');
                const voiceStatus = document.getElementById('voiceStatus');
                const voiceIcon = document.getElementById('voiceIcon');
                const voiceText = document.getElementById('voiceText');
                
                if (voiceBtn) {
                    voiceBtn.classList.add('recording');
                    voiceBtn.style.background = '#E31837';
                    voiceBtn.style.color = '#FFFFFF';
                }
                if (voiceStatus) {
                    voiceStatus.style.display = 'flex';
                }
                if (voiceIcon) {
                    voiceIcon.textContent = '🔴';
                }
                if (voiceText) {
                    voiceText.textContent = 'Recording...';
                }
            } catch (error) {
                console.error('Error starting voice input:', error);
                if (error.name === 'InvalidStateError') {
                    alert('Voice input is already running. Please stop it first.');
                } else {
                    alert('Error starting voice input: ' + error.message);
                }
            }
        })
        .catch((error) => {
            console.error('Microphone permission denied:', error);
            alert('Microphone permission is required for voice input. Please allow microphone access in your browser settings.');
        });
}

function stopVoiceInput() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        
        const voiceBtn = document.getElementById('voiceInputBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceIcon = document.getElementById('voiceIcon');
        
        if (voiceBtn) {
            voiceBtn.classList.remove('recording');
            voiceBtn.style.background = '';
        }
        if (voiceStatus) {
            voiceStatus.style.display = 'none';
        }
        if (voiceIcon) {
            voiceIcon.textContent = '🎤';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check browser support for speech recognition
    const speechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (!speechSupported) {
        // Show warning and disable voice input button if not supported
        const voiceBtn = document.getElementById('voiceInputBtn');
        const voiceWarning = document.getElementById('voiceBrowserWarning');
        
        if (voiceBtn) {
            voiceBtn.style.opacity = '0.6';
            voiceBtn.style.cursor = 'not-allowed';
            voiceBtn.title = 'Voice input not supported in this browser. Use Chrome, Edge, or Safari.';
            voiceBtn.onclick = function() {
                alert('Voice input is not supported in this browser.\n\nPlease use one of these browsers:\n• Google Chrome\n• Microsoft Edge\n• Safari (Mac/iOS)\n\nFirefox does not support Web Speech API.');
            };
        }
        
        if (voiceWarning) {
            voiceWarning.style.display = 'block';
            voiceWarning.innerHTML = '<strong>⚠️ Browser Not Supported:</strong> Voice input requires Chrome, Edge, or Safari. Please use one of these browsers for voice input feature.';
        }
    } else {
        // Show helpful message for supported browsers
        const voiceWarning = document.getElementById('voiceBrowserWarning');
        if (voiceWarning) {
            voiceWarning.style.display = 'block';
            voiceWarning.style.background = '#d1ecf1';
            voiceWarning.style.borderColor = '#17a2b8';
            voiceWarning.style.color = '#0c5460';
            voiceWarning.innerHTML = '<strong>💡 Tip:</strong> Click the microphone button to start voice input. Make sure your microphone is connected and browser permissions are granted.';
        }
        console.log('✅ Speech recognition is supported in this browser');
    }
    
    // Set up dynamic field checking
    const ageField = document.getElementById('age');
    const genderField = document.getElementById('gender');
    
    if (ageField) {
        ageField.addEventListener('change', checkDynamicFields);
        ageField.addEventListener('input', checkDynamicFields);
    }
    if (genderField) {
        genderField.addEventListener('change', checkDynamicFields);
    }
    
    // Initial check
    checkDynamicFields();
    
    // Set up BMI calculation
    const weightField = document.getElementById('weight');
    const heightField = document.getElementById('height');
    
    if (weightField && heightField) {
        weightField.addEventListener('input', calculateBMI);
        weightField.addEventListener('change', calculateBMI);
        heightField.addEventListener('input', calculateBMI);
        heightField.addEventListener('change', calculateBMI);
        
        // Calculate BMI on initial load if values exist
        if (weightField.value && heightField.value) {
            calculateBMI();
        }
    }
});

// Calculate BMI on weight/height change
function calculateBMI() {
    const weightField = document.getElementById('weight');
    const heightField = document.getElementById('height');
    const bmiDisplay = document.getElementById('bmiDisplay');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    
    // Check if all required elements exist
    if (!weightField || !heightField) {
        console.warn('BMI calculation: Weight or height field not found');
        return;
    }
    
    if (!bmiDisplay || !bmiValue || !bmiCategory) {
        console.warn('BMI calculation: BMI display elements not found');
        return;
    }
    
    const weight = parseFloat(weightField.value);
    const height = parseFloat(heightField.value);
    
    // Validate inputs
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        bmiDisplay.style.display = 'none';
        return;
    }
    
    // Calculate BMI: BMI = weight (kg) / height (m)²
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    const category = getBMICategory(parseFloat(bmi));
    
    // Update display
    bmiDisplay.style.display = 'block';
    bmiValue.textContent = bmi;
    bmiCategory.textContent = category;
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

function nextStep() {
    if (currentStep < totalSteps) {
        // Validate current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#E31837';
            } else {
                field.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            alert(typeof t !== 'undefined' ? t('common.fillRequired') : 'Please fill in all required fields');
            return;
        }
        
        // Move to next step
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
        
        currentStep++;
        
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
        
        // Track progress
        if (currentStep === 2) {
            fbq('track', 'ViewContent');
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
        
        currentStep--;
        
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
    }
}

function addSymptom(symptom) {
    const symptomsField = document.getElementById('symptoms');
    const currentValue = symptomsField.value;
    if (!currentValue.includes(symptom)) {
        symptomsField.value = currentValue ? `${currentValue}, ${symptom}` : symptom;
    }
}

// Form submission
document.getElementById('assessmentForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // Stop voice input if recording
    if (isRecording) {
        stopVoiceInput();
    }
    
    // Collect form data including dynamic fields
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Validate required fields before submission
    if (!name || !age || !gender || !weight || !height || !phone) {
        alert('Please fill in all required fields (marked with *)');
        document.getElementById('loadingOverlay').style.display = 'none';
        return;
    }
    
    // Collect lifestyle fields
    const sleepHours = document.getElementById('sleep_hours')?.value || '';
    const exerciseFrequency = document.getElementById('exercise_frequency')?.value || '';
    const smokingStatus = document.getElementById('smoking_status')?.value || '';
    const alcoholConsumption = document.getElementById('alcohol_consumption')?.value || '';
    const stressLevel = document.getElementById('stress_level')?.value || '';
    const dietType = document.getElementById('diet_type')?.value || '';
    const lifestyleNotes = document.getElementById('lifestyle').value.trim();
    
    // Combine lifestyle information
    let lifestyleInfo = '';
    if (sleepHours) lifestyleInfo += `Sleep: ${sleepHours}. `;
    if (exerciseFrequency) lifestyleInfo += `Exercise: ${exerciseFrequency}. `;
    if (smokingStatus) lifestyleInfo += `Smoking: ${smokingStatus}. `;
    if (alcoholConsumption) lifestyleInfo += `Alcohol: ${alcoholConsumption}. `;
    if (stressLevel) lifestyleInfo += `Stress: ${stressLevel}. `;
    if (dietType) lifestyleInfo += `Diet: ${dietType}. `;
    if (lifestyleNotes) lifestyleInfo += lifestyleNotes;
    
    const formData = {
        name: name,
        age: age,
        gender: gender,
        weight: weight,
        height: height,
        symptoms: document.getElementById('symptoms').value.trim(),
        medical_history: document.getElementById('medical_history').value.trim(),
        family_history: document.getElementById('family_history').value.trim(),
        lifestyle: lifestyleInfo.trim() || lifestyleNotes,
        sleep_hours: sleepHours,
        exercise_frequency: exerciseFrequency,
        smoking_status: smokingStatus,
        alcohol_consumption: alcoholConsumption,
        stress_level: stressLevel,
        diet_type: dietType,
        phone: phone,
        email: email,
        consent: document.getElementById('consent').checked
    };
    
    // Add female-specific fields if visible
    const femaleFields = document.getElementById('femaleFields');
    if (femaleFields && femaleFields.style.display !== 'none') {
        const pregnant = document.querySelector('input[name="pregnant"]:checked');
        formData.pregnant = pregnant ? pregnant.value : null;
        formData.menstrual_cycle = document.getElementById('menstrual_cycle')?.value || '';
        formData.menopause_status = document.getElementById('menopause_status')?.value || '';
        formData.birth_control = document.querySelector('input[name="birth_control"]')?.checked || false;
    }
    
    // Add age > 45 fields if visible
    const age45Fields = document.getElementById('age45Fields');
    if (age45Fields && age45Fields.style.display !== 'none') {
        formData.chest_pain = document.querySelector('input[name="chest_pain"]')?.checked || false;
        formData.shortness_breath = document.querySelector('input[name="shortness_breath"]')?.checked || false;
        formData.heart_palpitations = document.querySelector('input[name="heart_palpitations"]')?.checked || false;
        formData.frequent_thirst = document.querySelector('input[name="frequent_thirst"]')?.checked || false;
        formData.blurred_vision = document.querySelector('input[name="blurred_vision"]')?.checked || false;
        formData.slow_healing = document.querySelector('input[name="slow_healing"]')?.checked || false;
        formData.family_diabetes = document.querySelector('input[name="family_diabetes"]')?.checked || false;
        formData.dizziness_fainting = document.querySelector('input[name="dizziness_fainting"]')?.checked || false;
        formData.swelling_legs = document.querySelector('input[name="swelling_legs"]')?.checked || false;
        formData.prediabetes = document.querySelector('input[name="prediabetes"]')?.checked || false;
    }
    
    // Add pediatric fields if visible
    const pediatricFields = document.getElementById('pediatricFields');
    if (pediatricFields && pediatricFields.style.display !== 'none') {
        formData.vaccination_up_to_date = document.querySelector('input[name="vaccination_up_to_date"]')?.checked || false;
        formData.growth_concerns = document.getElementById('growth_concerns')?.value || '';
        formData.school_performance = document.getElementById('school_performance')?.value || '';
        formData.pediatric_allergies = document.getElementById('pediatric_allergies')?.value || '';
        formData.sleep_patterns_normal = document.querySelector('input[name="sleep_patterns_normal"]')?.checked || false;
        formData.eating_habits = document.getElementById('eating_habits')?.value || '';
        formData.activity_level = document.getElementById('activity_level')?.value || '';
    }
    
    try {
        const response = await fetch('/api/submit-assessment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Handle validation errors
            let errorMessage = data.error || 'Failed to submit assessment';
            
            if (data.details && Array.isArray(data.details)) {
                // Show validation errors
                errorMessage = 'Please fix the following errors:\n\n' + data.details.join('\n');
            } else if (response.status === 400) {
                errorMessage = data.error || 'Invalid data. Please check your inputs and try again.';
            } else if (response.status === 429) {
                errorMessage = 'Too many requests. Please wait a moment and try again.';
            }
            
            alert(errorMessage);
            document.getElementById('loadingOverlay').style.display = 'none';
            return;
        }
        
        if (data.success) {
            // Track event
            if (typeof fbq !== 'undefined') {
                fbq('track', 'CompleteRegistration');
                fbq('track', 'Lead');
            }
            
            // Redirect to analysis page
            window.location.href = '/analysis';
        } else {
            alert('Error: ' + (data.error || 'Failed to submit assessment'));
            document.getElementById('loadingOverlay').style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'Network error. Please check your connection and try again.';
        
        if (error.message) {
            errorMessage = 'Error: ' + error.message;
        }
        
        alert(errorMessage);
        document.getElementById('loadingOverlay').style.display = 'none';
    }
});

