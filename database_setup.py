import firebase_admin
import google.cloud
from datetime import datetime
from firebase_admin import credentials,firestore
from flask_cors import CORS, cross_origin


#firebase = pyrebase.initialize_app(config)

#db=firebase.database()


#db.child("names").push({"name":"Shah"})
from flask import *

app=Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


cred=credentials.Certificate("./config.json")
default_app = firebase_admin.initialize_app(cred)
store=firestore.client()
@app.route("/we",methods=['GET'])

def tr():
        return jsonify("hi hello")

@app.route("/transactions",methods=['POST'])
@cross_origin()
def transactions():
    data=request.json
    tid=data['tid']
    broker_id=data['broker_id']
    client_id=data['client_id']
    product_id=data['product_id']
    amount=data['amount']
    status=data['status']
    transtype=data['transaction_type']
    action=data['type']
    print("request hit")
    now = firestore.SERVER_TIMESTAMP
    # current_time = now.strftime("%H:%M:%S")
    print("Current Time =", now)
    print(tid)
    	#print(data)
    	#if request.method == 'POST':
    	#name=request.args.get('name','')
    	#alias=request.args.get('alias','')
    clidoc_ref=store.collection(u'transactions').document(tid)
    clidoc_ref.set({u'tid':tid,u'broker_id':broker_id,u'client_id':client_id,u'product_id':product_id,u'quantity':amount,u'status':status,u'transaction_type':transtype,u'type':action,u'time_stamp':now})
    return jsonify("Added Successfully")
# def adddata(tid,brkid,cliid,prdid,amount,status,timestamp,transtype,action):


@app.route("/execute",methods=['POST'])
@cross_origin()
def execute():
    data=request.json
    tid=data['tid']
    uid=data['uid']
    broker_id=data['broker_id']
    client_id=data['client_id']
    product_id=data['product_id']
    amount=int(data['amount'])
    #amt=data['amt']
    status=data['status']
    transtype=data['transaction_type']
    #timestamp=data['time_stamp']
    action=data['type']
    #blackkflag=false
    now = firestore.SERVER_TIMESTAMP
    print(tid)
    # current_time = now.strftime("%H:%M:%S")
    print("Current Time =", now)
    clidoc_ref=store.collection(u'executed').document(tid)
    clidoc_ref.set({u'tid':tid,u'broker_id':broker_id,u'client_id':client_id,u'product_id':product_id,u'quantity':amount,u'status':status,u'transaction_type':transtype,u'type':action,u'blacklist':"false",u'time_stamp':now})
    # clidoc_ref.update({u'time_stamp':now})
    clid_ref=store.collection(u'transactions').document(tid)
    clid_ref.update({u'status':status})
    if transtype == 'C':
        cldoc=store.collection(u'clients').document(str(uid))
        new_doc=cldoc.get()
        new_doc=new_doc.to_dict()
        actual=int(new_doc['stock_balance'])
        print(new_doc['stock_balance'])
        if action == "Buy":
            left=actual+amount
        else :
            left=actual-amount
        cldoc.set({u'stock_balance':left},merge=True)
        return jsonify("Suxx")
    elif transtype == 'P':
        cldoc=store.collection(u'brokers').document(str(uid))
        new_doc=cldoc.get()
        new_doc=new_doc.to_dict()
        print(new_doc['stock_balance'])
        actual=int(new_doc['stock_balance'])
        if action == "Buy":
            left=actual+amount
        else:
            left=actual-amount
        cldoc.set({u'stock_balance':left},merge=True)
        return jsonify("Suxx")
    # clid_ref.set({u'tid':tid,u'broker_id':broker_id,u'client_id':client_id,u'product_id':product_id,u'quantity':amount,u'status':status,u'transaction_type':transtype,u'type':action})
    #return jsonify("hekk")

@app.route("/updates",methods=['PUT'])
@cross_origin()
def change():
    data=request.json
    amt=data['amt']
    uid=data['uid']
    type=data['type']
    print(amt)
    if type == 'C' :
        clid_ref1=store.collection(u'clients').document(uid)
        #clid_ref.set({u'tid':tid,u'broker_id':broker_id,u'client_id':client_id,u'product_id':product_id,u'quantity':amount,u'status':status,u'transaction_type':transtype,u'type':action})
        clid_ref1.set({u'stock_balance':amt},merge=True)
        return jsonify("None")
    elif type == 'P':
        clid_ref2=store.collection(u'brokers').document(uid)
        clid_ref2.set({u'stock_balance':amt},merge=True)
        return jsonify("Added Successfully")
    #return jsonify("Hello")

if __name__== '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
