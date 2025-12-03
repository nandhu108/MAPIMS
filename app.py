from flask import Flask, render_template, request, jsonify, session, redirect, url_for, g, send_file
import os
from pymongo import MongoClient
from datetime import datetime, timedelta
from openai import OpenAI
import json
from bson import ObjectId
from functools import wraps
from ml_modules import MLHealthAnalyzer
from dotenv import load_dotenv
from security_config import (
    SecurityConfig, rate_limit, require_admin, validate_assessment_input,
    rate_limiter
)
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
import io

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Validate and set secret key
try:
    app.secret_key = SecurityConfig.validate_secret_key()
except ValueError as e:
    if os.environ.get('FLASK_ENV') == 'production':
        raise e
    else:
        # Development fallback with warning
        import warnings
        warnings.warn(f"Security Warning: {str(e)}")
        app.secret_key = os.environ.get('SECRET_KEY', 'mapims-professional-healthcare-secret-key-2025')

# Configure session security
app.config['SESSION_COOKIE_SECURE'] = SecurityConfig.SESSION_COOKIE_SECURE
app.config['SESSION_COOKIE_HTTPONLY'] = SecurityConfig.SESSION_COOKIE_HTTPONLY
app.config['SESSION_COOKIE_SAMESITE'] = SecurityConfig.SESSION_COOKIE_SAMESITE
app.config['PERMANENT_SESSION_LIFETIME'] = SecurityConfig.PERMANENT_SESSION_LIFETIME

# MongoDB connection - MUST be set via environment variable in production
MONGODB_URI = os.environ.get('MONGODB_URI')
if not MONGODB_URI:
    if os.environ.get('FLASK_ENV') == 'production':
        raise ValueError("MONGODB_URI environment variable is required for production")
    else:
        # Development fallback (REMOVE IN PRODUCTION)
        MONGODB_URI = 'mongodb+srv://APDCH:Nani@apdch.zdewrol.mongodb.net/'
        import warnings
        warnings.warn("Using default MongoDB URI. Set MONGODB_URI environment variable for production.")

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client['mapims_health']
patients_collection = db['patients']
bookings_collection = db['bookings']
admin_collection = db['admin_users']

# OpenAI API configuration - MUST be set via environment variable
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    if os.environ.get('FLASK_ENV') == 'production':
        raise ValueError("OPENAI_API_KEY environment variable is required")
    else:
        # Development fallback - API key must be set via environment variable
        OPENAI_API_KEY = None
        import warnings
        warnings.warn("OPENAI_API_KEY not set. AI features will be disabled. Set OPENAI_API_KEY environment variable to enable AI features.")

# Initialize OpenAI client (handle version compatibility)
try:
    openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
except Exception as e:
    import warnings
    warnings.warn(f"OpenAI client initialization failed: {str(e)}. AI features may be limited.")
    openai_client = None

# Security Middleware - Add security headers to all responses
@app.after_request
def add_security_headers(response):
    """Add security headers to all responses"""
    for header, value in SecurityConfig.SECURITY_HEADERS.items():
        response.headers[header] = value
    return response

# Request logging and security checks
@app.before_request
def before_request():
    """Security checks before each request"""
    # Log suspicious requests
    if request.method == 'POST' and request.path.startswith('/api/'):
        # Check for suspicious patterns
        if request.is_json:
            data = request.get_json()
            if data:
                for key, value in data.items():
                    if isinstance(value, str) and not SecurityConfig.is_safe_string(value, 5000):
                        app.logger.warning(f"Suspicious input detected: {key} from {request.remote_addr}")
                        return jsonify({'success': False, 'error': 'Invalid input detected'}), 400

# MAPIMS Health Checkup Packages
PACKAGES = {
    'basic': {
        'id': 'basic',
        'price': 999,
        'name': 'Basic Health Checkup',
        'description': 'Essential health screening for preventive care',
        'includes': [
            'Complete Blood Count (CBC)',
            'Blood Sugar (Fasting)',
            'Lipid Profile',
            'BMI Analysis',
            'General Physician Consultation'
        ],
        'duration': '2-3 hours'
    },
    'standard': {
        'id': 'standard',
        'price': 1499,
        'name': 'Standard Health Checkup',
        'description': 'Comprehensive screening for adults',
        'includes': [
            'All Basic Tests',
            'Liver Function Test (LFT)',
            'Kidney Function Test (KFT)',
            'Thyroid Function Test (TFT)',
            'ECG',
            'Chest X-Ray',
            'Doctor Consultation'
        ],
        'duration': '3-4 hours'
    },
    'advanced': {
        'id': 'advanced',
        'price': 1799,
        'name': 'Advanced Health Checkup',
        'description': 'Advanced screening with detailed analysis',
        'includes': [
            'All Standard Tests',
            'Diabetes Profile (HbA1c)',
            'Vitamin D & B12',
            'Cardiac Risk Markers',
            'Ultrasound Abdomen',
            'Specialist Consultation'
        ],
        'duration': '4-5 hours'
    },
    'master': {
        'id': 'master',
        'price': 2499,
        'name': 'Master Health Checkup',
        'description': 'Complete health assessment package',
        'includes': [
            'All Advanced Tests',
            'Cancer Screening Markers',
            'Bone Density Test',
            'Full Body Checkup',
            'Stress Test',
            'Multiple Specialist Consultations',
            'Detailed Health Report'
        ],
        'duration': '5-6 hours'
    },
    'cardiac': {
        'id': 'cardiac',
        'price': 2999,
        'name': 'Cardiac Checkup',
        'description': 'Comprehensive heart health assessment',
        'includes': [
            'Complete Cardiac Profile',
            'ECG & Stress Test',
            'Echocardiography',
            'Cardiac Risk Markers',
            'Cardiologist Consultation',
            'Detailed Cardiac Report'
        ],
        'duration': '4-5 hours'
    },
    'diabetic': {
        'id': 'diabetic',
        'price': 1999,
        'name': 'Diabetic Profile',
        'description': 'Complete diabetes management package',
        'includes': [
            'HbA1c (3 months average)',
            'Fasting & Post-Prandial Sugar',
            'Insulin Levels',
            'Kidney Function (for diabetics)',
            'Eye & Foot Examination',
            'Diabetologist Consultation',
            'Diet & Lifestyle Guidance'
        ],
        'duration': '3-4 hours'
    }
}

# Add-on tests
ADDON_TESTS = {
    'vitamin_d': {'name': 'Vitamin D Test', 'price': 800},
    'vitamin_b12': {'name': 'Vitamin B12 Test', 'price': 600},
    'thyroid_complete': {'name': 'Complete Thyroid Profile', 'price': 900},
    'hba1c': {'name': 'HbA1c (Diabetes Test)', 'price': 700},
    'psa': {'name': 'PSA (Prostate)', 'price': 1000},
    'mammography': {'name': 'Mammography', 'price': 2500},
    'bone_density': {'name': 'Bone Density Test', 'price': 2000},
    'stress_test': {'name': 'Treadmill Stress Test', 'price': 3000}
}

def calculate_bmi(weight, height):
    """Calculate BMI from weight (kg) and height (cm)"""
    if weight <= 0 or height <= 0:
        return None
    height_m = height / 100
    bmi = weight / (height_m ** 2)
    return round(bmi, 1)

def get_bmi_category(bmi):
    """Get BMI category"""
    if bmi < 18.5:
        return 'Underweight'
    elif bmi < 25:
        return 'Normal'
    elif bmi < 30:
        return 'Overweight'
    else:
        return 'Obese'

