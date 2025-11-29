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
        'form.symptomsDescription': 'In the last 1 month, have you experienced any of these?',
        'form.symptomsOther': 'Anything else you wish to mention? (optional)',
        'form.symptomsOtherPlaceholder': 'Any other symptoms or concerns...',
        'form.yes': 'Yes',
        'form.no': 'No',
        'form.notSure': 'Not sure',
        'form.notApplicable': 'Not applicable',
        // Symptom names
        'symptom.headache': 'Headache',
        'symptom.fatigue': 'Fatigue',
        'symptom.chestPain': 'Chest pain or tightness',
        'symptom.shortnessBreath': 'Shortness of breath',
        'symptom.dizziness': 'Dizziness or fainting',
        'symptom.jointPain': 'Joint or body pain',
        'symptom.fever': 'Fever',
        'symptom.cough': 'Cough',
        
        // Medical History
        'form.pastSurgeries': 'Past Surgeries & Chronic Conditions',
        'form.medicalHistoryPlaceholder': 'e.g., diabetes, hypertension, heart disease, surgeries...',
        'form.familyHistory': 'Family Medical History',
        'form.familyHistoryPlaceholder': 'e.g., family history of diabetes, heart disease, cancer...',
        'form.medicalHistoryDescription': 'Have you been told you have any of the following?',
        'form.familyHistoryDescription': 'Does anyone in your close family (parents, siblings, grandparents) have:',
        'form.otherConditions': 'Any other health problems?',
        'form.otherConditionsPlaceholder': 'Please mention (optional)',
        'form.otherConditionsText': 'e.g., surgeries, other conditions...',
        // Medical condition names
        'condition.diabetes': 'Diabetes',
        'condition.hypertension': 'High blood pressure (hypertension)',
        'condition.heartDisease': 'Heart disease',
        'condition.thyroid': 'Thyroid problem',
        'condition.asthma': 'Asthma or breathing problem',
        'condition.kidney': 'Kidney disease',
        'condition.cancer': 'Cancer',
        'family.diabetes': 'Diabetes in your family?',
        'family.heartDisease': 'Heart disease or stroke in your family?',
        'family.cancer': 'Cancer in close family?',
        
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
        'form.lifestyleDescription': 'Help us understand your daily habits.',
        'form.sleepHours': 'Sleep hours',
        'form.exerciseFrequency': 'Exercise / physical activity',
        'form.smokingStatus': 'Smoking / Tobacco',
        'form.alcoholConsumption': 'Alcohol',
        'form.dietType': 'Diet',
        'form.lifestyleOther': 'Anything about your food or lifestyle we should know? (optional)',
        'form.lifestyleOtherPlaceholder': 'Any other lifestyle information...',
        'form.select': 'Select',
        'form.selectTime': 'Select Time',
        // Dropdown options
        'option.lessThan5': 'Less than 5 hours',
        'option.5to7': '5–7 hours',
        'option.7to9': '7–9 hours',
        'option.moreThan9': 'More than 9 hours',
        'option.almostNever': 'Almost never',
        'option.1to2Days': '1–2 days/week',
        'option.3to5Days': '3–5 days/week',
        'option.daily': 'Daily',
        'option.never': 'Never',
        'option.stopped': 'Stopped',
        'option.sometimes': 'Sometimes',
        'option.occasional': 'Occasionally',
        'option.regular': 'Regularly',
        'option.normalMixed': 'Normal mixed diet',
        'option.vegetarian': 'Vegetarian',
        'option.vegan': 'Vegan',
        'option.diabeticLowSugar': 'Diabetic / low sugar',
        'option.lowSaltFat': 'Low salt / low fat',
        // Age 40+ questions
        'form.age40Title': 'For adults 40+, please answer these:',
        'form.age40ChestPain': 'Do you get chest pain when walking or climbing stairs?',
        'form.age40Breathless': 'Do you get breathless easily?',
        'form.age40HighBpSugar': 'Have you been told you have high BP or high sugar?',
        'form.age40Swelling': 'Do you have swelling in legs or feet?',
        // Women's health
        'form.womensHealth': 'Women\'s Health',
        'form.pregnantNow': 'Are you pregnant now?',
        'form.periodsRegular': 'Are your periods regular?',
        'form.menopauseQuestion': 'Have your periods stopped completely (menopause)?',
        'form.periodsIrregular': 'Periods becoming irregular',
        'form.periodsStopped': 'Periods stopped completely',
        // Pediatric
        'form.pediatricChecklist': 'Child & Adolescent Health',
        'form.vaccinationsUpToDate': 'Vaccinations up to date?',
        'form.learningGrowthConcerns': 'Any learning or growth concerns?',
        'form.pediatricDetails': 'Please mention (optional)',
        'form.pediatricDetailsPlaceholder': 'e.g., learning difficulties, growth concerns...',
        // Special Info
        'form.specialInfo': 'Additional Health Information',
        'form.specialInfoDescription': 'Please provide your weight and height, plus any relevant health information.',
        
        // Contact
        'form.phone': 'Phone Number',
        'form.email': 'Email Address',
        'form.consent': 'I consent to MAPIMS using my health information for assessment and recommendations',
        'form.contactDescription': 'How can we reach you?',
        'form.preferredContact': 'Preferred contact method',
        'form.phoneCall': 'Phone call',
        'form.whatsapp': 'WhatsApp',
        'form.sms': 'SMS',
        
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
        'step.specialInfo': 'Special Info',
        'step.contact': 'Contact',
        
        // Common
        'common.loading': 'Analyzing your health profile with AI...',
        'common.error': 'Error',
        'common.fillRequired': 'Please fill in all required fields',
        
        // Packages Page
        'packages.title': 'Recommended Health Checkup Packages',
        'packages.subtitle': 'Choose the package that best fits your health needs',
        'packages.selectPackage': 'Select Package',
        'packages.proceedBooking': 'Proceed to Booking',
        'packages.addonsTitle': 'Add Additional Tests',
        'packages.duration': 'Duration',
        'packages.hours': 'hours',
        'packages.includes': 'Includes',
        'packages.recommended': 'AI Recommended',
        'packages.selected': 'Selected',
        'packages.uniqueToPackage': 'Unique to this package:',
        'packages.additionalInPackage': 'Additional in this package:',
        
        // Package Names
        'package.basic': 'Basic Health Checkup',
        'package.standard': 'Standard Health Checkup',
        'package.advanced': 'Advanced Health Checkup',
        'package.master': 'Master Health Checkup',
        'package.cardiac': 'Cardiac Checkup',
        'package.diabetic': 'Diabetic Profile',
        
        // Package Descriptions
        'package.basic.desc': 'Essential health screening for preventive care',
        'package.standard.desc': 'Comprehensive screening for adults',
        'package.advanced.desc': 'Advanced screening with detailed analysis',
        'package.master.desc': 'Complete health assessment package',
        'package.cardiac.desc': 'Comprehensive heart health assessment',
        'package.diabetic.desc': 'Complete diabetes management package',
        
        // Test Names
        'test.cbc': 'Complete Blood Count (CBC)',
        'test.bloodSugar': 'Blood Sugar (Fasting)',
        'test.lipidProfile': 'Lipid Profile',
        'test.bmiAnalysis': 'BMI Analysis',
        'test.generalPhysician': 'General Physician Consultation',
        'test.allBasicTests': 'All Basic Tests',
        'test.lft': 'Liver Function Test (LFT)',
        'test.kft': 'Kidney Function Test (KFT)',
        'test.tft': 'Thyroid Function Test (TFT)',
        'test.ecg': 'ECG',
        'test.chestXray': 'Chest X-Ray',
        'test.doctorConsultation': 'Doctor Consultation',
        'test.allStandardTests': 'All Standard Tests',
        'test.hba1c': 'Diabetes Profile (HbA1c)',
        'test.vitaminDB12': 'Vitamin D & B12',
        'test.cardiacRiskMarkers': 'Cardiac Risk Markers',
        'test.ultrasoundAbdomen': 'Ultrasound Abdomen',
        'test.specialistConsultation': 'Specialist Consultation',
        'test.allAdvancedTests': 'All Advanced Tests',
        'test.cancerScreening': 'Cancer Screening Markers',
        'test.boneDensity': 'Bone Density Test',
        'test.fullBodyCheckup': 'Full Body Checkup',
        'test.stressTest': 'Stress Test',
        'test.multipleSpecialists': 'Multiple Specialist Consultations',
        'test.detailedHealthReport': 'Detailed Health Report',
        'test.completeCardiacProfile': 'Complete Cardiac Profile',
        'test.ecgStressTest': 'ECG & Stress Test',
        'test.echocardiography': 'Echocardiography',
        'test.cardiologistConsultation': 'Cardiologist Consultation',
        'test.detailedCardiacReport': 'Detailed Cardiac Report',
        'test.hba1c3months': 'HbA1c (3 months average)',
        'test.fastingPostPrandial': 'Fasting & Post-Prandial Sugar',
        'test.insulinLevels': 'Insulin Levels',
        'test.kidneyFunctionDiabetic': 'Kidney Function (for diabetics)',
        'test.eyeFootExamination': 'Eye & Foot Examination',
        'test.diabetologistConsultation': 'Diabetologist Consultation',
        'test.dietLifestyleGuidance': 'Diet & Lifestyle Guidance',
        
        // Addon Tests
        'addon.vitaminD': 'Vitamin D Test',
        'addon.vitaminB12': 'Vitamin B12 Test',
        'addon.thyroidComplete': 'Complete Thyroid Profile',
        'addon.hba1c': 'HbA1c (Diabetes Test)',
        'addon.psa': 'PSA (Prostate)',
        'addon.mammography': 'Mammography',
        'addon.boneDensity': 'Bone Density Test',
        'addon.stressTest': 'Treadmill Stress Test',
        
        // Analysis Page
        'analysis.title': 'Your AI Health Analysis',
        'analysis.subtitle': 'Based on your inputs, MAPIMS AI System recommends...',
        'analysis.viewPackages': 'View Recommended Packages',
        'analysis.riskScore': 'Health Risk Score',
        'analysis.healthRisks': 'Health Risks by Category',
        'analysis.recommendation': 'AI Recommendation',
        'analysis.priorityFactors': 'Key Factors Considered',
        'analysis.riskLow': 'Low',
        'analysis.riskModerate': 'Moderate',
        'analysis.riskHigh': 'High',
        'analysis.categoryCardiovascular': 'Cardiovascular',
        'analysis.categoryMetabolic': 'Metabolic',
        'analysis.categoryRespiratory': 'Respiratory',
        'analysis.categoryOther': 'Other',
        'analysis.mlPowered': 'ML-Powered Specialized Analysis',
        'analysis.diabetesRisk': 'Diabetes Risk Assessment',
        'analysis.heartDiseaseRisk': 'Heart Disease Risk Assessment',
        'analysis.thyroidRisk': 'Thyroid Risk Assessment',
        'analysis.confidence': 'Confidence',
        'analysis.priorityTests': 'Priority Tests',
        'analysis.overallConfidence': 'Overall ML Analysis Confidence',
        
        // Booking Page
        'booking.title': 'Complete Your Booking',
        'booking.selectedPackage': 'Selected Package',
        'booking.additionalTests': 'Additional Tests',
        'booking.selectDate': 'Select Date',
        'booking.preferredDate': 'Preferred Date',
        'booking.preferredTime': 'Preferred Time',
        'booking.payment': 'Payment',
        'booking.packagePrice': 'Package Price',
        'booking.totalAmount': 'Total Amount',
        'booking.paymentNote': 'Payment will be collected at the time of visit',
        'booking.confirm': 'Confirm Booking',
        
        // Fasting Modal
        'fasting.title': 'Important: Fasting Instructions',
        'fasting.subtitle': 'Come in Empty Stomach for Your Health Checkup',
        'fasting.important': 'Please follow these instructions carefully to ensure accurate test results:',
        'fasting.instruction0': '<strong>You must come to the hospital at <span style="color: #dc3545; font-size: 1.1em;">8:00 AM in the morning</span></strong> for your health checkup appointment',
        'fasting.instruction1': '<strong>Do not eat or drink anything</strong> (except water) for <strong>10-12 hours</strong> before your appointment',
        'fasting.instruction2': '<strong>You can drink plain water</strong> up to 1 hour before your test',
        'fasting.instruction3': '<strong>Avoid:</strong> Tea, coffee, milk, juice, soft drinks, or any food items',
        'fasting.instruction4': '<strong>Do not smoke</strong> on the day of your test',
        'fasting.instruction5': '<strong>Continue taking</strong> your regular medications unless advised otherwise by your doctor',
        'fasting.instruction6': 'If you are <strong>diabetic</strong>, please consult your doctor about medication timing before the test',
        'fasting.note': '<strong>Note:</strong> Fasting is essential for accurate blood sugar, lipid profile, and other metabolic tests. Non-compliance may affect test results and require retesting.',
        'fasting.consentText': 'I understand and agree to come in empty stomach (fasting) for my health checkup test at 8:00 AM in the morning to the hospital. I acknowledge that I have read all the instructions above.',
        'fasting.acknowledge': 'I Understand & Acknowledge',
        
        // Landing Page
        'landing.getStarted': 'Get Started',
        'landing.learnMore': 'Learn More'
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
        'form.basicInfoDescription': 'உங்களைப் பற்றி சில அடிப்படை விவரங்களுடன் தொடங்குவோம்.',
        
        // Symptoms
        'form.describeSymptoms': 'நீங்கள் அனுபவிக்கும் எந்த அறிகுறிகளையும் விவரிக்கவும்',
        'form.symptomsPlaceholder': 'எ.கா., அடிக்கடி தலைவலி, சோர்வு, மார்பு வலி, மூச்சுத் திணறல்...',
        'form.voiceInput': 'குரல் உள்ளீடு',
        'form.recording': 'பதிவு செய்கிறது...',
        'form.stopRecording': 'பதிவை நிறுத்து',
        'form.commonSymptoms': 'பொதுவான அறிகுறி வகைகள்',
        'form.symptomsDescription': 'கடந்த 1 மாதத்தில், இவற்றில் ஏதேனும் அனுபவித்தீர்களா?',
        'form.symptomsOther': 'வேறு ஏதேனும் குறிப்பிட விரும்புகிறீர்களா? (விருப்பமானது)',
        'form.symptomsOtherPlaceholder': 'வேறு அறிகுறிகள் அல்லது கவலைகள்...',
        'form.yes': 'ஆம்',
        'form.no': 'இல்லை',
        'form.notSure': 'உறுதியாக தெரியவில்லை',
        'form.notApplicable': 'பொருந்தாது',
        // Symptom names
        'symptom.headache': 'தலைவலி',
        'symptom.fatigue': 'சோர்வு',
        'symptom.chestPain': 'மார்பு வலி அல்லது இறுக்கம்',
        'symptom.shortnessBreath': 'மூச்சுத் திணறல்',
        'symptom.dizziness': 'மயக்கம் அல்லது மூர்ச்சை',
        'symptom.jointPain': 'மூட்டு அல்லது உடல் வலி',
        'symptom.fever': 'காய்ச்சல்',
        'symptom.cough': 'இருமல்',
        
        // Medical History
        'form.pastSurgeries': 'கடந்த அறுவை சிகிச்சைகள் மற்றும் நாள்பட்ட நிலைமைகள்',
        'form.medicalHistoryPlaceholder': 'எ.கா., நீரிழிவு, உயர் இரத்த அழுத்தம், இதய நோய், அறுவை சிகிச்சைகள்...',
        'form.familyHistory': 'குடும்ப மருத்துவ வரலாறு',
        'form.familyHistoryPlaceholder': 'எ.கா., நீரிழிவு, இதய நோய், புற்றுநோய் குடும்ப வரலாறு...',
        'form.medicalHistoryDescription': 'உங்களுக்கு பின்வருவனவற்றில் ஏதேனும் இருப்பதாக சொல்லப்பட்டிருக்கிறதா?',
        'form.familyHistoryDescription': 'உங்கள் நெருங்கிய குடும்பத்தில் யாருக்காவது (பெற்றோர், சகோதரர்கள், பாட்டன்மார்) இருந்ததா:',
        'form.otherConditions': 'வேறு சுகாதார பிரச்சனைகள் உள்ளனவா?',
        'form.otherConditionsPlaceholder': 'தயவுசெய்து குறிப்பிடவும் (விருப்பமானது)',
        'form.otherConditionsText': 'எ.கா., அறுவை சிகிச்சைகள், பிற நிலைமைகள்...',
        // Medical condition names
        'condition.diabetes': 'நீரிழிவு',
        'condition.hypertension': 'உயர் இரத்த அழுத்தம் (ஹைப்பர்டென்ஷன்)',
        'condition.heartDisease': 'இதய நோய்',
        'condition.thyroid': 'தைராய்டு பிரச்சனை',
        'condition.asthma': 'ஆஸ்துமா அல்லது சுவாச பிரச்சனை',
        'condition.kidney': 'சிறுநீரக நோய்',
        'condition.cancer': 'புற்றுநோய்',
        'family.diabetes': 'உங்கள் குடும்பத்தில் நீரிழிவு?',
        'family.heartDisease': 'உங்கள் குடும்பத்தில் இதய நோய் அல்லது பக்கவாதம்?',
        'family.cancer': 'நெருங்கிய குடும்பத்தில் புற்றுநோய்?',
        
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
        'form.lifestyleDescription': 'உங்கள் தினசரி பழக்கங்களைப் புரிந்துகொள்ள எங்களுக்கு உதவுங்கள்.',
        'form.sleepHours': 'தூக்க மணி நேரம்',
        'form.exerciseFrequency': 'உடற்பயிற்சி / உடல் செயல்பாடு',
        'form.smokingStatus': 'புகைப்பிடித்தல் / புகையிலை',
        'form.alcoholConsumption': 'மது',
        'form.dietType': 'உணவு',
        'form.lifestyleOther': 'உங்கள் உணவு அல்லது வாழ்க்கை முறை பற்றி நாங்கள் தெரிந்து கொள்ள வேண்டியது ஏதேனும் உள்ளதா? (விருப்பமானது)',
        'form.lifestyleOtherPlaceholder': 'வேறு வாழ்க்கை முறை தகவல்...',
        'form.select': 'தேர்ந்தெடு',
        'form.selectTime': 'நேரத்தைத் தேர்ந்தெடு',
        // Dropdown options
        'option.lessThan5': '5 மணி நேரத்திற்கும் குறைவாக',
        'option.5to7': '5–7 மணி நேரம்',
        'option.7to9': '7–9 மணி நேரம்',
        'option.moreThan9': '9 மணி நேரத்திற்கும் அதிகமாக',
        'option.almostNever': 'கிட்டத்தட்ட ஒருபோதும் இல்லை',
        'option.1to2Days': 'வாரத்திற்கு 1–2 நாட்கள்',
        'option.3to5Days': 'வாரத்திற்கு 3–5 நாட்கள்',
        'option.daily': 'தினமும்',
        'option.never': 'ஒருபோதும் இல்லை',
        'option.stopped': 'நிறுத்தப்பட்டது',
        'option.sometimes': 'சில நேரங்களில்',
        'option.occasional': 'ஒரு சில நேரங்களில்',
        'option.regular': 'தவறாமல்',
        'option.normalMixed': 'இயல்பான கலப்பு உணவு',
        'option.vegetarian': 'சைவ உணவு',
        'option.vegan': 'வேகன்',
        'option.diabeticLowSugar': 'நீரிழிவு / குறைந்த சர்க்கரை',
        'option.lowSaltFat': 'குறைந்த உப்பு / குறைந்த கொழுப்பு',
        // Age 40+ questions
        'form.age40Title': '40+ வயதுடைய பெரியவர்களுக்கு, தயவுசெய்து இவற்றிற்கு பதிலளிக்கவும்:',
        'form.age40ChestPain': 'நடக்கும்போது அல்லது படிக்கட்டுகளில் ஏறும்போது மார்பு வலி ஏற்படுகிறதா?',
        'form.age40Breathless': 'எளிதில் மூச்சுத் திணறல் ஏற்படுகிறதா?',
        'form.age40HighBpSugar': 'உங்களுக்கு உயர் இரத்த அழுத்தம் அல்லது உயர் சர்க்கரை இருப்பதாக சொல்லப்பட்டிருக்கிறதா?',
        'form.age40Swelling': 'கால்கள் அல்லது கால்களில் வீக்கம் உள்ளதா?',
        // Women's health
        'form.womensHealth': 'பெண்கள் சுகாதாரம்',
        'form.pregnantNow': 'நீங்கள் தற்போது கர்ப்பமாக இருக்கிறீர்களா?',
        'form.periodsRegular': 'உங்கள் மாதவிடாய் வழக்கமானதா?',
        'form.menopauseQuestion': 'உங்கள் மாதவிடாய் முற்றிலும் நிறுத்தப்பட்டுள்ளதா (மாதவிடாய் நிறுத்தம்)?',
        'form.periodsIrregular': 'மாதவிடாய் ஒழுங்கற்றதாக மாறுகிறது',
        'form.periodsStopped': 'மாதவிடாய் முற்றிலும் நிறுத்தப்பட்டது',
        // Pediatric
        'form.pediatricChecklist': 'குழந்தை மற்றும் இளம்பருவ சுகாதாரம்',
        'form.vaccinationsUpToDate': 'தடுப்பூசிகள் புதுப்பிக்கப்பட்டதா?',
        'form.learningGrowthConcerns': 'கற்றல் அல்லது வளர்ச்சி கவலைகள் உள்ளனவா?',
        'form.pediatricDetails': 'தயவுசெய்து குறிப்பிடவும் (விருப்பமானது)',
        'form.pediatricDetailsPlaceholder': 'எ.கா., கற்றல் சிரமங்கள், வளர்ச்சி கவலைகள்...',
        // Special Info
        'form.specialInfo': 'கூடுதல் சுகாதார தகவல்',
        'form.specialInfoDescription': 'தயவுசெய்து உங்கள் எடை மற்றும் உயரத்தை வழங்கவும், மேலும் தொடர்புடைய சுகாதார தகவலையும் வழங்கவும்.',
        
        // Contact
        'form.phone': 'தொலைபேசி எண்',
        'form.email': 'மின்னஞ்சல் முகவரி',
        'form.consent': 'மதிப்பீடு மற்றும் பரிந்துரைகளுக்காக MAPIMS எனது சுகாதார தகவலைப் பயன்படுத்துவதற்கு நான் ஒப்புக்கொள்கிறேன்',
        'form.contactDescription': 'உங்களை எவ்வாறு அடையலாம்?',
        'form.preferredContact': 'விரும்பிய தொடர்பு முறை',
        'form.phoneCall': 'தொலைபேசி அழைப்பு',
        'form.whatsapp': 'வாட்ஸ்அப்',
        'form.sms': 'SMS',
        
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
        'step.specialInfo': 'சிறப்பு தகவல்',
        'step.contact': 'தொடர்பு',
        
        // Common
        'common.loading': 'AI உடன் உங்கள் சுகாதார சுயவிவரத்தை பகுப்பாய்வு செய்கிறது...',
        'common.error': 'பிழை',
        'common.fillRequired': 'தயவுசெய்து அனைத்து தேவையான புலங்களையும் நிரப்பவும்',
        
        // Packages Page
        'packages.title': 'பரிந்துரைக்கப்பட்ட சுகாதார சோதனை தொகுப்புகள்',
        'packages.subtitle': 'உங்கள் சுகாதார தேவைகளுக்கு பொருந்தக்கூடிய தொகுப்பைத் தேர்ந்தெடுக்கவும்',
        'packages.selectPackage': 'தொகுப்பைத் தேர்ந்தெடு',
        'packages.proceedBooking': 'முன்பதிவுக்குச் செல்',
        'packages.addonsTitle': 'கூடுதல் சோதனைகளைச் சேர்',
        'packages.duration': 'காலம்',
        'packages.hours': 'மணி நேரம்',
        'packages.includes': 'உள்ளடக்கம்',
        'packages.recommended': 'AI பரிந்துரைக்கப்பட்டது',
        'packages.selected': 'தேர்ந்தெடுக்கப்பட்டது',
        'packages.uniqueToPackage': 'இந்த தொகுப்பிற்கு தனித்துவமானது:',
        'packages.additionalInPackage': 'இந்த தொகுப்பில் கூடுதல்:',
        
        // Package Names
        'package.basic': 'அடிப்படை சுகாதார சோதனை',
        'package.standard': 'தரமான சுகாதார சோதனை',
        'package.advanced': 'மேம்பட்ட சுகாதார சோதனை',
        'package.master': 'மாஸ்டர் சுகாதார சோதனை',
        'package.cardiac': 'இதய சுகாதார சோதனை',
        'package.diabetic': 'நீரிழிவு சுயவிவரம்',
        
        // Package Descriptions
        'package.basic.desc': 'தடுப்பு சிகிச்சைக்கான அத்தியாவசிய சுகாதார திரையிடல்',
        'package.standard.desc': 'பெரியவர்களுக்கான விரிவான திரையிடல்',
        'package.advanced.desc': 'விரிவான பகுப்பாய்வுடன் மேம்பட்ட திரையிடல்',
        'package.master.desc': 'முழுமையான சுகாதார மதிப்பீட்டு தொகுப்பு',
        'package.cardiac.desc': 'விரிவான இதய சுகாதார மதிப்பீடு',
        'package.diabetic.desc': 'முழுமையான நீரிழிவு மேலாண்மை தொகுப்பு',
        
        // Test Names
        'test.cbc': 'முழுமையான இரத்த எண்ணிக்கை (CBC)',
        'test.bloodSugar': 'இரத்த சர்க்கரை (விரதம்)',
        'test.lipidProfile': 'கொழுப்பு சுயவிவரம்',
        'test.bmiAnalysis': 'BMI பகுப்பாய்வு',
        'test.generalPhysician': 'பொது மருத்துவர் ஆலோசனை',
        'test.allBasicTests': 'அனைத்து அடிப்படை சோதனைகள்',
        'test.lft': 'கல்லீரல் செயல்பாட்டு சோதனை (LFT)',
        'test.kft': 'சிறுநீரக செயல்பாட்டு சோதனை (KFT)',
        'test.tft': 'தைராய்டு செயல்பாட்டு சோதனை (TFT)',
        'test.ecg': 'ECG',
        'test.chestXray': 'மார்பு எக்ஸ்-ரே',
        'test.doctorConsultation': 'மருத்துவர் ஆலோசனை',
        'test.allStandardTests': 'அனைத்து தரமான சோதனைகள்',
        'test.hba1c': 'நீரிழிவு சுயவிவரம் (HbA1c)',
        'test.vitaminDB12': 'வைட்டமின் D & B12',
        'test.cardiacRiskMarkers': 'இதய ஆபத்து குறிப்பான்கள்',
        'test.ultrasoundAbdomen': 'அல்ட்ராசவுண்ட் வயிறு',
        'test.specialistConsultation': 'நிபுணர் ஆலோசனை',
        'test.allAdvancedTests': 'அனைத்து மேம்பட்ட சோதனைகள்',
        'test.cancerScreening': 'புற்றுநோய் திரையிடல் குறிப்பான்கள்',
        'test.boneDensity': 'எலும்பு அடர்த்தி சோதனை',
        'test.fullBodyCheckup': 'முழு உடல் சோதனை',
        'test.stressTest': 'மன அழுத்த சோதனை',
        'test.multipleSpecialists': 'பல நிபுணர் ஆலோசனைகள்',
        'test.detailedHealthReport': 'விரிவான சுகாதார அறிக்கை',
        'test.completeCardiacProfile': 'முழுமையான இதய சுயவிவரம்',
        'test.ecgStressTest': 'ECG & மன அழுத்த சோதனை',
        'test.echocardiography': 'எக்கோகார்டியோகிராபி',
        'test.cardiologistConsultation': 'இதய நோய் நிபுணர் ஆலோசனை',
        'test.detailedCardiacReport': 'விரிவான இதய அறிக்கை',
        'test.hba1c3months': 'HbA1c (3 மாத சராசரி)',
        'test.fastingPostPrandial': 'விரதம் & உணவுக்குப் பிறகு சர்க்கரை',
        'test.insulinLevels': 'இன்சுலின் அளவுகள்',
        'test.kidneyFunctionDiabetic': 'சிறுநீரக செயல்பாடு (நீரிழிவு நோயாளிகளுக்கு)',
        'test.eyeFootExamination': 'கண் & கால் பரிசோதனை',
        'test.diabetologistConsultation': 'நீரிழிவு நோய் நிபுணர் ஆலோசனை',
        'test.dietLifestyleGuidance': 'உணவு & வாழ்க்கை முறை வழிகாட்டுதல்',
        
        // Addon Tests
        'addon.vitaminD': 'வைட்டமின் D சோதனை',
        'addon.vitaminB12': 'வைட்டமின் B12 சோதனை',
        'addon.thyroidComplete': 'முழுமையான தைராய்டு சுயவிவரம்',
        'addon.hba1c': 'HbA1c (நீரிழிவு சோதனை)',
        'addon.psa': 'PSA (புரோஸ்டேட்)',
        'addon.mammography': 'மாம்மோகிராபி',
        'addon.boneDensity': 'எலும்பு அடர்த்தி சோதனை',
        'addon.stressTest': 'டிரெட்மில் மன அழுத்த சோதனை',
        
        // Analysis Page
        'analysis.title': 'உங்கள் AI சுகாதார பகுப்பாய்வு',
        'analysis.subtitle': 'உங்கள் உள்ளீடுகளின் அடிப்படையில், MAPIMS AI அமைப்பு பரிந்துரைக்கிறது...',
        'analysis.viewPackages': 'பரிந்துரைக்கப்பட்ட தொகுப்புகளைக் காண்க',
        'analysis.riskScore': 'சுகாதார ஆபத்து மதிப்பெண்',
        'analysis.healthRisks': 'வகை வாரியாக சுகாதார ஆபத்துகள்',
        'analysis.recommendation': 'AI பரிந்துரை',
        'analysis.priorityFactors': 'முக்கிய காரணிகள்',
        'analysis.riskLow': 'குறைந்த',
        'analysis.riskModerate': 'மிதமான',
        'analysis.riskHigh': 'அதிக',
        'analysis.categoryCardiovascular': 'இதயநாள',
        'analysis.categoryMetabolic': 'வளர்சிதை மாற்றம்',
        'analysis.categoryRespiratory': 'சுவாச',
        'analysis.categoryOther': 'மற்றவை',
        'analysis.mlPowered': 'ML-சக்தியுள்ள சிறப்பு பகுப்பாய்வு',
        'analysis.diabetesRisk': 'நீரிழிவு ஆபத்து மதிப்பீடு',
        'analysis.heartDiseaseRisk': 'இதய நோய் ஆபத்து மதிப்பீடு',
        'analysis.thyroidRisk': 'தைராய்டு ஆபத்து மதிப்பீடு',
        'analysis.confidence': 'நம்பிக்கை',
        'analysis.priorityTests': 'முன்னுரிமை சோதனைகள்',
        'analysis.overallConfidence': 'மொத்த ML பகுப்பாய்வு நம்பிக்கை',
        
        // Booking Page
        'booking.title': 'உங்கள் முன்பதிவை முடிக்கவும்',
        'booking.selectedPackage': 'தேர்ந்தெடுக்கப்பட்ட தொகுப்பு',
        'booking.additionalTests': 'கூடுதல் சோதனைகள்',
        'booking.selectDate': 'தேதியைத் தேர்ந்தெடு',
        'booking.preferredDate': 'விரும்பிய தேதி',
        'booking.preferredTime': 'விரும்பிய நேரம்',
        'booking.payment': 'கட்டணம்',
        'booking.packagePrice': 'தொகுப்பு விலை',
        'booking.totalAmount': 'மொத்த தொகை',
        'booking.paymentNote': 'வருகையின் போது கட்டணம் வசூலிக்கப்படும்',
        'booking.confirm': 'முன்பதிவை உறுதிப்படுத்து',
        
        // Fasting Modal
        'fasting.title': 'முக்கியம்: உண்ணாவிரத அறிவுறுத்தல்கள்',
        'fasting.subtitle': 'உங்கள் உடல்நல சோதனைக்கு வெறும் வயிற்றில் வாருங்கள்',
        'fasting.important': 'துல்லியமான சோதனை முடிவுகளை உறுதிசெய்ய கீழே உள்ள அறிவுறுத்தல்களை கவனமாகப் பின்பற்றவும்:',
        'fasting.instruction0': '<strong>உங்கள் உடல்நல சோதனை அறிவுறுத்தலுக்காக <span style="color: #dc3545; font-size: 1.1em;">காலை 8:00 மணிக்கு</span> மருத்துவமனைக்கு வர வேண்டும்</strong>',
        'fasting.instruction1': '<strong>எதையும் சாப்பிடவோ அல்லது குடிக்கவோ வேண்டாம்</strong> (தண்ணீர் தவிர) உங்கள் அறிவுறுத்தலுக்கு முன் <strong>10-12 மணி நேரம்</strong>',
        'fasting.instruction2': '<strong>சாதாரண தண்ணீரை குடிக்கலாம்</strong> உங்கள் சோதனைக்கு 1 மணி நேரத்திற்கு முன்பு வரை',
        'fasting.instruction3': '<strong>தவிர்க்கவும்:</strong> தேநீர், காபி, பால், சாறு, குளிர்பானங்கள் அல்லது எந்த உணவுப் பொருட்களும்',
        'fasting.instruction4': '<strong>புகைக்க வேண்டாம்</strong> உங்கள் சோதனை நாளில்',
        'fasting.instruction5': '<strong>தொடர்ந்து எடுத்துக்கொள்ளுங்கள்</strong> உங்கள் வழக்கமான மருந்துகளை உங்கள் மருத்துவர் இல்லையென்றால் சொல்லாத வரை',
        'fasting.instruction6': 'நீங்கள் <strong>நீரிழிவு நோயால்</strong> பாதிக்கப்பட்டிருந்தால், சோதனைக்கு முன் மருந்து நேரம் குறித்து உங்கள் மருத்துவருடன் கலந்தாலோசிக்கவும்',
        'fasting.note': '<strong>குறிப்பு:</strong> இரத்த சர்க்கரை, கொழுப்பு சுயவிவரம் மற்றும் பிற வளர்சிதைமாற்ற சோதனைகளுக்கு உண்ணாவிரதம் மிகவும் அவசியம். இணங்காமை சோதனை முடிவுகளை பாதிக்கலாம் மற்றும் மீண்டும் சோதனை தேவைப்படலாம்.',
        'fasting.consentText': 'எனது உடல்நல சோதனைக்கு காலை 8:00 மணிக்கு மருத்துவமனைக்கு வெறும் வயிற்றில் (உண்ணாவிரதம்) வருவதை நான் புரிந்துகொண்டு ஒப்புக்கொள்கிறேன். மேலே உள்ள அனைத்து அறிவுறுத்தல்களையும் நான் படித்துள்ளேன் என்பதை நான் ஒப்புக்கொள்கிறேன்.',
        'fasting.acknowledge': 'நான் புரிந்துகொண்டேன் & ஒப்புக்கொள்கிறேன்',
        
        // Landing Page
        'landing.getStarted': 'தொடங்குங்கள்',
        'landing.learnMore': 'மேலும் அறிக'
    }
};

