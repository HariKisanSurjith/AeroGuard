import requests
import json

url = 'http://localhost:8000/detect'
image_path = 'sharan.jpeg'

print(f"Sending request to {url} with image {image_path}...")
try:
    with open(image_path, 'rb') as img:
        files = {'file': (image_path, img, 'image/jpeg')}
        response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("Response JSON:")
            print(json.dumps(response.json(), indent=4))
        else:
            print(f"Error Response: {response.text}")
except Exception as e:
    print(f"Exception occurred: {e}")