def analyze_health_with_ai(patient_data):
    """
    Advanced ML-powered health analysis system
    Uses specialized ML modules for Diabetes, Heart Disease, and Thyroid
    Combined with rule-based analysis for comprehensive assessment
    """
    bmi = calculate_bmi(patient_data.get('weight', 0), patient_data.get('height', 0))
    bmi_category = get_bmi_category(bmi) if bmi else 'Unknown'
    
    # Initialize ML Analyzer
    ml_analyzer = MLHealthAnalyzer()
    
    # Prepare patient data for ML modules
    ml_patient_data = {
        'age': int(patient_data.get('age', 0)),
        'gender': patient_data.get('gender', ''),
        'weight': float(patient_data.get('weight', 0)),
        'height': float(patient_data.get('height', 0)),
        'bmi': bmi,
        'symptoms': patient_data.get('symptoms', ''),
        'medical_history': patient_data.get('medical_history', ''),
        'family_history': patient_data.get('family_history', ''),
        'lifestyle': patient_data.get('lifestyle', '')
    }
    
    # Run ML analysis for specialized conditions
    ml_results = ml_analyzer.analyze_all_conditions(ml_patient_data)
    
    age = int(patient_data.get('age', 0))
    gender = patient_data.get('gender', '').lower()
    weight = float(patient_data.get('weight', 0))
    height = float(patient_data.get('height', 0))
    symptoms = str(patient_data.get('symptoms', '')).lower()
    medical_history = str(patient_data.get('medical_history', '')).lower()
    family_history = str(patient_data.get('family_history', '')).lower()
    lifestyle = str(patient_data.get('lifestyle', '')).lower()
    
    # Initialize scoring system
    total_score = 0
    priority_factors = []
    health_risks = {
        "cardiovascular": {"score": 0, "level": "Low", "explanation": ""},
        "metabolic": {"score": 0, "level": "Low", "explanation": ""},
        "respiratory": {"score": 0, "level": "Low", "explanation": ""},
        "other": {"score": 0, "level": "Low", "explanation": ""}
    }
    
    # ========== AGE-BASED SCORING (0-25 points) ==========
    if age < 18:
        total_score += 2
        priority_factors.append("Young Age")
    elif age < 25:
        total_score += 3
    elif age < 30:
        total_score += 5
    elif age < 35:
        total_score += 8
    elif age < 40:
        total_score += 12
        priority_factors.append("Age 35-40")
    elif age < 45:
        total_score += 18
        priority_factors.append("Age 40-45")
    elif age < 50:
        total_score += 22
        priority_factors.append("Age 45-50")
    elif age < 55:
        total_score += 28
        priority_factors.append("Age 50-55")
    elif age < 60:
        total_score += 35
        priority_factors.append("Age 55-60")
    else:
        total_score += 40
        priority_factors.append("Age 60+")
    
    # ========== BMI-BASED SCORING (0-20 points) ==========
    if bmi:
        if bmi < 18.5:  # Underweight
            total_score += 8
            health_risks["metabolic"]["score"] += 5
            health_risks["metabolic"]["level"] = "Moderate"
            health_risks["metabolic"]["explanation"] = "Underweight may indicate nutritional deficiencies"
            priority_factors.append("Underweight")
        elif bmi < 25:  # Normal
            total_score += 2
        elif bmi < 27:  # Overweight
            total_score += 10
            health_risks["cardiovascular"]["score"] += 8
            health_risks["metabolic"]["score"] += 8
            health_risks["cardiovascular"]["level"] = "Moderate"
            health_risks["metabolic"]["level"] = "Moderate"
            health_risks["cardiovascular"]["explanation"] = "Overweight increases cardiovascular risk"
            health_risks["metabolic"]["explanation"] = "Overweight may affect metabolic health"
            priority_factors.append("Overweight")
        elif bmi < 30:  # Overweight (higher)
            total_score += 15
            health_risks["cardiovascular"]["score"] += 12
            health_risks["metabolic"]["score"] += 12
            health_risks["cardiovascular"]["level"] = "Moderate-High"
            health_risks["metabolic"]["level"] = "Moderate-High"
            priority_factors.append("Overweight")
        else:  # Obese
            total_score += 20
            health_risks["cardiovascular"]["score"] += 18
            health_risks["metabolic"]["score"] += 18
            health_risks["cardiovascular"]["level"] = "High"
            health_risks["metabolic"]["level"] = "High"
            health_risks["cardiovascular"]["explanation"] = "Obesity significantly increases cardiovascular disease risk"
            health_risks["metabolic"]["explanation"] = "Obesity is a major risk factor for diabetes and metabolic disorders"
            priority_factors.append("Obesity")
    
    # ========== SYMPTOMS ANALYSIS (0-30 points) ==========
    symptom_keywords = {
        "cardiovascular": ["chest", "heart", "palpitation", "breath", "shortness", "dizziness", "fainting", "swelling", "leg pain"],
        "metabolic": ["thirst", "urination", "hunger", "fatigue", "blurred vision", "slow healing", "numbness", "tingling"],
        "respiratory": ["cough", "wheezing", "asthma", "breathing", "chest tightness", "phlegm"],
        "other": ["headache", "fever", "pain", "weakness", "nausea", "vomiting"]
    }
    
    symptom_score = 0
    detected_risks = []
    
    for risk_type, keywords in symptom_keywords.items():
        for keyword in keywords:
            if keyword in symptoms:
                symptom_score += 5
                health_risks[risk_type]["score"] += 8
                if risk_type not in detected_risks:
                    detected_risks.append(risk_type)
                    priority_factors.append(f"{risk_type.capitalize()} Symptoms")
                break
    
    # Add dynamic field-based scoring
    # Age > 45 cardiac health questions
    if patient_data.get('chest_pain'):
        symptom_score += 5
        health_risks["cardiovascular"]["score"] += 10
        health_risks["cardiovascular"]["level"] = "High"
        priority_factors.append("Chest Pain Reported")
    
    if patient_data.get('shortness_breath'):
        symptom_score += 5
        health_risks["cardiovascular"]["score"] += 8
        health_risks["respiratory"]["score"] += 8
        priority_factors.append("Shortness of Breath Reported")
    
    if patient_data.get('heart_palpitations'):
        symptom_score += 5
        health_risks["cardiovascular"]["score"] += 10
        health_risks["cardiovascular"]["level"] = "High"
        priority_factors.append("Heart Palpitations Reported")
    
    # Age > 45 diabetes screening questions
    if patient_data.get('frequent_thirst'):
        symptom_score += 5
        health_risks["metabolic"]["score"] += 10
        health_risks["metabolic"]["level"] = "High"
        priority_factors.append("Frequent Thirst (Diabetes Risk)")
    
    if patient_data.get('blurred_vision'):
        symptom_score += 5
        health_risks["metabolic"]["score"] += 8
        priority_factors.append("Blurred Vision (Diabetes Risk)")
    
    if patient_data.get('slow_healing'):
        symptom_score += 5
        health_risks["metabolic"]["score"] += 8
        priority_factors.append("Slow Healing (Diabetes Risk)")
    
    if patient_data.get('family_diabetes'):
        health_risks["metabolic"]["score"] += 12
        health_risks["metabolic"]["level"] = "High"
        priority_factors.append("Family History of Diabetes")
    
    # Female-specific health considerations
    if gender == 'female':
        if patient_data.get('pregnant') == 'yes':
            total_score += 15
            priority_factors.append("Pregnancy - Specialized Care Required")
        if patient_data.get('menstrual_cycle') == 'irregular':
            total_score += 5
            priority_factors.append("Irregular Menstrual Cycle")
        if patient_data.get('menopause_status') == 'menopause' or patient_data.get('menopause_status') == 'post':
            total_score += 10
            health_risks["metabolic"]["score"] += 5
            priority_factors.append("Menopause - Hormonal Health Monitoring")
    
    total_score += min(symptom_score, 30)  # Cap at 30 points
    
    # Update risk levels based on scores
    for risk_type in health_risks:
        if health_risks[risk_type]["score"] >= 15:
            health_risks[risk_type]["level"] = "High"
        elif health_risks[risk_type]["score"] >= 8:
            health_risks[risk_type]["level"] = "Moderate"
        else:
            health_risks[risk_type]["level"] = "Low"
    
    # ========== MEDICAL HISTORY ANALYSIS (0-25 points) ==========
    critical_conditions = ["diabetes", "hypertension", "heart disease", "stroke", "kidney", "liver", "cancer", "thyroid"]
    moderate_conditions = ["asthma", "arthritis", "cholesterol", "anemia", "migraine"]
    
    medical_score = 0
    for condition in critical_conditions:
        if condition in medical_history:
            medical_score += 12
            total_score += 12
            if "diabetes" in condition or "diabetic" in medical_history:
                health_risks["metabolic"]["score"] += 15
                health_risks["metabolic"]["level"] = "High"
                health_risks["metabolic"]["explanation"] = "Existing diabetes requires comprehensive monitoring"
                priority_factors.append("Diabetes")
            if "heart" in condition or "cardiac" in medical_history:
                health_risks["cardiovascular"]["score"] += 15
                health_risks["cardiovascular"]["level"] = "High"
                health_risks["cardiovascular"]["explanation"] = "Existing heart condition requires specialized cardiac care"
                priority_factors.append("Heart Condition")
            break
    
    for condition in moderate_conditions:
        if condition in medical_history:
            medical_score += 6
            total_score += 6
            priority_factors.append(condition.capitalize())
            break
    
    # ========== FAMILY HISTORY ANALYSIS (0-15 points) ==========
    family_conditions = ["diabetes", "heart", "cancer", "hypertension", "stroke", "kidney", "liver"]
    family_score = 0
    for condition in family_conditions:
        if condition in family_history:
            family_score += 5
            total_score += 5
            if "diabetes" in condition:
                health_risks["metabolic"]["score"] += 8
                priority_factors.append("Family History: Diabetes")
            if "heart" in condition:
                health_risks["cardiovascular"]["score"] += 8
                priority_factors.append("Family History: Heart Disease")
            break
    
    # ========== LIFESTYLE ANALYSIS (0-10 points) ==========
    if "smok" in lifestyle or "tobacco" in lifestyle:
        total_score += 8
        health_risks["cardiovascular"]["score"] += 10
        health_risks["respiratory"]["score"] += 10
        health_risks["cardiovascular"]["level"] = "Moderate-High" if health_risks["cardiovascular"]["level"] == "Low" else "High"
        health_risks["respiratory"]["level"] = "Moderate-High"
        priority_factors.append("Smoking")
    
    if "alcohol" in lifestyle or "drink" in lifestyle:
        total_score += 5
        health_risks["other"]["score"] += 8
        health_risks["other"]["level"] = "Moderate"
        priority_factors.append("Alcohol Consumption")
    
    if "stress" in lifestyle or "anxiety" in lifestyle:
        total_score += 4
        health_risks["cardiovascular"]["score"] += 5
        priority_factors.append("Stress")
    
    if "exercise" not in lifestyle or "sedentary" in lifestyle:
        total_score += 6
        health_risks["cardiovascular"]["score"] += 6
        health_risks["metabolic"]["score"] += 6
        priority_factors.append("Low Physical Activity")
    
    if "sleep" in lifestyle and ("less" in lifestyle or "insomnia" in lifestyle or "4" in lifestyle or "5" in lifestyle):
        total_score += 4
        health_risks["other"]["score"] += 5
        priority_factors.append("Sleep Issues")
    
    # ========== GENDER-SPECIFIC CONSIDERATIONS ==========
    if gender == "female" and age >= 40:
        total_score += 5
        priority_factors.append("Women's Health Screening")
    if gender == "male" and age >= 45:
        total_score += 5
        priority_factors.append("Men's Health Screening")
    
    # ========== DETERMINE RISK SCORE ==========
    if total_score >= 70:
        risk_score = "Critical"
    elif total_score >= 50:
        risk_score = "High"
    elif total_score >= 30:
        risk_score = "Moderate"
    else:
        risk_score = "Low"
    
    # ========== ENHANCE WITH ML MODULE RESULTS ==========
    # Integrate ML module results for higher accuracy
    diabetes_ml = ml_results.get('diabetes', {})
    heart_ml = ml_results.get('heart_disease', {})
    thyroid_ml = ml_results.get('thyroid', {})
    
    # Update cardiovascular risk with ML results
    if heart_ml.get('risk_score', 0) >= 50:
        health_risks["cardiovascular"]["score"] += 15
        health_risks["cardiovascular"]["level"] = "High"
        health_risks["cardiovascular"]["explanation"] = f"ML Analysis: {heart_ml.get('recommendation', 'High cardiovascular risk detected')}"
        if heart_ml.get('risk_factors'):
            priority_factors.extend([f"Cardiac: {factor}" for factor in heart_ml['risk_factors'][:2]])
    elif heart_ml.get('risk_score', 0) >= 35:
        health_risks["cardiovascular"]["score"] += 10
        if health_risks["cardiovascular"]["level"] == "Low":
            health_risks["cardiovascular"]["level"] = "Moderate"
        health_risks["cardiovascular"]["explanation"] = f"ML Analysis: {heart_ml.get('recommendation', 'Moderate cardiovascular risk')}"
    
    # Update metabolic risk with ML results
    if diabetes_ml.get('risk_score', 0) >= 50:
        health_risks["metabolic"]["score"] += 15
        health_risks["metabolic"]["level"] = "High"
        health_risks["metabolic"]["explanation"] = f"ML Analysis: {diabetes_ml.get('recommendation', 'High diabetes risk detected')}"
        if diabetes_ml.get('risk_factors'):
            priority_factors.extend([f"Diabetes: {factor}" for factor in diabetes_ml['risk_factors'][:2]])
    elif diabetes_ml.get('risk_score', 0) >= 30:
        health_risks["metabolic"]["score"] += 10
        if health_risks["metabolic"]["level"] == "Low":
            health_risks["metabolic"]["level"] = "Moderate"
        health_risks["metabolic"]["explanation"] = f"ML Analysis: {diabetes_ml.get('recommendation', 'Moderate diabetes risk')}"
    
    # Add thyroid risk (new category)
    thyroid_risk_level = thyroid_ml.get('risk_level', 'Low')
    thyroid_risk_score = thyroid_ml.get('risk_score', 0)
    if thyroid_risk_score >= 50:
        health_risks["other"]["score"] += 15
        health_risks["other"]["level"] = "High"
        health_risks["other"]["explanation"] = f"ML Analysis: {thyroid_ml.get('recommendation', 'High thyroid risk detected')}"
        if thyroid_ml.get('risk_factors'):
            priority_factors.extend([f"Thyroid: {factor}" for factor in thyroid_ml['risk_factors'][:2]])
    elif thyroid_risk_score >= 30:
        health_risks["other"]["score"] += 10
        if health_risks["other"]["level"] == "Low":
            health_risks["other"]["level"] = "Moderate"
        health_risks["other"]["explanation"] = f"ML Analysis: {thyroid_ml.get('recommendation', 'Moderate thyroid risk')}"
    
    # ========== RECOMMEND PACKAGES BASED ON SCORE + ML RESULTS ==========
    # Use ML results to refine package recommendations
    diabetes_risk = diabetes_ml.get('risk_score', 0)
    heart_risk = heart_ml.get('risk_score', 0)
    thyroid_risk = thyroid_ml.get('risk_score', 0)
    
    # Adjust total score based on ML results
    ml_adjusted_score = total_score
    if diabetes_risk >= 50:
        ml_adjusted_score += 10
    if heart_risk >= 50:
        ml_adjusted_score += 10
    if thyroid_risk >= 50:
        ml_adjusted_score += 8
    
    if ml_adjusted_score >= 70:  # Critical
        recommended_packages = ["master", "cardiac"]
    elif ml_adjusted_score >= 50:  # High
        # Prioritize based on ML-detected conditions
        if diabetes_risk >= 50:
            recommended_packages = ["diabetic", "advanced"]
        elif heart_risk >= 50:
            recommended_packages = ["cardiac", "advanced"]
        elif thyroid_risk >= 50:
            recommended_packages = ["advanced", "master"]  # Advanced includes thyroid tests
        elif "diabetes" in medical_history or "diabetic" in medical_history:
            recommended_packages = ["diabetic", "advanced"]
        elif health_risks["cardiovascular"]["level"] in ["High", "Moderate-High"]:
            recommended_packages = ["cardiac", "advanced"]
        else:
            recommended_packages = ["advanced", "master"]
    elif ml_adjusted_score >= 30:  # Moderate
        # Check if any ML module detected moderate risk
        if diabetes_risk >= 30 or heart_risk >= 35 or thyroid_risk >= 30:
            recommended_packages = ["standard", "advanced"]
        else:
            recommended_packages = ["standard", "advanced"]
    else:  # Low
        recommended_packages = ["basic", "standard"]
    
    # ========== GENERATE HEALTH RISK EXPLANATIONS ==========
    if not health_risks["cardiovascular"]["explanation"]:
        if health_risks["cardiovascular"]["level"] == "High":
            health_risks["cardiovascular"]["explanation"] = "High risk factors detected - comprehensive cardiac screening recommended"
        elif health_risks["cardiovascular"]["level"] == "Moderate":
            health_risks["cardiovascular"]["explanation"] = "Moderate cardiovascular risk factors present - standard screening advised"
        else:
            health_risks["cardiovascular"]["explanation"] = "Low cardiovascular risk - routine screening sufficient"
    
    if not health_risks["metabolic"]["explanation"]:
        if health_risks["metabolic"]["level"] == "High":
            health_risks["metabolic"]["explanation"] = "High metabolic risk - comprehensive diabetes and metabolic screening essential"
        elif health_risks["metabolic"]["level"] == "Moderate":
            health_risks["metabolic"]["explanation"] = "Moderate metabolic risk - standard metabolic screening recommended"
        else:
            health_risks["metabolic"]["explanation"] = "Low metabolic risk - basic screening adequate"
    
    if health_risks["respiratory"]["level"] == "Low":
        health_risks["respiratory"]["explanation"] = "No significant respiratory risks identified"
    elif health_risks["respiratory"]["level"] == "Moderate":
        health_risks["respiratory"]["explanation"] = "Some respiratory risk factors present - consider respiratory screening"
    else:
        health_risks["respiratory"]["explanation"] = "Respiratory risk factors detected - specialized screening recommended"
    
    if health_risks["other"]["level"] == "Low":
        health_risks["other"]["explanation"] = "Routine health monitoring advised"
    else:
        health_risks["other"]["explanation"] = "Additional health factors require attention"
    
    # ========== GENERATE REASONING ==========
    reasoning_parts = []
    if age >= 50:
        reasoning_parts.append(f"At {age} years, comprehensive health screening is essential for early detection")
    elif age >= 40:
        reasoning_parts.append(f"At {age} years, preventive health screening is recommended")
    
    if bmi and bmi >= 30:
        reasoning_parts.append("Your BMI indicates obesity, requiring detailed metabolic and cardiovascular assessment")
    elif bmi and bmi >= 25:
        reasoning_parts.append("Your BMI suggests being overweight, warranting thorough health screening")
    elif bmi and bmi < 18.5:
        reasoning_parts.append("Your BMI indicates being underweight, requiring comprehensive evaluation")
    
    if symptoms:
        reasoning_parts.append("Based on your reported symptoms, detailed health assessment is advisable")
    
    if medical_history:
        reasoning_parts.append("Given your medical history, comprehensive monitoring is essential")
    
    if family_history:
        reasoning_parts.append("Family history indicates need for preventive screening")
    
    if not reasoning_parts:
        reasoning_parts.append("A comprehensive health checkup is recommended for maintaining optimal health")
    
    # Enhance reasoning with ML insights
    ml_insights = []
    if diabetes_ml.get('risk_score', 0) >= 50:
        ml_insights.append(f"ML Analysis detected high diabetes risk ({diabetes_ml.get('risk_score', 0)}/100) with {diabetes_ml.get('confidence', 0)*100:.0f}% confidence.")
    if heart_ml.get('risk_score', 0) >= 50:
        ml_insights.append(f"ML Analysis detected high cardiovascular risk ({heart_ml.get('risk_score', 0)}/100) with {heart_ml.get('confidence', 0)*100:.0f}% confidence.")
    if thyroid_ml.get('risk_score', 0) >= 50:
        ml_insights.append(f"ML Analysis detected high thyroid risk ({thyroid_ml.get('risk_score', 0)}/100) with {thyroid_ml.get('confidence', 0)*100:.0f}% confidence.")
    
    if ml_insights:
        reasoning = " ".join(reasoning_parts) + " " + " ".join(ml_insights) + " MAPIMS recommends the appropriate health checkup package based on your individual risk profile and ML-powered analysis."
    else:
        reasoning = " ".join(reasoning_parts) + ". MAPIMS recommends the appropriate health checkup package based on your individual risk profile."
    
    # Remove duplicates from priority factors
    priority_factors = list(dict.fromkeys(priority_factors))
    
    return {
        "risk_score": risk_score,
        "recommended_packages": recommended_packages,
        "health_risks": {
            "cardiovascular": f"{health_risks['cardiovascular']['level']} - {health_risks['cardiovascular']['explanation']}",
            "metabolic": f"{health_risks['metabolic']['level']} - {health_risks['metabolic']['explanation']}",
            "respiratory": f"{health_risks['respiratory']['level']} - {health_risks['respiratory']['explanation']}",
            "other": f"{health_risks['other']['level']} - {health_risks['other']['explanation']}"
        },
        "reasoning": reasoning,
        "priority_factors": priority_factors[:5],  # Top 5 factors
        "total_score": total_score,  # For debugging
        "ml_analysis": {
            "diabetes": {
                "risk_score": diabetes_ml.get('risk_score', 0),
                "risk_level": diabetes_ml.get('risk_level', 'Low'),
                "confidence": diabetes_ml.get('confidence', 0),
                "priority_tests": diabetes_ml.get('priority_tests', [])
            },
            "heart_disease": {
                "risk_score": heart_ml.get('risk_score', 0),
                "risk_level": heart_ml.get('risk_level', 'Low'),
                "confidence": heart_ml.get('confidence', 0),
                "priority_tests": heart_ml.get('priority_tests', [])
            },
            "thyroid": {
                "risk_score": thyroid_ml.get('risk_score', 0),
                "risk_level": thyroid_ml.get('risk_level', 'Low'),
                "confidence": thyroid_ml.get('confidence', 0),
                "priority_tests": thyroid_ml.get('priority_tests', [])
            },
            "overall_confidence": ml_results.get('overall_confidence', 0)
        }
    }, bmi, bmi_category

