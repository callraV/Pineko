from flask import Flask, jsonify, request, g
import datetime
import mysql.connector
import os
from passlib.hash import sha256_crypt

app = Flask(__name__)

UPLOAD_FOLDER = 'public/profile' 
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# db_config = {
#     'user': 'root',
#     'password': 'root',
#     'host': 'localhost',
#     'database': 'pinekodb',
#     'raise_on_warnings': True,
# }

db_config = {
    'user': os.getenv("DB_USERNAME"),
    'password': os.getenv("DB_PASSWORD"),
    'host': os.getenv("DB_HOST"),
    'database': os.getenv("DB_NAME"),
    'raise_on_warnings': True,
}


def get_db():
    if 'db' not in g:
        g.db = mysql.connector.connect(**db_config)
    return [g.db, g.db.cursor()]

# cleanup operations - close db
@app.teardown_appcontext
def teardown_appcontext(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# get all users 
@app.route("/api/users", methods =['GET'])
def get_users():
    cursor = get_db()[1]

    cursor.execute("SELECT * FROM user ORDER BY experience_points DESC")
    all_users = cursor.fetchall()
    
    return jsonify(all_users)

# login
@app.route('/api/login', methods =['GET', 'POST'])
def login():
    cursor = get_db()[1]

    user = request.get_json()

    email = user.get('email').lower() # ignore capitalization
    password = user.get('password')

    cursor.execute('SELECT * FROM user WHERE email = "%s"' % email)
    user_data = cursor.fetchone()

    if user_data:
        hashed_password_from_db = user_data[3]

        if sha256_crypt.verify(password, hashed_password_from_db):
            # Passwords match, user is authenticated
            return jsonify(user_data)
        else:
            # Incorrect password
            return jsonify("Incorrect password")

    else:
        # User not found
        return jsonify("User not found")

# register
@app.route('/api/register', methods =['GET', 'POST'])
def register():
    cursor = get_db()[1]
    conn = get_db()[0]

    new_user = request.get_json()

    username = new_user.get('username')
    email = new_user.get('email').lower() # ignore capitalization
    password = new_user.get('password')
    profile_pic_url = "profile/Default_Profile.jpg"
    creation_datetime = datetime.datetime.now()

    hashed_password = sha256_crypt.hash(password) # hash the password using sha256_crypt

    cursor.execute(
        'SELECT * FROM user WHERE username = "%s"' % username)

    username_exist = cursor.fetchone()

    if username_exist:
        return jsonify("Username has been taken. Please input another name")

    cursor.execute(
        'SELECT * FROM user WHERE email = "%s"' % email)

    email_exist = cursor.fetchone()

    if email_exist:
        return jsonify("Email has been registered. Log in to your account now")
    
    cursor.execute(
        'INSERT INTO user(username, email, password, profile_pic_url, account_creation_datetime) VALUES (%s, %s, %s, %s, %s)', (username, email, hashed_password, profile_pic_url, creation_datetime)
    )
    conn.commit()

    return jsonify("User registered")

# edit profile
@app.route('/api/profile/edit', methods =['GET', 'POST'])
def edit_profile():
    cursor = get_db()[1]
    conn = get_db()[0]

    edited_profile = request.get_json()

    user_id = edited_profile.get('user_id')
    username = edited_profile.get('username')
    password = edited_profile.get('password')
    profile_pic_url = edited_profile.get('profile_pic_url')

    if(username):
        cursor.execute(
            'SELECT * FROM user WHERE username = "%s"' % username)
        username_exist = cursor.fetchone()

        if username_exist:
            return jsonify("Duplicated username")
        
        cursor.execute('UPDATE user SET username = %s WHERE user_id = %s', (username, user_id))
        conn.commit()
    
    if(password):
        hashed_password = sha256_crypt.hash(password) # hash the password using sha256_crypt
        
        cursor.execute('UPDATE user SET password = %s WHERE user_id = %s', (hashed_password, user_id))
        conn.commit()
   
    cursor.execute('UPDATE user SET  profile_pic_url = %s WHERE user_id = %s', (profile_pic_url, user_id))
    conn.commit()

    cursor.execute(
        'SELECT * FROM user WHERE user_id = %s' % user_id)
    updated = cursor.fetchone()

    return jsonify(updated)

# upload profile picture 
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/profile/edit/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file and allowed_file(file.filename):
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        return jsonify({'message': 'File uploaded successfully'})

    return jsonify({'error': 'Invalid file format'})

# delete user
@app.route('/api/profile/delete', methods=['DELETE'])
def delete_user():
    cursor = get_db()[1]
    conn = get_db()[0]

    user = request.get_json()
    user_id = user.get("user_id")
    email = user.get('email').lower() # ignore capitalization
    password = user.get('password')

    cursor.execute('SELECT * FROM user WHERE email = "%s"' % email)
    user_data = cursor.fetchone()

    if user_data:
        hashed_password_from_db = user_data[3]

        if sha256_crypt.verify(password, hashed_password_from_db): # authenticate password
            
            cursor.execute('DELETE FROM user WHERE email = "%s"' % email)
            conn.commit()

            cursor.execute('DELETE FROM open_trade WHERE user_id = "%s"' % user_id)
            conn.commit()

            cursor.execute('DELETE FROM closed_trade WHERE user_id = "%s"' % user_id)
            conn.commit()

            cursor.execute('DELETE FROM taken_course WHERE user_id = "%s"' % user_id)
            conn.commit()

            return jsonify("User deleted successfully")
        else:  # incorrect password
            return jsonify("Incorrect password")

# open trade
@app.route('/api/trade/open', methods =['POST'])
def open_trade():
    cursor = get_db()[1]
    conn = get_db()[0]

    new_trade = request.get_json()

    user_id = new_trade.get('user_id')
    currency_pair = new_trade.get('currency_pair')
    price = new_trade.get('price')
    is_buy = new_trade.get('is_buy')
    quantity = new_trade.get('quantity')
    open_datetime = datetime.datetime.now()

    cursor.execute(
        'INSERT INTO open_trade (user_id, currency_pair, price, is_buy, quantity, open_datetime) VALUES (%s, %s, %s, %s, %s, %s)', (user_id, currency_pair, price, is_buy, quantity, open_datetime)
    )
    conn.commit()    

    trade_type = "Buy"
    if(is_buy ==0):
        trade_type = 'Sell'

    message = trade_type + 'ing ' + currency_pair 

    response_data = {'message': message, 'data': new_trade}
    return jsonify(response_data)

# get open trades
@app.route('/api/trade', methods =['GET'])
def get_trade():
    cursor = get_db()[1]

    user_id = request.args.get('user')

    cursor.execute('SELECT * FROM open_trade WHERE user_id = %s AND is_closed = 0' % user_id)
    user_trades = cursor.fetchall()

    cursor.execute('SELECT DISTINCT currency_pair FROM open_trade WHERE user_id = %s AND is_closed = 0' % user_id)
    user_trades_pairs = cursor.fetchall()
    
    return jsonify([user_trades, user_trades_pairs])

# get closed trades
@app.route('/api/trade/history', methods =['GET'])
def get_history():
    cursor = get_db()[1]

    user_id = request.args.get('user')
    
    cursor.execute('''
        SELECT
            ot.currency_pair,
            ot.is_buy,
            ot.price AS open_price,
            ct.close_price,
            ct.close_datetime,
            ct.profit_loss
        FROM open_trade AS ot
        INNER JOIN closed_trade AS ct ON ot.ot_id = ct.ot_id
        WHERE ot.user_id = %s
        ORDER BY ct.close_datetime DESC
    ''' % user_id)
    trades_history = cursor.fetchall()
    
    if trades_history:
        return jsonify(trades_history)
    else:
        return jsonify(["No data to show"])

# close trade
@app.route('/api/trade/close', methods =['POST'])
def close_trade():
    cursor = get_db()[1]
    conn = get_db()[0]
    
    trade = request.get_json()

    user_id = trade.get('user_id')
    ot_id = trade.get('ot_id')
    close_datetime = datetime.datetime.now()
    close_price = trade.get('close_price')
    profit_loss = trade.get('profit_loss')

    if profit_loss > 0:
        exp = profit_loss / 10
    else:
        exp = 0

    cursor.execute('SELECT * FROM open_trade WHERE ot_id = %s AND user_id = %s', (ot_id, user_id))
    closing_trade = cursor.fetchone()

    if closing_trade:
        cursor.execute(
            'UPDATE open_trade SET is_closed = 1 WHERE ot_id = %s' % ot_id)
        conn.commit()

        cursor.execute(
            'INSERT INTO closed_trade (user_id, ot_id, close_datetime, close_price, profit_loss) VALUES (%s, %s, %s, %s, %s)', (user_id, ot_id, close_datetime, close_price, profit_loss)
        )
        conn.commit()
 
        cursor.execute('''
            UPDATE user
            SET
                balance = balance + %s,
                experience_points = experience_points + %s
            WHERE user_id = %s
        ''', (profit_loss, exp, user_id))
        conn.commit()

        cursor.execute('SELECT * FROM open_trade WHERE user_id = %s AND is_closed = 0' % user_id)
        user_trades = cursor.fetchall()

        cursor.execute('SELECT * FROM user WHERE user_id = %s' % user_id)
        new_balance = cursor.fetchone()

        return jsonify([user_trades, new_balance])
    else:
        return jsonify("Error while fetching open trade")

# level up
@app.route('/api/levelup', methods =['GET', 'POST'])
def level_up():
    cursor = get_db()[1]
    conn = get_db()[0]

    user_id = request.args.get('user')

    cursor.execute(
        'UPDATE user SET level = level + 1 WHERE user_id = %s' % user_id
    )
    conn.commit()

    cursor.execute(
        'SELECT * FROM user WHERE user_id = %s' % user_id)
    leveled_up = cursor.fetchone()

    return jsonify(leveled_up)

# get badges
@app.route('/api/badges', methods =['GET'])
def get_badges():
    cursor = get_db()[1]
    cursor.execute(
        'SELECT * FROM badge')
    all_badges = cursor.fetchall()

    return jsonify(all_badges)

# get new earned badges
@app.route('/api/badges/earned', methods=['GET'])
def get_earned_badges():
    cursor = get_db()[1]
    user_id = request.args.get('user')

    cursor.execute('SELECT * FROM badge')
    badges = cursor.fetchall()

    cursor.execute('SELECT * FROM taken_course WHERE user_id = %s' % user_id)
    taken_courses = cursor.fetchall()
    tc = len(taken_courses)

    cursor.execute('SELECT balance FROM user WHERE user_id = %s' % user_id)
    balance = cursor.fetchall()

    cursor.execute('SELECT level FROM user WHERE user_id = %s' % user_id)
    level = cursor.fetchall()

    earned_badges = []

    for badge in badges:
        if tc >= badge[4] and balance[0][0] >= badge[5] and level[0][0] >= badge[6]:
            earned_badges.append(badge[0])          

    return jsonify(earned_badges)



# get all course categories
@app.route('/api/category', methods =['GET'])
def get_categories():
    cursor = get_db()[1]

    cursor.execute(
        'SELECT * FROM category')
    all_category = cursor.fetchall()

    return jsonify(all_category)

# get courses
@app.route('/api/course', methods =['GET'])
def get_courses():
    cursor = get_db()[1]

    category_id = request.args.get('category')

    cursor.execute(
        'SELECT course_id, course_title FROM course WHERE category_id = %s' % category_id)
    courses = cursor.fetchall()

    if courses:
        return jsonify(courses)
    else:
        return jsonify(["No data to show"])

# get course text
@app.route('/api/course/text', methods =['GET'])
def get_course_text():
    cursor = get_db()[1]

    course_id = request.args.get('course')

    cursor.execute(
        'SELECT course_text FROM course WHERE course_id = %s' % course_id)
    course_text = cursor.fetchone()

    return jsonify(course_text)

# get quiz
@app.route('/api/quiz', methods =['GET'])
def get_quiz():
    cursor = get_db()[1]
    course_id = request.args.get('course')

    cursor.execute(
        'SELECT * FROM quiz WHERE course_id = %s' % course_id)
    quiz = cursor.fetchone()

    return jsonify(quiz)

# get taken courses
@app.route('/api/course/taken', methods =['GET'])
def get_taken_course():
    cursor = get_db()[1]
    user_id = request.args.get('user')

    cursor.execute(
        'SELECT * FROM taken_course WHERE user_id = %s' % user_id)
    taken_courses = cursor.fetchall()

    if taken_courses:
        return jsonify(taken_courses)
    else:
        return jsonify(["No data to show"])

# get taken course record
@app.route('/api/course/taken/record', methods =['GET'])
def get_taken_course_record():
    cursor = get_db()[1]

    user_id = request.args.get('user')
    course_id = request.args.get('course')

    cursor.execute('SELECT * FROM taken_course WHERE user_id = %s AND course_id = %s', (user_id, course_id))
    course_record = cursor.fetchall()

    return jsonify(course_record)

# complete course / submit quiz
@app.route('/api/quiz/submit', methods =['GET', 'POST'])
def submit_quiz():
    cursor = get_db()[1]
    conn = get_db()[0]

    taken_quiz = request.get_json()
    
    user_id = taken_quiz.get('user_id')
    course_id = taken_quiz.get('course_id')
    user_answer = taken_quiz.get('user_answer')
    result = taken_quiz.get('result')
    datetime_taken = datetime.datetime.now()
    if result == "W":
        exp = 20 
    else:
        exp = 0

    cursor.execute(
        'INSERT INTO taken_course (user_id, course_id, user_answer, result, datetime_taken) VALUES (%s, %s, %s, %s, %s)', (user_id, course_id, user_answer, result, datetime_taken)
    )
    conn.commit()
    
    cursor.execute('SELECT * FROM taken_course WHERE user_id = %s AND course_id = %s', (user_id, course_id))
    submitted_quiz = cursor.fetchall()

    cursor.execute('''
        UPDATE user
        SET
            experience_points = experience_points + %s
        WHERE user_id = %s
    ''', (exp, user_id))
    conn.commit()

    return jsonify(submitted_quiz)