// Language management
let currentLanguage = localStorage.getItem('mapims_language') || 'en';
window.currentLanguage = currentLanguage;

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('mapims_language', lang);
    window.currentLanguage = lang;
    document.documentElement.lang = lang;
    translatePage();
    updateLanguageIcon();
    
    // Recalculate BMI if on assessment page
    if (typeof calculateBMI === 'function') {
        calculateBMI();
    }
    
    // Re-translate analysis page if it exists
    if (typeof displayAnalysis === 'function' && typeof analysisData !== 'undefined') {
        displayAnalysis(analysisData);
    }
    
    // Re-translate booking page if it exists
    if (typeof translateBookingPage === 'function') {
        translateBookingPage();
    }
}

// Language toggle function - available globally
function toggleLanguage() {
    const newLang = (typeof currentLanguage !== 'undefined' && currentLanguage === 'en') ? 'ta' : 'en';
    if (typeof setLanguage === 'function') {
        setLanguage(newLang);
    }
}

// Make toggleLanguage available globally
window.toggleLanguage = toggleLanguage;

// Mapping functions for package and test names
function getPackageTranslationKey(packageId) {
    const mapping = {
        'basic': 'package.basic',
        'standard': 'package.standard',
        'advanced': 'package.advanced',
        'master': 'package.master',
        'cardiac': 'package.cardiac',
        'diabetic': 'package.diabetic'
    };
    return mapping[packageId] || null;
}