# ==================== ROUTES ====================

@app.route('/')
def landing():
    """MAPIMS Landing Page"""
    return render_template('landing.html')

@app.route('/assessment')
def assessment():
    """Health Assessment Form"""
    return render_template('assessment.html')

@app.route('/api/submit-assessment', methods=['POST'])
@rate_limit(limit_per_minute=10, limit_per_hour=50)
def submit_assessment():
    """Submit health assessment and get AI analysis"""
    try:
        data = request.json
        
        if not data:
            app.logger.warning("Assessment submission: No data received")
            return jsonify({
                'success': False,
                'error': 'No data received. Please fill in the form and try again.'
            }), 400
        
        # Log received data for debugging (without sensitive info)
        app.logger.info(f"Assessment submission: Name={data.get('name', 'N/A')[:10]}..., Age={data.get('age')}, Gender={data.get('gender')}")
        
        # Validate and sanitize input
        validation_errors = validate_assessment_input(data)
        if validation_errors:
            app.logger.warning(f"Assessment validation failed: {validation_errors}")
            return jsonify({
                'success': False,
                'error': 'Please correct the following errors',
                'details': validation_errors
            }), 400
        
        # Calculate BMI
        bmi = calculate_bmi(data.get('weight', 0), data.get('height', 0))
        bmi_category = get_bmi_category(bmi) if bmi else 'Unknown'
        
        # Get health analysis using advanced rule-based system
        try:
            # Include dynamic fields in analysis data
            analysis_data = data.copy()
            # Add dynamic fields to analysis if they exist
            if 'pregnant' in data:
                analysis_data['pregnant'] = data.get('pregnant')
            if 'chest_pain' in data:
                analysis_data['chest_pain'] = data.get('chest_pain')
            if 'shortness_breath' in data:
                analysis_data['shortness_breath'] = data.get('shortness_breath')
            if 'heart_palpitations' in data:
                analysis_data['heart_palpitations'] = data.get('heart_palpitations')
            if 'frequent_thirst' in data:
                analysis_data['frequent_thirst'] = data.get('frequent_thirst')
            if 'blurred_vision' in data:
                analysis_data['blurred_vision'] = data.get('blurred_vision')
            if 'slow_healing' in data:
                analysis_data['slow_healing'] = data.get('slow_healing')
            if 'family_diabetes' in data:
                analysis_data['family_diabetes'] = data.get('family_diabetes')
            if 'menstrual_cycle' in data:
                analysis_data['menstrual_cycle'] = data.get('menstrual_cycle')
            if 'menopause_status' in data:
                analysis_data['menopause_status'] = data.get('menopause_status')
            
            ai_analysis, bmi_calc, bmi_category = analyze_health_with_ai(analysis_data)
        except Exception as analysis_error:
            print(f"Health analysis error: {str(analysis_error)}")
            import traceback
            traceback.print_exc()
            # Use basic fallback analysis
            age = int(data.get('age', 0))
            if age >= 50:
                risk_score = "High"
                packages = ["advanced", "master"]
            elif age >= 40:
                risk_score = "Moderate"
                packages = ["standard", "advanced"]
            else:
                risk_score = "Low"
                packages = ["basic", "standard"]
            
            ai_analysis = {
                "risk_score": risk_score,
                "recommended_packages": packages,
                "health_risks": {
                    "cardiovascular": "Standard screening recommended based on your profile",
                    "metabolic": "Routine health monitoring advised",
                    "respiratory": "No significant risks identified",
                    "other": "Preventive health checkup recommended"
                },
                "reasoning": f"Based on your health profile (age {age}), MAPIMS recommends comprehensive health screening to ensure your wellbeing. Our professional healthcare approach ensures you receive the best care.",
                "priority_factors": ["Age", "BMI", "Health Profile"]
            }
            bmi_calc = bmi
        
        # Store in database
        patient_document = {
            'name': data.get('name', ''),
            'age': int(data.get('age', 0)),
            'gender': data.get('gender', ''),
            'weight': float(data.get('weight', 0)),
            'height': float(data.get('height', 0)),
            'bmi': bmi_calc,
            'bmi_category': bmi_category,
            'symptoms': data.get('symptoms', ''),
            'medical_history': data.get('medical_history', ''),
            'family_history': data.get('family_history', ''),
            'lifestyle': data.get('lifestyle', ''),
            'phone': data.get('phone', ''),
            'email': data.get('email', ''),
            'consent': data.get('consent', False),
            'ai_analysis': ai_analysis,
            'submitted_at': datetime.utcnow(),
            'ip_address': request.remote_addr,
            'status': 'assessment_completed'
        }
        
        # Add female-specific fields if present
        if data.get('pregnant') is not None:
            patient_document['pregnant'] = data.get('pregnant')
            patient_document['menstrual_cycle'] = data.get('menstrual_cycle', '')
            patient_document['menopause_status'] = data.get('menopause_status', '')
            patient_document['birth_control'] = data.get('birth_control', False)
        
        # Add age > 45 specific fields if present
        if data.get('chest_pain') is not None or data.get('shortness_breath') is not None:
            patient_document['cardiac_health'] = {
                'chest_pain': data.get('chest_pain', False),
                'shortness_breath': data.get('shortness_breath', False),
                'heart_palpitations': data.get('heart_palpitations', False)
            }
            patient_document['diabetes_screening'] = {
                'frequent_thirst': data.get('frequent_thirst', False),
                'blurred_vision': data.get('blurred_vision', False),
                'slow_healing': data.get('slow_healing', False),
                'family_diabetes': data.get('family_diabetes', False)
            }
        
        # Add pediatric fields if present
        if data.get('vaccination_up_to_date') is not None:
            patient_document['pediatric_health'] = {
                'vaccination_up_to_date': data.get('vaccination_up_to_date', False),
                'growth_concerns': data.get('growth_concerns', ''),
                'school_performance': data.get('school_performance', ''),
                'allergies': data.get('pediatric_allergies', ''),
                'sleep_patterns_normal': data.get('sleep_patterns_normal', False)
            }
        
        try:
            result = patients_collection.insert_one(patient_document)
            patient_id = str(result.inserted_id)
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            patient_id = None
        
        # Store in session
        session['patient_id'] = patient_id
        session['assessment_data'] = data
        session['ai_analysis'] = ai_analysis
        
        return jsonify({
            'success': True,
            'patient_id': patient_id,
            'ai_analysis': ai_analysis,
            'bmi': bmi_calc,
            'bmi_category': bmi_category
        })
    
    except ValueError as ve:
        return jsonify({
            'success': False,
            'error': f'Invalid input data: {str(ve)}'
        }), 400
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Submit assessment error: {error_trace}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/analysis')
def analysis():
    """AI Analysis Results Page"""
    if 'patient_id' not in session:
        return redirect(url_for('assessment'))
    ai_analysis = session.get('ai_analysis', {})
    return render_template('analysis.html', ai_analysis=ai_analysis)

