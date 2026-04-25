from math import exp


def compute_score(data: dict) -> dict:
    age = data['age']
    income = data['income']
    loan_amount = data['loan_amount']
    term_months = data['term_months']
    credit_history_length = data['credit_history_length']
    num_open_loans = data['num_open_loans']
    employment_years = data['employment_years']
    has_mortgage = data['has_mortgage']
    has_car_loan = data['has_car_loan']
    region_risk = data['region_risk']
    interest_rate = data.get('interest_rate', 12.0)

    logit = (
        -4.0
        + 0.04 * (age - 30)
        - 0.00003 * income
        + 0.00001 * loan_amount
        - 0.05 * term_months
        + 0.1 * credit_history_length
        - 0.3 * num_open_loans
        + 0.15 * employment_years
        + (0.2 if has_mortgage else 0)
        + (0.1 if has_car_loan else 0)
        + 0.5 * region_risk
    )

    prob_default = 1 / (1 + exp(-logit))
    threshold = 0.4
    approved = prob_default < threshold

    score = int(850 - prob_default * 550)

    if prob_default < 0.2:
        risk_level = 'low'
    elif prob_default < 0.4:
        risk_level = 'medium'
    else:
        risk_level = 'high'

    monthly_rate = interest_rate / 100 / 12
    if monthly_rate == 0:
        monthly_payment = loan_amount / term_months
    else:
        monthly_payment = loan_amount * monthly_rate * (1 + monthly_rate) ** term_months / ((1 + monthly_rate) ** term_months - 1)

    total_overpayment = monthly_payment * term_months - loan_amount

    factor_keys = []
    if income > 40000:
        factor_keys.append('income_positive')
    if employment_years > 5:
        factor_keys.append('employment_positive')
    if credit_history_length > 3:
        factor_keys.append('history_positive')
    if 25 <= age <= 55:
        factor_keys.append('age_positive')
    if num_open_loans > 3:
        factor_keys.append('open_loans_negative')
    if region_risk > 0.5:
        factor_keys.append('region_risk_negative')

    negative_factors = [k for k in factor_keys if k.endswith('_negative')]

    recommendation_keys = []
    if prob_default > 0.35:
        recommendation_keys.append('reduce_loan_amount')
    if income < 30000:
        recommendation_keys.append('increase_income_proof')
    if num_open_loans > 2:
        recommendation_keys.append('pay_off_loans')
    if approved and not negative_factors and not recommendation_keys:
        recommendation_keys.append('all_good')

    return {
        'approved': approved,
        'probability_of_default': round(prob_default, 6),
        'score': score,
        'risk_level': risk_level,
        'monthly_payment': round(monthly_payment, 2),
        'total_overpayment': round(total_overpayment, 2),
        'factorKeys': factor_keys,
        'recommendationKeys': recommendation_keys,
    }
