import firebase_admin
import google.cloud
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
    	#print(data)
    	#if request.method == 'POST':
    	#name=request.args.get('name','')
    	#alias=request.args.get('alias','')
    clidoc_ref=store.collection(u'transactions').document(tid)
    clidoc_ref.set({u'tid':tid,u'broker_id':broker_id,u'client_id':client_id,u'product_id':product_id,u'quantity':amount,u'status':status,u'transaction_type':transtype,u'type':action})
    return jsonify("Added Successfully")
# def adddata(tid,brkid,cliid,prdid,amount,status,timestamp,transtype,action):
    

if __name__== '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