@app.route('/api/get-analysis')
def get_analysis():
    """Get AI analysis data"""
    if 'ai_analysis' not in session:
        return jsonify({'success': False, 'error': 'No analysis found'}), 404
    return jsonify({'success': True, 'analysis': session.get('ai_analysis', {})})

@app.route('/packages')
def packages():
    """Package Recommendation Page"""
    if 'patient_id' not in session:
        return redirect(url_for('assessment'))
    
    ai_analysis = session.get('ai_analysis', {})
    recommended_packages = ai_analysis.get('recommended_packages', ['standard'])
    
    return render_template('packages.html', 
                         packages=PACKAGES,
                         recommended_packages=recommended_packages,
                         addon_tests=ADDON_TESTS)

@app.route('/api/select-package', methods=['POST'])
def select_package():
    """Select package and add-ons"""
    try:
        data = request.json
        session['selected_package'] = data.get('package_id')
        session['selected_addons'] = data.get('addons', [])
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/booking')
def booking():
    """Booking Page"""
    if 'selected_package' not in session:
        return redirect(url_for('packages'))
    
    package_id = session.get('selected_package')
    package = PACKAGES.get(package_id, PACKAGES['standard'])
    addons = session.get('selected_addons', [])
    
    return render_template('booking.html',
                         package=package,
                         addons=addons,
                         addon_tests=ADDON_TESTS)