function getPackageDescTranslationKey(packageId) {
    const mapping = {
        'basic': 'package.basic.desc',
        'standard': 'package.standard.desc',
        'advanced': 'package.advanced.desc',
        'master': 'package.master.desc',
        'cardiac': 'package.cardiac.desc',
        'diabetic': 'package.diabetic.desc'
    };
    return mapping[packageId] || null;
}

function translateTestName(testName) {
    // Map English test names to translation keys
    const testMapping = {
        'Complete Blood Count (CBC)': 'test.cbc',
        'Blood Sugar (Fasting)': 'test.bloodSugar',
        'Lipid Profile': 'test.lipidProfile',
        'BMI Analysis': 'test.bmiAnalysis',
        'General Physician Consultation': 'test.generalPhysician',
        'All Basic Tests': 'test.allBasicTests',
        'Liver Function Test (LFT)': 'test.lft',
        'Kidney Function Test (KFT)': 'test.kft',
        'Thyroid Function Test (TFT)': 'test.tft',
        'ECG': 'test.ecg',
        'Chest X-Ray': 'test.chestXray',
        'Doctor Consultation': 'test.doctorConsultation',
        'All Standard Tests': 'test.allStandardTests',
        'Diabetes Profile (HbA1c)': 'test.hba1c',
        'Vitamin D & B12': 'test.vitaminDB12',
        'Cardiac Risk Markers': 'test.cardiacRiskMarkers',
        'Ultrasound Abdomen': 'test.ultrasoundAbdomen',
        'Specialist Consultation': 'test.specialistConsultation',
        'All Advanced Tests': 'test.allAdvancedTests',
        'Cancer Screening Markers': 'test.cancerScreening',
        'Bone Density Test': 'test.boneDensity',
        'Full Body Checkup': 'test.fullBodyCheckup',
        'Stress Test': 'test.stressTest',
        'Multiple Specialist Consultations': 'test.multipleSpecialists',
        'Detailed Health Report': 'test.detailedHealthReport',
        'Complete Cardiac Profile': 'test.completeCardiacProfile',
        'ECG & Stress Test': 'test.ecgStressTest',
        'Echocardiography': 'test.echocardiography',
        'Cardiologist Consultation': 'test.cardiologistConsultation',
        'Detailed Cardiac Report': 'test.detailedCardiacReport',
        'HbA1c (3 months average)': 'test.hba1c3months',
        'Fasting & Post-Prandial Sugar': 'test.fastingPostPrandial',
        'Insulin Levels': 'test.insulinLevels',
        'Kidney Function (for diabetics)': 'test.kidneyFunctionDiabetic',
        'Eye & Foot Examination': 'test.eyeFootExamination',
        'Diabetologist Consultation': 'test.diabetologistConsultation',
        'Diet & Lifestyle Guidance': 'test.dietLifestyleGuidance',
        'Vitamin D Test': 'addon.vitaminD',
        'Vitamin B12 Test': 'addon.vitaminB12',
        'Complete Thyroid Profile': 'addon.thyroidComplete',
        'HbA1c (Diabetes Test)': 'addon.hba1c',
        'PSA (Prostate)': 'addon.psa',
        'Mammography': 'addon.mammography',
        'Treadmill Stress Test': 'addon.stressTest'
    };
    
    const key = testMapping[testName];
    if (key && translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
    }
    return testName; // Return original if no translation found
}

