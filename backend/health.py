from app.services.health_score import calculate_health_score

print(
    calculate_health_score(
        ph=5.4,
        turbidity=45,
        temperature=40,
        tds=1200
    )
)