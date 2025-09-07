from pymongo import MongoClient
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import random
import os
import numpy as np
import pandas as pd
import requests
import base64

mongodb_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongodb_uri)
db = client['Airline']
flights_collection = db['Flights']
flight_info_collection = db['Flight Info']

flights = flights_collection.find()
flight_data = pd.DataFrame(list(flights))

flight_info = flight_info_collection.find()
flight_info_data = pd.DataFrame(list(flight_info))

def generate_random_time():
    hour = random.randint(0, 23)
    minute = random.choice([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])
    return f"{hour:02}:{minute:02}"

def get_flight_duration(origin, destination):
    url = f"https://www.travelmath.com/flying-time/from/{origin}/to/{destination}"

    response = requests.get(url)

    if response.status_code != 200:
        return "Error fetching data"

    soup = BeautifulSoup(response.text, 'html.parser')

    duration_element = soup.find('h3', id='flyingtime')

    if duration_element:
        duration_text = duration_element.get_text(strip=True)
        return duration_text
    else:
        return "Duration not found"
    
def convert_to_minutes(duration):
    parts = duration.split(',')
    hours = int(parts[0].split(" ")[0])
    minutes = int(parts[1].split(" ")[1])
    total_minutes = hours * 60 + minutes
    return total_minutes

def round_to_nearest_five(minutes):
    return 5 * round(minutes / 5)

def create_time_window(duration):
    T = duration
    start_time = T - 10
    end_time = T + 30
    return np.arange(start_time, end_time + 1, 5)

def randomly_select_time(window):
    return random.choice(window)

def generate_departure_datetime():
    today = datetime.today() + timedelta(hours=5, minutes=30)
    future_day = (today + timedelta(days=30)).strftime('%Y-%m-%d')
    departure_date = future_day+"T"+generate_random_time()
    return departure_date

duration = []
converted_durations = []
dep_time = []
arr_time = []
dict = {}
for index, flight in flight_data.iterrows():
    key = (flight.originAirport, flight.destinationAirport)
    key_inv = (flight.destinationAirport, flight.originAirport)
    if key in dict:
        flight_duration = dict[key]
    elif key_inv in dict:
        flight_duration = dict[key_inv]
    else:
        flight_duration = get_flight_duration(flight.originAirport, flight.destinationAirport)
        dict[key] = flight_duration
    duration.append(flight_duration)
