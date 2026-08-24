from flask import Flask,request,jsonify,redirect
from flask_cors import CORS
import mysql.connector
import string
import random

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="RS07@root",
        database="snaplink_db"
    )

app=Flask(__name__)
CORS(app)
#ye html dikhaega backend server pr
# @app.route('/', methods=['GET'])
# def home():
#     return "<h1>⚡ SnapLink Backend Zinda Hai! 🚀</h1><p>React Frontend se connect karke Generate button dabao.</p>"

#ye backend server pr json data dikhaega
#route1 home 
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status":"Online",
        "app_name":"SnapLink API Engine",
        "version":"1.0.0",
        "message":"SnapLink Backend"
    })
#🔗 ROUTE 2: URL SHORTENER
def generate_short_code(length=6):
    # A-Z, a-z aur 0-9 ko milakar ek list banayega
    characters = string.ascii_letters + string.digits
    # Unme se randomly 6 letters chun kar ek string banayega
    return ''.join(random.choice(characters) for _ in range(length))

@app.route('/api/shorten',methods=['POST'])
def shorten_url():
    data=request.get_json()
    if not data or 'longurl' not in data:
        return jsonify({"error":"where is url"}),400
    
    received_url=data['longurl']
    my_result=generate_short_code()
    
    try:
        db=get_db_connection()
        cursor=db.cursor(dictionary=True)
        
        # 👇 BAS YAHAN COLUMN KE NAAM THEEK KIYE HAIN 👇
        sql="INSERT INTO urls(long_url, short_code) VALUES(%s,%s)"
        cursor.execute(sql,(received_url, my_result))
        
        db.commit()
        cursor.close()
        db.close()
        
        shortened_link = f"http://localhost:5000/{my_result}"
        
        return jsonify({
            "success": True, 
            "original_url": received_url,
            "output": shortened_link # Yahan shortened_link bheja taaki click kar sakein
        }), 200
    except Exception as e:
        print("URL SHORTEN ERROR:", e)
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/signup',methods=['POST'])
def signup_fun():
    val=request.get_json()
    if not val or 'name' not in val or 'email' not in val or 'pass' not in val:
        return jsonify({"error":"where is data"}),400
    received_name=val['name']
    received_email=val['email']
    received_pass=val['pass']
    #database integration 
    try:
        db=get_db_connection()
        cursor=db.cursor()
        sql="INSERT INTO usersSignup(username,email,password) VALUES(%s,%s,%s)"
        values=(received_name,received_email,received_pass)
        cursor.execute(sql,values)
        db.commit()
        cursor.close()
        db.close()
        return jsonify({
        "success":True,
        "message":"Account created successfully in database!"
        })
    except mysql.connector.Error as err:
        # Agar user ka email pehle se database me hai, toh MySQL gussa ho jayega (Kyunki email UNIQUE hai)
        if err.errno == 1062:  # 1062 Duplicate entry ka error code hai
            return jsonify({"success": False, "error": "This email is already registered."}), 400
        else:
            return jsonify({"success": False, "error": str(err)}), 500


@app.route('/api/login',methods=['POST'])
def Login_fun():
    val=request.get_json()
    if not val or 'email' not in val or 'pass' not in val:
        return jsonify({"error":"where is data"}),400
    received_email=val['email']
    received_pass=val['pass']
    try:
        db=get_db_connection()
        cursor=db.cursor(dictionary=True)
        sql="SELECT * FROM usersSignup WHERE email=%s"
        cursor.execute(sql,(received_email,))
        user=cursor.fetchone()
        cursor.close()
        db.close()
        if not user:
            return jsonify({"success": False, "error": "Account not found. Please Sign Up first!"}), 404
        if user['password']==received_pass:
            return jsonify({
                "success": True, 
                "message": "Login Successful!",
                "username": user['username'] 
            }), 200
        else:
            # Password galat hai
            return jsonify({"success": False, "error": "Incorrect Password!"}), 401
    except Exception as e:
        print(" LOGIN ALARM error!", e)
        return jsonify({"success": False, "error": str(e)}), 500

#🔗 ROUTE 3: REDIRECT TO ORIGINAL URL
@app.route('/<short_code>', methods=['GET'])
def redirect_to_long_url(short_code):
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # 1. Database se pucho ki is 'short_code' ki asli 'long_url' kya hai?
        sql = "SELECT long_url FROM urls WHERE short_code = %s"
        cursor.execute(sql, (short_code,))
        result = cursor.fetchone() # Fetchone kyunki short_code unique hai, ek hi aayega
        
        cursor.close()
        db.close()
        
        # 2. Agar result mil gaya, toh asli link par redirect kar do
        if result:
            original_link = result['long_url']
            
            # Agar user ne link me 'http' ya 'https' nahi lagaya tha, toh hum laga dete hain taaki error na aaye
            if not original_link.startswith(('http://', 'https://')):
                original_link = 'http://' + original_link
                
            return redirect(original_link)
        
        # 3. Agar short code database me nahi mila (Kisine galat link type ki ho)
        else:
            return jsonify({"error": "Oops! This SnapLink doesn't exist."}), 404
            
    except Exception as e:
        print("REDIRECTION ERROR:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    
if __name__=='__main__':
    app.run(debug=True,port=5000)