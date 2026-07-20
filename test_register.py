import requests
resp = requests.post("http://127.0.0.1:8000/auth/register", json={"username":"tomer2", "password":"password123", "name":"Tomer"})
print(resp.status_code)
print(resp.text)