for dur in duration:
    total_minutes = convert_to_minutes(dur)
    rounded_minutes = round_to_nearest_five(total_minutes)
    time_window = create_time_window(rounded_minutes)
    selected_time = randomly_select_time(time_window)
    departure_date = datetime.strptime(generate_departure_datetime(), '%Y-%m-%dT%H:%M')
    difference = timedelta(hours=int(selected_time//60), minutes=int(selected_time%60))
    arrival_time = departure_date + difference
    dep_time.append(departure_date.strftime('%Y-%m-%dT%H:%M'))
    arr_time.append(arrival_time.strftime('%Y-%m-%dT%H:%M'))
    converted_durations.append(f"{selected_time//60}h {selected_time%60}m")

Duration = pd.DataFrame({
    'departureTime': dep_time,
    'newdepTime': dep_time,
    'arrivalTime': arr_time,
    'newarrTime': arr_time
})

def get_seats_available():
    economy_range = list(range(50, 201)) + [-1]
    business_range = list(range(10, 51)) + [-1]
    first_range = list(range(1, 31)) + [-1]

    economy_seats = random.choice(economy_range)
    business_seats = random.choice(business_range)

    if economy_seats == -1 and business_seats == -1:
        first_range = list(range(1, 41))
    first_seats = random.choice(first_range)

    seats_available = {
        'economy': economy_seats,
        'business': business_seats,
        'first': first_seats
    }

    return seats_available

def get_flight_price(origin, destination, date, seat_type, stops):
    if seat_type == "Economy":
        seat_class = "B"
    elif seat_type == "Business":
        seat_class = "D"
    elif seat_type == "First":
        seat_class = "E"

    if stops == 0:
        stop = "B"
    elif stops == 1:
        stop = "F"
    elif stops == 2:
        stop = "J"

    origin_coded = f"{origin}r"
    destination_coded = f"{destination}@"
    date_coded = f"\n{date}"

    origin_encoded = base64.b64encode(origin_coded.encode('utf-8')).decode('utf-8')
    destination_encoded = base64.b64encode(destination_coded.encode('utf-8')).decode('utf-8')
    date_encoded = base64.b64encode(date_coded.encode('utf-8')).decode('utf-8')

    url = f"https://www.google.com/travel/flights/search?tfs=CBwQAhog{date_encoded}KA{stop}qBwgB{origin_encoded}BwgB{destination_encoded}AUg{seat_class}cAGCAQsI____________AZgBAg&tfu=EgYIAhAAGAA&hl=en&gl=IN"
    response = requests.get(url)

    if response.status_code != 200:
        return "Error fetching data"
    soup = BeautifulSoup(response.text, 'html.parser')
    container = soup.select('li.pIav2d')

    prices = []
    for price in container:
        price_element = price.select_one('div.U3gSDe div.FpEdX span')
        if price_element.text.strip() != 'Price unavailable':
            # print(price_element.text.strip())
            prices.append(int(price_element.text.strip().replace('₹', '').replace(',', '')))
    if not len(prices) or not container:
        if stops == 0:
            return get_flight_price(origin, destination, date, seat_type, 1)
        elif stops == 1:
            return get_flight_price(origin, destination, date, seat_type, 2)
        else:
            return -1
    min_price = min(prices)
    # print(min_price)
    max_price = max(prices)
    # print(max_price)
    extreme = random.randint(min_price, max_price)
    left = random.randint(min_price, (min_price+max_price)//2)
    right = random.randint((min_price+max_price)//2, max_price)
    medium = (left + right)//2
    return random.choice([min_price, extreme, left, right, medium, max_price])

price = []
seats = []
date = generate_departure_datetime().split("T")[0]
for index, flight in flight_data.iterrows():
    seat = get_seats_available()
    if seat['economy'] != -1:
        economy = get_flight_price(flight.originAirport, flight.destinationAirport, date, "Economy", 0)
    else:
        economy = 0
    if seat['business'] != -1:
        business = get_flight_price(flight.originAirport, flight.destinationAirport, date, "Business", 0)
    else:
        business = 0
    if seat['first'] != -1:
        first = get_flight_price(flight.originAirport, flight.destinationAirport, date, "First", 0)
    else:
        first = 0
    if economy == -1:
        seat['economy'] = -1
        economy = 0
    if business == -1:
        seat['business'] = -1
        business = 0
    if first == -1:
        seat['first'] = -1
        first = 0
    seats.append(seat)
    price.append({'economy': economy, 'business': business, 'first': first})

Price = pd.DataFrame(pd.DataFrame(price).apply(lambda row: row.to_dict(), axis=1), columns=['prices'])
Seat = pd.DataFrame(pd.DataFrame(seats).apply(lambda row: row.to_dict(), axis=1), columns=['seatsAvailable'])

FLIGHT = pd.concat([flight_data, Duration, Seat, Price], axis=1)

for index, flight in FLIGHT.iterrows():
    entry = {
        'flightName': flight.flightName,
        'flightNumber': flight.flightNumber,
        'departureTime': flight.departureTime,
        'newdepTime': flight.newdepTime,
        'arrivalTime': flight.arrivalTime,
        'newarrTime': flight.newarrTime,
        'seatsAvailable': flight.seatsAvailable,
        'prices': flight.prices
    }
    flight_info_collection.insert_one(entry)
print("Flight Data Inserted Successfully")

current_date = datetime.now().strftime('%Y-%m-%d') + "T00:00"
query = {"departureTime": {"$lt": current_date}}

result = flight_info_collection.delete_many(query)
print(f"Deleted {result.deleted_count} documents.")

client.close()
