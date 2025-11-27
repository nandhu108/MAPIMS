// Translation system for Tamil and English
const translations = {
    en: {
        // Header
        'header.tagline': 'Professional Healthcare Excellence',
        
        // Assessment Form
        'form.basicInfo': 'Basic Information',
        'form.symptoms': 'Current Symptoms',
        'form.medicalHistory': 'Medical History',
        'form.lifestyle': 'Lifestyle Information',
        'form.contact': 'Contact Details',
        
        // Basic Info
        'form.name': 'Full Name',
        'form.age': 'Age',
        'form.gender': 'Gender',
        'form.selectGender': 'Select',
        'form.male': 'Male',
        'form.female': 'Female',
        'form.other': 'Other',
        'form.weight': 'Weight (kg)',
        'form.height': 'Height (cm)',
        'form.bmi': 'Your BMI',
        
        // Symptoms
        'form.describeSymptoms': 'Describe any symptoms you\'re experiencing',
        'form.symptomsPlaceholder': 'e.g., frequent headaches, fatigue, chest pain, shortness of breath...',
        'form.voiceInput': 'Voice Input',
        'form.recording': 'Recording...',
        'form.stopRecording': 'Stop Recording',
        'form.commonSymptoms': 'Common Symptom Categories',
        
        // Medical History
        'form.pastSurgeries': 'Past Surgeries & Chronic Conditions',
        'form.medicalHistoryPlaceholder': 'e.g., diabetes, hypertension, heart disease, surgeries...',
        'form.familyHistory': 'Family Medical History',
        'form.familyHistoryPlaceholder': 'e.g., family history of diabetes, heart disease, cancer...',
        
        // Female-specific
        'form.pregnancy': 'Pregnancy & Menstrual Health',
        'form.pregnant': 'Are you currently pregnant?',
        'form.pregnantYes': 'Yes',
        'form.pregnantNo': 'No',
        'form.menstrualCycle': 'Menstrual cycle regularity',
        'form.regular': 'Regular',
        'form.irregular': 'Irregular',
        'form.menopause': 'Menopause status',
        'form.preMenopause': 'Pre-menopause',
        'form.menopause': 'Menopause',
        'form.postMenopause': 'Post-menopause',
        'form.birthControl': 'Using birth control?',
        
        // Age > 45 specific
        'form.cardiacHealth': 'Cardiac Health',
        'form.chestPain': 'Experience chest pain or discomfort?',
        'form.shortnessBreath': 'Shortness of breath during activity?',
        'form.heartPalpitations': 'Heart palpitations or irregular heartbeat?',
        'form.diabetesQuestions': 'Diabetes Screening',
        'form.frequentThirst': 'Frequent thirst or excessive urination?',
        'form.blurredVision': 'Blurred vision?',
        'form.slowHealing': 'Slow healing of wounds?',
        'form.familyDiabetes': 'Family history of diabetes?',
        
        // Pediatric (< 12)
        'form.pediatricChecklist': 'Pediatric Health Checklist',
        'form.vaccination': 'Up-to-date with vaccinations?',
        'form.growthConcerns': 'Any growth or development concerns?',
        'form.schoolPerformance': 'School performance concerns?',
        'form.allergies': 'Known allergies?',
        'form.sleepPatterns': 'Sleep patterns normal?',
        
        // Lifestyle
        'form.lifestyleInfo': 'Sleep, Stress, Exercise, Habits',
        'form.lifestylePlaceholder': 'e.g., sleep 6-7 hours, moderate stress, exercise 3 times/week, non-smoker...',
        
        // Contact
        'form.phone': 'Phone Number',
        'form.email': 'Email Address',
        'form.consent': 'I consent to MAPIMS using my health information for assessment and recommendations',
        
        // Buttons
        'form.next': 'Next',
        'form.back': 'Back',
        'form.submit': 'Submit Assessment',
        'form.required': '*',
        
        // Progress steps
        'step.basicInfo': 'Basic Info',
        'step.symptoms': 'Symptoms',
        'step.medicalHistory': 'Medical History',
        'step.lifestyle': 'Lifestyle',
        'step.contact': 'Contact',
        
        // Common
        'common.loading': 'Analyzing your health profile with AI...',
        'common.error': 'Error',
        'common.fillRequired': 'Please fill in all required fields'
    },
    ta: {
        // Header
        'header.tagline': 'தொழில்முறை சுகாதார சிறப்பு',
        
        // Assessment Form
        'form.basicInfo': 'அடிப்படை தகவல்',
        'form.symptoms': 'தற்போதைய அறிகுறிகள்',
        'form.medicalHistory': 'மருத்துவ வரலாறு',
        'form.lifestyle': 'வாழ்க்கை முறை தகவல்',
        'form.contact': 'தொடர்பு விவரங்கள்',
        
        // Basic Info
        'form.name': 'முழு பெயர்',
        'form.age': 'வயது',
        'form.gender': 'பாலினம்',
        'form.selectGender': 'தேர்ந்தெடு',
        'form.male': 'ஆண்',
        'form.female': 'பெண்',
        'form.other': 'மற்றவை',
        'form.weight': 'எடை (கிலோ)',
        'form.height': 'உயரம் (செ.மீ)',
        'form.bmi': 'உங்கள் BMI',
        
        // Symptoms
        'form.describeSymptoms': 'நீங்கள் அனுபவிக்கும் எந்த அறிகுறிகளையும் விவரிக்கவும்',
        'form.symptomsPlaceholder': 'எ.கா., அடிக்கடி தலைவலி, சோர்வு, மார்பு வலி, மூச்சுத் திணறல்...',
        'form.voiceInput': 'குரல் உள்ளீடு',
        'form.recording': 'பதிவு செய்கிறது...',
        'form.stopRecording': 'பதிவை நிறுத்து',
        'form.commonSymptoms': 'பொதுவான அறிகுறி வகைகள்',
        
        // Medical History
        'form.pastSurgeries': 'கடந்த அறுவை சிகிச்சைகள் மற்றும் நாள்பட்ட நிலைமைகள்',
        'form.medicalHistoryPlaceholder': 'எ.கா., நீரிழிவு, உயர் இரத்த அழுத்தம், இதய நோய், அறுவை சிகிச்சைகள்...',
        'form.familyHistory': 'குடும்ப மருத்துவ வரலாறு',
        'form.familyHistoryPlaceholder': 'எ.கா., நீரிழிவு, இதய நோய், புற்றுநோய் குடும்ப வரலாறு...',
        
        // Female-specific
        'form.pregnancy': 'கர்ப்பம் மற்றும் மாதவிடாய் சுகாதாரம்',
        'form.pregnant': 'நீங்கள் தற்போது கர்ப்பமாக இருக்கிறீர்களா?',
        'form.pregnantYes': 'ஆம்',
        'form.pregnantNo': 'இல்லை',
        'form.menstrualCycle': 'மாதவிடாய் சுழற்சி ஒழுங்கு',
        'form.regular': 'வழக்கமான',
        'form.irregular': 'வழக்கமற்ற',
        'form.menopause': 'மாதவிடாய் நிறுத்தம் நிலை',
        'form.preMenopause': 'மாதவிடாய் நிறுத்தத்திற்கு முன்',
        'form.menopause': 'மாதவிடாய் நிறுத்தம்',
        'form.postMenopause': 'மாதவிடாய் நிறுத்தத்திற்குப் பிறகு',
        'form.birthControl': 'கருத்தடை பயன்படுத்துகிறீர்களா?',
        
        // Age > 45 specific
        'form.cardiacHealth': 'இதய சுகாதாரம்',
        'form.chestPain': 'மார்பு வலி அல்லது அசௌகரியம் அனுபவிக்கிறீர்களா?',
        'form.shortnessBreath': 'செயல்பாட்டின் போது மூச்சுத் திணறல்?',
        'form.heartPalpitations': 'இதயத் துடிப்பு அல்லது ஒழுங்கற்ற இதயத் துடிப்பு?',
        'form.diabetesQuestions': 'நீரிழிவு திரையிடல்',
        'form.frequentThirst': 'அடிக்கடி தாகம் அல்லது அதிக சிறுநீர் கழித்தல்?',
        'form.blurredVision': 'மங்கலான பார்வை?',
        'form.slowHealing': 'காயங்கள் மெதுவாக குணமாகுமா?',
        'form.familyDiabetes': 'நீரிழிவு குடும்ப வரலாறு?',
        
        // Pediatric (< 12)
        'form.pediatricChecklist': 'குழந்தை சுகாதார சரிபார்ப்பு பட்டியல்',
        'form.vaccination': 'தடுப்பூசிகளுடன் புதுப்பிக்கப்பட்டதா?',
        'form.growthConcerns': 'வளர்ச்சி அல்லது வளர்ச்சி கவலைகள் உள்ளனவா?',
        'form.schoolPerformance': 'பள்ளி செயல்திறன் கவலைகள்?',
        'form.allergies': 'அறியப்பட்ட ஒவ்வாமை?',
        'form.sleepPatterns': 'தூக்க முறைகள் சாதாரணமா?',
        
        // Lifestyle
        'form.lifestyleInfo': 'தூக்கம், மன அழுத்தம், உடற்பயிற்சி, பழக்கங்கள்',
        'form.lifestylePlaceholder': 'எ.கா., 6-7 மணி நேரம் தூக்கம், மிதமான மன அழுத்தம், வாரத்திற்கு 3 முறை உடற்பயிற்சி, புகையிலை அல்லாதவர்...',
        
        // Contact
        'form.phone': 'தொலைபேசி எண்',
        'form.email': 'மின்னஞ்சல் முகவரி',
        'form.consent': 'மதிப்பீடு மற்றும் பரிந்துரைகளுக்காக MAPIMS எனது சுகாதார தகவலைப் பயன்படுத்துவதற்கு நான் ஒப்புக்கொள்கிறேன்',
        
        // Buttons
        'form.next': 'அடுத்து',
        'form.back': 'பின்',
        'form.submit': 'மதிப்பீட்டை சமர்ப்பிக்கவும்',
        'form.required': '*',
        
        // Progress steps
        'step.basicInfo': 'அடிப்படை தகவல்',
        'step.symptoms': 'அறிகுறிகள்',
        'step.medicalHistory': 'மருத்துவ வரலாறு',
        'step.lifestyle': 'வாழ்க்கை முறை',
        'step.contact': 'தொடர்பு',
        
        // Common
        'common.loading': 'AI உடன் உங்கள் சுகாதார சுயவிவரத்தை பகுப்பாய்வு செய்கிறது...',
        'common.error': 'பிழை',
        'common.fillRequired': 'தயவுசெய்து அனைத்து தேவையான புலங்களையும் நிரப்பவும்'
    }
};

// Language management
let currentLanguage = localStorage.getItem('mapims_language') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('mapims_language', lang);
    translatePage();
    updateLanguageIcon();
}

function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
    
    // Update HTML content (for elements with innerHTML)
    document.querySelectorAll('[data-translate-html]').forEach(element => {
        const key = element.getAttribute('data-translate-html');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.innerHTML = translations[currentLanguage][key];
        }
    });
}

function t(key) {
    return translations[currentLanguage] && translations[currentLanguage][key] 
        ? translations[currentLanguage][key] 
        : key;
}

function updateLanguageIcon() {
    const langIcon = document.getElementById('languageIcon');
    if (langIcon) {
        langIcon.textContent = currentLanguage === 'en' ? 'த' : 'EN';
        langIcon.title = currentLanguage === 'en' ? 'Switch to Tamil' : 'Switch to English';
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    translatePage();
    updateLanguageIcon();
});

