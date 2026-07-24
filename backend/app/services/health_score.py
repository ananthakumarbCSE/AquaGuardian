def calculate_health_score(ph: float, turbidity: float, temperature: float, tds: float):
    score = 0

    # pH Score
    if 6.5 <= ph <= 8.5:
        score += 25
    elif 6.0 <= ph < 6.5 or 8.5 < ph <= 9.0:
        score += 18
    else:
        score += 8

    # Turbidity Score
    if turbidity <= 5:
        score += 25
    elif turbidity <= 10:
        score += 18
    else:
        score += 8

    # Temperature Score
    if 20 <= temperature <= 30:
        score += 25
    elif 15 <= temperature <= 35:
        score += 18
    else:
        score += 8

    # TDS Score
    if tds <= 300:
        score += 25
    elif tds <= 500:
        score += 18
    else:
        score += 8

    if score >= 90:
        status = "Excellent"
    elif score >= 75:
        status = "Good"
    elif score >= 50:
        status = "Fair"
    elif score >= 25:
        status = "Poor"
    else:
        status = "Unsafe"

    return {
        "health_score": score,
        "status": status
    }