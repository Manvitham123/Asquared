from app import create_app

app = create_app()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
with app.app_context():
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.methods} -> {rule}")