@app.route('/api/create-booking', methods=['POST'])
def create_booking():
    """Create booking"""
    try:
        if not request.is_json:
            return jsonify({'success': False, 'error': 'Invalid request format'}), 400
            
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data received'}), 400
        
        patient_id = session.get('patient_id')
        
        if not patient_id:
            return jsonify({'success': False, 'error': 'No patient data found. Please complete the assessment first.'}), 400
        
        # Validate required fields
        if not data.get('booking_date'):
            return jsonify({'success': False, 'error': 'Booking date is required'}), 400
        
        # Set default booking time to 8:00 AM if not provided
        booking_time = data.get('booking_time', '08:00')
        
        # Sample type defaults to hospital if not provided
        sample_type = data.get('sample_type', 'hospital')
        
        # Get patient data
        try:
            patient = patients_collection.find_one({'_id': ObjectId(patient_id)})
            if not patient:
                return jsonify({'success': False, 'error': 'Patient record not found'}), 404
        except Exception as e:
            app.logger.error(f"Error finding patient: {str(e)}")
            return jsonify({'success': False, 'error': 'Invalid patient ID'}), 400
        
        # Parse booking date
        try:
            booking_date = datetime.strptime(data.get('booking_date'), '%Y-%m-%d')
        except ValueError as e:
            return jsonify({'success': False, 'error': 'Invalid booking date format'}), 400
        
        booking_document = {
            'patient_id': patient_id,
            'patient_name': patient.get('name', ''),
            'patient_phone': patient.get('phone', ''),
            'patient_email': patient.get('email', ''),
            'package_id': data.get('package_id'),
            'package_name': data.get('package_name'),
            'package_price': data.get('package_price', 0),
            'addons': data.get('addons', []),
            'total_price': data.get('total_price', 0),
            'booking_date': booking_date,
            'booking_time': booking_time,
            'sample_type': sample_type,
            'address': data.get('address', ''),
            'fasting_consent': data.get('fasting_consent', False),
            'payment_status': 'pending',
            'booking_status': 'confirmed',
            'created_at': datetime.utcnow(),
            'booking_reference': f"MAP{datetime.now().strftime('%Y%m%d%H%M%S')}"
        }
        
        # Insert booking into database
        try:
            result = bookings_collection.insert_one(booking_document)
            booking_id = str(result.inserted_id)
            app.logger.info(f"Booking created: {booking_id} for patient {patient_id}")
        except Exception as e:
            app.logger.error(f"Database error creating booking: {str(e)}")
            return jsonify({'success': False, 'error': 'Failed to save booking to database'}), 500
        
        # Update patient status
        try:
            patients_collection.update_one(
                {'_id': ObjectId(patient_id)},
                {'$set': {'status': 'booking_completed', 'booking_id': booking_id}}
            )
        except Exception as e:
            app.logger.warning(f"Failed to update patient status: {str(e)}")
            # Don't fail the booking if patient update fails
        
        # Store in session
        session['booking_id'] = booking_id
        session['booking_reference'] = booking_document['booking_reference']
        
        return jsonify({
            'success': True,
            'booking_id': booking_id,
            'booking_reference': booking_document['booking_reference']
        })
    
    except Exception as e:
        app.logger.error(f"Error creating booking: {str(e)}")
        import traceback
        app.logger.error(traceback.format_exc())
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'}), 500

