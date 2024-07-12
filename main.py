import xml.etree.ElementTree as ET
from twilio.rest import Client
import pyttsx3
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import time
import traceback

app = Flask(__name__)
CORS(app)

# Twilio credentials
account_sid = 'ACfbdad9fa3970ca314bf156193517cec9'
auth_token = '36c75595afc6847e45a65b3fa347a8c5'
twilio_phone_number = '+17163515756'
user_phone_number = '+918870666787'

# Initialize pyttsx3 engine for text-to-speech
engine = pyttsx3.init()

# Global variables
not_verified_printed = False
call_made = False  # Declare as a global variable

def get_expected_data_from_database():
    try:
        connection = mysql.connector.connect(
            host='43.225.55.226',
            port=3306,
            user='eflavnbb_siraj',
            password='siraj2003',
            database='eflavnbb_future_democ'
        )

        cursor = connection.cursor(dictionary=True)

        # Assuming your table name is 'voters_details'
        query = "SELECT uid, name, gender, yob FROM voters_details"
        cursor.execute(query)

        # Fetch all rows as a list of dictionaries
        results = cursor.fetchall()

        if results:
            return results

    except Exception as e:
        print(f"Error fetching data from the database: {e}")

    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

    return None

# Retrieve expected data from the database
expected_data_list = get_expected_data_from_database()

@app.route('/receive_qr_data', methods=['POST'])
def receive_qr_data():
    global not_verified_printed, call_made

    # Reset global variables
    not_verified_printed = False

    data = request.data.decode('utf-8').strip()
    print("Received XML data:")
    print(data)

    details_verified = False
    matched_data = None
    connection = None  # Initialize connection variable

    print("Scanned Data:", data)

    try:
        connection = mysql.connector.connect(
            host='43.225.55.226',
            port=3306,
            user='eflavnbb_siraj',
            password='siraj2003',
            database='eflavnbb_future_democ'
        )

        cursor = connection.cursor(dictionary=True)

        # Compare the scanned data with each set of expected data
        for expected_data in expected_data_list:
            if compare_with_expected_data(data, expected_data):
                # Check if qr_verify is PENDING
                selectuid = expected_data['uid']
                print(selectuid)

                # Corrected SQL query with parameterized query to avoid SQL injection
                query = "SELECT `uid`, `name`, `gender`, `yob`, `qr_verify` , `mobile` FROM `voters_details` WHERE uid = %s"
                cursor.execute(query, (selectuid,))
                selected_data = cursor.fetchone()

                print("Selected Data:", selected_data)

                if selected_data and selected_data['qr_verify'] == 'PENDING':
                    print("Details verified.")
                    details_verified = True
                    matched_data = selected_data

                    # Update qr_verify to SUCCESSFUL
                    update_query = "UPDATE `voters_details` SET `qr_verify` = 'SUCCESSFUL' WHERE uid = %s"
                    cursor.execute(update_query, (selectuid,))
                    connection.commit()

                    # Generate and play the audio output saying "Details verified"
                    engine.say("Details verified")

                    # Check if the engine is not already running before calling runAndWait
                    if not engine._inLoop:
                        engine.runAndWait()
                    break
                
                else:
                    print("Details already verified")
                    engine.say("Details already verified")

                    # Call the user using Twilio if details are not verified and call not made yet
                    if not call_made:
                        call_user_with_twilio()
                        call_made = True
                    break
                
        else:
            if not details_verified and not not_verified_printed:
                print("Unwanted Data")
                not_verified_printed = True

                engine.say("Unwanted Data")

                # Add a small delay before calling runAndWait
                time.sleep(0.5)

                # Check if the engine is not already running before calling runAndWait
                if not engine._inLoop:
                    engine.runAndWait()

                if not_verified_printed and not call_made:
                    # Call the user using Twilio if details are not verified and call not made yet
                    call_user_with_twilio()
                    call_made = True

        if details_verified and matched_data:
            print("Matched Data:", matched_data)

    except Exception as e:
        print(f"Error processing data: {e}")
        print("Traceback:")
        traceback.print_exc()

    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

        if details_verified:
            return jsonify({"status": "success", "message": "Details verified successfully" , "getDetails": matched_data})
        elif not_verified_printed:
            return jsonify({"status": "success", "message": "Details not verified" , "getDetails": ""})
        else:
            return jsonify({"status": "success", "message": "Details already verified" , "getDetails": ""})

def compare_with_expected_data(xml_data, expected_data):
    try:
        root = ET.fromstring(xml_data)

        # Extract specific attributes from the XML
        actual_data = {
            "uid": root.attrib.get("uid", ""),
            "name": root.attrib.get("name", ""),
            "gender": root.attrib.get("gender", ""),
            "yob": root.attrib.get("yob", ""),
        }

        # Compare the extracted attributes with expected values
        if actual_data == expected_data:
            return True
    except ET.ParseError:
        # Handle unexpected data (not in XML format)
        return False

    return False

def call_user_with_twilio():
    # Initialize Twilio client
    client = Client(account_sid, auth_token)

    # Create a call
    call = client.calls.create(
        to=user_phone_number,
        from_=twilio_phone_number,
        url='http://demo.twilio.com/docs/voice.xml'  # Replace with your TwiML URL
    )

    print("Calling user...")

if __name__ == '__main__':
    app.run(port=5000)