function translatePage() {
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            // Check if element has child elements that should be preserved
            const childElements = element.querySelectorAll('*');
            if (childElements.length > 0) {
                // If element has children (like <span>, <strong>), update only direct text nodes
                const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                if (textNodes.length > 0) {
                    // Update first text node only
                    textNodes[0].textContent = translations[currentLanguage][key];
                } else {
                    // No direct text, update textContent (will preserve structure but update text)
                    const translation = translations[currentLanguage][key];
                    // Only update if the element's direct text content matches the original
                    element.textContent = translation;
                }
            } else {
                // Simple element with no children, just update textContent
                element.textContent = translations[currentLanguage][key];
            }
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
    
    // Update dropdown options
    document.querySelectorAll('select option[data-translate]').forEach(option => {
        const key = option.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            option.textContent = translations[currentLanguage][key];
        }
    });
    
    // Translate package names and descriptions
    document.querySelectorAll('.package-name').forEach(element => {
        const packageCard = element.closest('.package-card');
        if (packageCard) {
            const packageId = packageCard.getAttribute('data-package-id');
            if (packageId) {
                const transKey = getPackageTranslationKey(packageId);
                if (transKey && translations[currentLanguage] && translations[currentLanguage][transKey]) {
                    element.textContent = translations[currentLanguage][transKey];
                }
            }
        }
    });
    
    document.querySelectorAll('.package-description').forEach(element => {
        const packageCard = element.closest('.package-card');
        if (packageCard) {
            const packageId = packageCard.getAttribute('data-package-id');
            if (packageId) {
                const transKey = getPackageDescTranslationKey(packageId);
                if (transKey && translations[currentLanguage] && translations[currentLanguage][transKey]) {
                    element.textContent = translations[currentLanguage][transKey];
                }
            }
        }
    });
    
    // Translate test names in package includes
    document.querySelectorAll('.package-includes-list li, .addon-name').forEach(element => {
        const originalText = element.getAttribute('data-original-text') || element.textContent.trim();
        if (!element.getAttribute('data-original-text')) {
            element.setAttribute('data-original-text', originalText);
        }
        const translated = translateTestName(originalText);
        if (translated !== originalText) {
            element.textContent = translated;
        }
    });
    
    // Translate differences titles
    document.querySelectorAll('.differences-title').forEach(element => {
        const text = element.textContent.trim();
        if (text === 'Unique to this package:' || text === 'இந்த தொகுப்பிற்கு தனித்துவமானது:') {
            element.textContent = t('packages.uniqueToPackage');
        } else if (text === 'Additional in this package:' || text === 'இந்த தொகுப்பில் கூடுதல்:') {
            element.textContent = t('packages.additionalInPackage');
        }
    });
    
    // Translate differences list items
    document.querySelectorAll('.differences-list li').forEach(element => {
        const originalText = element.getAttribute('data-original-text') || element.textContent.trim();
        if (!element.getAttribute('data-original-text')) {
            element.setAttribute('data-original-text', originalText);
        }
        const translated = translateTestName(originalText);
        if (translated !== originalText) {
            element.textContent = translated;
        }
    });
    
    // Translate "hours" in package duration
    document.querySelectorAll('.package-duration').forEach(element => {
        const text = element.textContent;
        if (text.includes('hours')) {
            const hoursTrans = t('packages.hours');
            element.textContent = text.replace(/hours/g, hoursTrans);
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
        // Show the opposite language as the button text (so user knows what they'll switch to)
        langIcon.textContent = currentLanguage === 'en' ? 'த' : 'EN';
        langIcon.title = currentLanguage === 'en' ? 'Switch to Tamil' : 'Switch to English';
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load saved language preference
    const savedLang = localStorage.getItem('mapims_language');
    if (savedLang && (savedLang === 'en' || savedLang === 'ta')) {
        currentLanguage = savedLang;
    }
    window.currentLanguage = currentLanguage;
    document.documentElement.lang = currentLanguage;
    translatePage();
    updateLanguageIcon();
});

// Make language preference available globally
window.currentLanguage = currentLanguage;