@app.route('/confirmation')
def confirmation():
    """Booking Confirmation Page"""
    if 'booking_id' not in session:
        return redirect(url_for('landing'))
    
    booking_reference = session.get('booking_reference', '')
    return render_template('confirmation.html', booking_reference=booking_reference)

# ==================== ADMIN PANEL ====================

def admin_required(f):
    """Legacy decorator - use require_admin from security_config"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_authenticated') and not session.get('admin_logged_in'):
            if request.is_json:
                return jsonify({'success': False, 'error': 'Authentication required'}), 401
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/admin')
def admin_login():
    """Admin Login Page"""
    return render_template('admin/login.html')

@app.route('/admin/authenticate', methods=['POST'])
@rate_limit(limit_per_minute=5, limit_per_hour=20)
def admin_authenticate():
    """Admin authentication with secure password verification"""
    data = request.json
    username = SecurityConfig.sanitize_input(data.get('username', ''), 50)
    password = data.get('password', '')
    
    if not username or not password:
        return jsonify({'success': False, 'error': 'Username and password required'}), 400
    
    # Check for brute force attempts
    identifier = request.remote_addr
    if 'X-Forwarded-For' in request.headers:
        identifier = request.headers['X-Forwarded-For'].split(',')[0].strip()
    
    # Get admin user from database
    admin_user = admin_collection.find_one({'username': username})
    
    if admin_user:
        # Verify password hash
        if SecurityConfig.verify_password(password, admin_user.get('password_hash', '')):
            session['admin_authenticated'] = True
            session['admin_username'] = username
            session.permanent = True
            return jsonify({'success': True})
    
    # Log failed attempt
    app.logger.warning(f"Failed admin login attempt for username: {username} from {identifier}")
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    """Admin Dashboard"""
    # Get date filter parameters
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    # Build date filter
    date_filter = {}
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            date_filter['created_at'] = {'$gte': start_dt}
        except ValueError:
            pass
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
            if 'created_at' in date_filter:
                date_filter['created_at']['$lt'] = end_dt
            else:
                date_filter['created_at'] = {'$lt': end_dt}
        except ValueError:
            pass
    
    # Get statistics
    total_patients = patients_collection.count_documents({})
    total_bookings = bookings_collection.count_documents({})
    confirmed_bookings = bookings_collection.count_documents({'booking_status': 'confirmed'})
    
    # Get recent bookings with pagination
    query = bookings_collection.find(date_filter).sort('created_at', -1)
    total_bookings_count = bookings_collection.count_documents(date_filter)
    skip = (page - 1) * per_page
    recent_bookings = list(query.skip(skip).limit(per_page))
    total_pages = (total_bookings_count + per_page - 1) // per_page
    
    # Get top packages
    pipeline = [
        {'$match': {'package_id': {'$ne': None, '$exists': True}}},
        {'$group': {'_id': '$package_id', 'count': {'$sum': 1}}},
        {'$sort': {'count': -1}},
        {'$limit': 5}
    ]
    top_packages = list(bookings_collection.aggregate(pipeline))
    
    # Get top symptoms
    pipeline = [
        {'$match': {'$and': [
            {'symptoms': {'$ne': None}},
            {'symptoms': {'$ne': ''}},
            {'symptoms': {'$exists': True}}
        ]}},
        {'$group': {'_id': '$symptoms', 'count': {'$sum': 1}}},
        {'$sort': {'count': -1}},
        {'$limit': 5}
    ]
    top_symptoms = list(patients_collection.aggregate(pipeline))
    
    return render_template('admin/dashboard.html',
                         total_patients=total_patients,
                         total_bookings=total_bookings,
                         confirmed_bookings=confirmed_bookings,
                         recent_bookings=recent_bookings,
                         top_packages=top_packages,
                         top_symptoms=top_symptoms,
                         packages=PACKAGES,
                         start_date=start_date,
                         end_date=end_date,
                         page=page,
                         per_page=per_page,
                         total_pages=total_pages,
                         total_bookings_count=total_bookings_count)

@app.route('/admin/leads')
@admin_required
def admin_leads():
    """View all leads/patients"""
    # Get date filter parameters
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    # Build date filter
    date_filter = {}
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            date_filter['submitted_at'] = {'$gte': start_dt}
        except ValueError:
            pass
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
            if 'submitted_at' in date_filter:
                date_filter['submitted_at']['$lt'] = end_dt
            else:
                date_filter['submitted_at'] = {'$lt': end_dt}
        except ValueError:
            pass
    
    # Get patients with pagination
    query = patients_collection.find(date_filter).sort('submitted_at', -1)
    total_patients_count = patients_collection.count_documents(date_filter)
    skip = (page - 1) * per_page
    patients = list(query.skip(skip).limit(per_page))
    total_pages = (total_patients_count + per_page - 1) // per_page
    
    return render_template('admin/leads.html', 
                         patients=patients,
                         start_date=start_date,
                         end_date=end_date,
                         page=page,
                         per_page=per_page,
                         total_pages=total_pages,
                         total_patients_count=total_patients_count)

@app.route('/admin/bookings')
@admin_required
def admin_bookings():
    """View all bookings"""
    # Get date filter parameters
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    # Build date filter
    date_filter = {}
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            date_filter['created_at'] = {'$gte': start_dt}
        except ValueError:
            pass
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
            if 'created_at' in date_filter:
                date_filter['created_at']['$lt'] = end_dt
            else:
                date_filter['created_at'] = {'$lt': end_dt}
        except ValueError:
            pass
    
    # Get bookings with pagination
    query = bookings_collection.find(date_filter).sort('created_at', -1)
    total_bookings_count = bookings_collection.count_documents(date_filter)
    skip = (page - 1) * per_page
    bookings = list(query.skip(skip).limit(per_page))
    total_pages = (total_bookings_count + per_page - 1) // per_page
    
    return render_template('admin/bookings.html', 
                         bookings=bookings, 
                         packages=PACKAGES,
                         start_date=start_date,
                         end_date=end_date,
                         page=page,
                         per_page=per_page,
                         total_pages=total_pages,
                         total_bookings_count=total_bookings_count)

@app.route('/admin/analytics')
@admin_required
def admin_analytics():
    """Analytics Dashboard"""
    from collections import Counter
    from datetime import datetime, timedelta
    
    # Get date filter and pagination parameters
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    risk_page = int(request.args.get('risk_page', 1))
    package_page = int(request.args.get('package_page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    # Build date filter for patients
    patient_date_filter = {}
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            patient_date_filter['submitted_at'] = {'$gte': start_dt}
        except ValueError:
            pass
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
            if 'submitted_at' in patient_date_filter:
                patient_date_filter['submitted_at']['$lt'] = end_dt
            else:
                patient_date_filter['submitted_at'] = {'$lt': end_dt}
        except ValueError:
            pass
    
    # Build date filter for bookings
    booking_date_filter = {}
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            booking_date_filter['created_at'] = {'$gte': start_dt}
        except ValueError:
            pass
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
            if 'created_at' in booking_date_filter:
                booking_date_filter['created_at']['$lt'] = end_dt
            else:
                booking_date_filter['created_at'] = {'$lt': end_dt}
        except ValueError:
            pass
    
    # Get basic stats
    total_patients = patients_collection.count_documents({})
    total_bookings = bookings_collection.count_documents({})
    confirmed_bookings = bookings_collection.count_documents({'booking_status': 'confirmed'})
    
    # Calculate revenue
    bookings_with_price = list(bookings_collection.find({'total_price': {'$exists': True}}))
    total_revenue = sum(booking.get('total_price', 0) for booking in bookings_with_price)
    
    # Calculate average risk score (with date filter)
    patients_with_analysis_query = {'ai_analysis.risk_score': {'$exists': True}}
    patients_with_analysis_query.update(patient_date_filter)
    patients_with_analysis = list(patients_collection.find(patients_with_analysis_query))
    risk_scores = []
    for patient in patients_with_analysis:
        risk = patient.get('ai_analysis', {}).get('risk_score', 'Moderate')
        if risk == 'Low':
            risk_scores.append(25)
        elif risk == 'Moderate':
            risk_scores.append(50)
        elif risk == 'High':
            risk_scores.append(75)
        elif risk == 'Critical':
            risk_scores.append(90)
    avg_risk_score = round(sum(risk_scores) / len(risk_scores), 1) if risk_scores else 0
    
    # Calculate conversion rate
    conversion_rate = round((confirmed_bookings / total_patients * 100), 1) if total_patients > 0 else 0
    
    # Package distribution
    package_counts = {}
    for booking in bookings_collection.find({'package_id': {'$exists': True}}):
        pkg_id = booking.get('package_id', 'unknown')
        package_counts[pkg_id] = package_counts.get(pkg_id, 0) + 1
    
    package_labels = []
    package_data = []
    for pkg_id, count in sorted(package_counts.items(), key=lambda x: x[1], reverse=True):
        pkg_name = PACKAGES.get(pkg_id, {}).get('name', pkg_id)
        package_labels.append(pkg_name)
        package_data.append(count)
    
    # Risk score distribution
    risk_distribution = Counter()
    for patient in patients_with_analysis:
        risk = patient.get('ai_analysis', {}).get('risk_score', 'Moderate')
        risk_distribution[risk] += 1
    
    risk_labels = ['Low', 'Moderate', 'High', 'Critical']
    risk_data = [risk_distribution.get(r, 0) for r in risk_labels]
    
    # Age distribution
    age_groups = {'0-20': 0, '21-30': 0, '31-40': 0, '41-50': 0, '51-60': 0, '60+': 0}
    for patient in patients_collection.find({'age': {'$exists': True}}):
        age = patient.get('age', 0)
        if age <= 20:
            age_groups['0-20'] += 1
        elif age <= 30:
            age_groups['21-30'] += 1
        elif age <= 40:
            age_groups['31-40'] += 1
        elif age <= 50:
            age_groups['41-50'] += 1
        elif age <= 60:
            age_groups['51-60'] += 1
        else:
            age_groups['60+'] += 1
    
    age_labels = list(age_groups.keys())
    age_data = list(age_groups.values())
    
    # Revenue trend (last 30 days)
    revenue_labels = []
    revenue_data = []
    for i in range(30, 0, -1):
        date = (datetime.now() - timedelta(days=i)).strftime('%m/%d')
        revenue_labels.append(date)
        start_date = datetime.now() - timedelta(days=i)
        end_date = datetime.now() - timedelta(days=i-1)
        day_revenue = sum(
            b.get('total_price', 0) for b in bookings_collection.find({
                'created_at': {'$gte': start_date, '$lt': end_date},
                'total_price': {'$exists': True}
            })
        )
        revenue_data.append(day_revenue)
    
    # Top risk factors (with pagination)
    all_priority_factors = []
    for patient in patients_with_analysis:
        factors = patient.get('ai_analysis', {}).get('priority_factors', [])
        all_priority_factors.extend(factors)
    
    factor_counts = Counter(all_priority_factors)
    all_risk_factors = []
    for factor, count in factor_counts.most_common():
        percentage = round((count / len(patients_with_analysis) * 100), 1) if patients_with_analysis else 0
        all_risk_factors.append({
            'name': factor,
            'count': count,
            'percentage': percentage
        })
    
    # Paginate risk factors
    total_risk_factors = len(all_risk_factors)
    risk_skip = (risk_page - 1) * per_page
    top_risk_factors = all_risk_factors[risk_skip:risk_skip + per_page]
    total_risk_pages = (total_risk_factors + per_page - 1) // per_page
    
    # Package performance (with date filter and pagination)
    all_package_performance = []
    for pkg_id, pkg_info in PACKAGES.items():
        pkg_query = {'package_id': pkg_id}
        pkg_query.update(booking_date_filter)
        pkg_bookings = list(bookings_collection.find(pkg_query))
        pkg_revenue = sum(b.get('total_price', pkg_info['price']) for b in pkg_bookings)
        avg_price = pkg_info['price']
        all_package_performance.append({
            'name': pkg_info['name'],
            'bookings': len(pkg_bookings),
            'revenue': pkg_revenue,
            'avg_price': avg_price
        })
    all_package_performance.sort(key=lambda x: x['revenue'], reverse=True)
    
    # Paginate package performance
    total_packages = len(all_package_performance)
    package_skip = (package_page - 1) * per_page
    package_performance = all_package_performance[package_skip:package_skip + per_page]
    total_package_pages = (total_packages + per_page - 1) // per_page
    
    # Monthly trends (last 6 months)
    monthly_labels = []
    monthly_patients = []
    monthly_bookings = []
    for i in range(5, -1, -1):
        month_start = datetime.now().replace(day=1) - timedelta(days=30*i)
        month_end = month_start + timedelta(days=30)
        month_label = month_start.strftime('%b %Y')
        monthly_labels.append(month_label)
        
        month_patients = patients_collection.count_documents({
            'submitted_at': {'$gte': month_start, '$lt': month_end}
        })
        month_bookings = bookings_collection.count_documents({
            'created_at': {'$gte': month_start, '$lt': month_end}
        })
        monthly_patients.append(month_patients)
        monthly_bookings.append(month_bookings)
    
    return render_template('admin/analytics.html',
                         total_patients=total_patients,
                         total_bookings=total_bookings,
                         confirmed_bookings=confirmed_bookings,
                         total_revenue=total_revenue,
                         avg_risk_score=avg_risk_score,
                         conversion_rate=conversion_rate,
                         package_labels=package_labels,
                         package_data=package_data,
                         risk_labels=risk_labels,
                         risk_data=risk_data,
                         age_labels=age_labels,
                         age_data=age_data,
                         revenue_labels=revenue_labels,
                         revenue_data=revenue_data,
                         top_risk_factors=top_risk_factors,
                         package_performance=package_performance,
                         monthly_labels=monthly_labels,
                         monthly_patients=monthly_patients,
                         monthly_bookings=monthly_bookings,
                         start_date=start_date,
                         end_date=end_date,
                         risk_page=risk_page,
                         package_page=package_page,
                         per_page=per_page,
                         total_risk_pages=total_risk_pages,
                         total_package_pages=total_package_pages,
                         total_risk_factors=total_risk_factors,
                         total_packages=total_packages)

@app.route('/admin/logout')
def admin_logout():
    """Admin logout - securely clears all session data"""
    session.clear()  # Clear all session data for security
    return redirect(url_for('admin_login'))

@app.route('/admin/export/leads')
@admin_required
def export_leads():
    """Export leads/patients to Excel"""
    # Get date filter parameters
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    
    # Build date filter (same logic as admin_leads)
    date_filter = {}
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            date_filter['submitted_at'] = {'$gte': start_dt}
        except ValueError:
            pass
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
            if 'submitted_at' in date_filter:
                date_filter['submitted_at']['$lt'] = end_dt
            else:
                date_filter['submitted_at'] = {'$lt': end_dt}
        except ValueError:
            pass
    
    # Get all patients matching the filter (no pagination for export)
    patients = list(patients_collection.find(date_filter).sort('submitted_at', -1))
    
    # Create Excel workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Leads"
    
    # Define header style
    header_fill = PatternFill(start_color="E31837", end_color="E31837", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF", size=12)
    
    # Write headers
    headers = ['S.No', 'Name', 'Age', 'Gender', 'Phone', 'Email', 'BMI', 'BMI Category', 
               'Risk Score', 'Submitted Date', 'Status']
    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num)
        cell.value = header
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center', vertical='center')
    
    # Write data
    for row_num, patient in enumerate(patients, 2):
        ws.cell(row=row_num, column=1, value=row_num - 1)
        ws.cell(row=row_num, column=2, value=patient.get('name', 'N/A'))
        ws.cell(row=row_num, column=3, value=patient.get('age', 'N/A'))
        ws.cell(row=row_num, column=4, value=patient.get('gender', 'N/A'))
        ws.cell(row=row_num, column=5, value=patient.get('phone', 'N/A'))
        ws.cell(row=row_num, column=6, value=patient.get('email', 'N/A'))
        ws.cell(row=row_num, column=7, value=patient.get('bmi', 'N/A'))
        ws.cell(row=row_num, column=8, value=patient.get('bmi_category', 'N/A'))
        risk_score = patient.get('ai_analysis', {}).get('risk_score', 'N/A') if patient.get('ai_analysis') else 'N/A'
        ws.cell(row=row_num, column=9, value=risk_score)
        submitted_at = patient.get('submitted_at')
        ws.cell(row=row_num, column=10, value=submitted_at.strftime('%Y-%m-%d %H:%M') if submitted_at else 'N/A')
        ws.cell(row=row_num, column=11, value=patient.get('status', 'N/A'))
    
    # Auto-adjust column widths
    for column in ws.columns:
        max_length = 0
        column_letter = column[0].column_letter
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = min(max_length + 2, 50)
        ws.column_dimensions[column_letter].width = adjusted_width
    
    # Save to BytesIO buffer
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    
    # Generate filename with date range
    filename = 'leads'
    if start_date and end_date:
        filename += f'_{start_date}_to_{end_date}'
    elif start_date:
        filename += f'_from_{start_date}'
    elif end_date:
        filename += f'_until_{end_date}'
    filename += '.xlsx'
    
    return send_file(buffer, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                     as_attachment=True, download_name=filename)

@app.route('/admin/export/bookings')
@admin_required
def export_bookings():
    """Export bookings to Excel"""
    # Get date filter parameters
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    
    # Build date filter (same logic as admin_bookings)
    date_filter = {}
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            date_filter['created_at'] = {'$gte': start_dt}
        except ValueError:
            pass
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
            if 'created_at' in date_filter:
                date_filter['created_at']['$lt'] = end_dt
            else:
                date_filter['created_at'] = {'$lt': end_dt}
        except ValueError:
            pass
    
    # Get all bookings matching the filter (no pagination for export)
    bookings = list(bookings_collection.find(date_filter).sort('created_at', -1))
    
    # Create Excel workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Bookings"
    
    # Define header style
    header_fill = PatternFill(start_color="E31837", end_color="E31837", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF", size=12)
    
    # Write headers
    headers = ['S.No', 'Reference', 'Patient Name', 'Patient Phone', 'Package', 
               'Total Amount (₹)', 'Booking Date', 'Time', 'Sample Type', 
               'Payment Status', 'Booking Status', 'Created Date']
    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num)
        cell.value = header
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center', vertical='center')
    
    # Write data
    for row_num, booking in enumerate(bookings, 2):
        ws.cell(row=row_num, column=1, value=row_num - 1)
        ws.cell(row=row_num, column=2, value=booking.get('booking_reference', 'N/A'))
        ws.cell(row=row_num, column=3, value=booking.get('patient_name', 'N/A'))
        ws.cell(row=row_num, column=4, value=booking.get('patient_phone', 'N/A'))
        ws.cell(row=row_num, column=5, value=booking.get('package_name', 'N/A'))
        ws.cell(row=row_num, column=6, value=booking.get('total_price', 0))
        booking_date = booking.get('booking_date')
        ws.cell(row=row_num, column=7, value=booking_date.strftime('%Y-%m-%d') if booking_date else 'N/A')
        ws.cell(row=row_num, column=8, value=booking.get('booking_time', 'N/A'))
        ws.cell(row=row_num, column=9, value=booking.get('sample_type', 'N/A'))
        ws.cell(row=row_num, column=10, value=booking.get('payment_status', 'N/A'))
        ws.cell(row=row_num, column=11, value=booking.get('booking_status', 'N/A'))
        created_at = booking.get('created_at')
        ws.cell(row=row_num, column=12, value=created_at.strftime('%Y-%m-%d %H:%M') if created_at else 'N/A')
    
    # Auto-adjust column widths
    for column in ws.columns:
        max_length = 0
        column_letter = column[0].column_letter
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = min(max_length + 2, 50)
        ws.column_dimensions[column_letter].width = adjusted_width
    
    # Save to BytesIO buffer
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    
    # Generate filename with date range
    filename = 'bookings'
    if start_date and end_date:
        filename += f'_{start_date}_to_{end_date}'
    elif start_date:
        filename += f'_from_{start_date}'
    elif end_date:
        filename += f'_until_{end_date}'
    filename += '.xlsx'
    
    return send_file(buffer, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                     as_attachment=True, download_name=filename)

# ==================== API ENDPOINTS ====================

@app.route('/api/packages')
def api_packages():
    """Get all packages"""
    return jsonify(PACKAGES)

@app.route('/api/addons')
def api_addons():
    """Get all add-on tests"""
    return jsonify(ADDON_TESTS)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
