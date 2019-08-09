import firebase_admin
from google.cloud import storage
import os
from firebase_admin import credentials, firestore
import pandas as pd
from time import time
import time
import random
import matplotlib.pyplot as plt
from datetime import datetime

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "config.json"
cred = credentials.Certificate("config.json")
firebase_admin.initialize_app(cred)
store = firestore.client()
storageClient = storage.Client()
bucket = storageClient.get_bucket("american-express-c9e90.appspot.com")
doc_ref=store.collection(u'admin').document(u'NFZ8AWNon3nEZVwLPgdq')
doc = doc_ref.get()
doc=doc.to_dict()
time_threshold=int(doc["threshold_time"])
profitthreshold=int(doc["threshold_profit"])
def front_runner_detector(transaction_data):
    transactions=pd.DataFrame.from_records(transaction_data)
    for index,row in transactions.iterrows():
        now_timestamp = time.time()
        offset = datetime.fromtimestamp(now_timestamp) - datetime.utcfromtimestamp(now_timestamp)
        transactions.at[index,"time_stamp"]=row["time_stamp"]+offset
    first_time=transactions.loc[0,"time_stamp"]
    for i in range(len(transactions)):
        transactions.loc[i,"time_stamp"]-=first_time
    stocks=transactions.product_id.unique()
    front_runner_transactions=list()
    front_runner_transactions_images=list()
    for product in stocks:
        product_wise=pd.DataFrame(transactions.loc[transactions["product_id"]==product])
        client_list=product_wise.client_id.unique()
        executed_transactions=pd.DataFrame()
        for client in client_list:
            product_wise_client=pd.DataFrame(product_wise.loc[product_wise["client_id"] == client])
            executed_order=pd.DataFrame(product_wise_client.loc[product_wise_client["status"]=="executed"])
            executed_order=pd.DataFrame(executed_order.loc[executed_order["blacklist"]==False])
            executed_transactions=pd.concat([executed_transactions,executed_order])
        executed_transactions.sort_values("time_stamp",inplace=True)
        j=0
        buyp1x=list()
        buyc2x=list()
        buyp3x=list()
        buyp1y = list()
        buyc2y = list()
        buyp3y = list()
        while(j<len(executed_transactions)):
            flag=0
            p1time=0
            p3time=0
            p1prev=0
            p3prev=0
            p1money=0
            p3money=0
            p1y=0
            p3y=0
            p1orderID=0
            p3orderID=0
            maxc1=0
            c2x=0
            c2y=0
            tempj=j
            cliorderid=0
            while (j<len(executed_transactions) and executed_transactions.iloc[j]["type"]=="Buy" and executed_transactions.iloc[j]["transaction_type"]=="P" and (executed_transactions.iloc[j]["order_id"] in front_runner_transactions)==False):
                flag=1
                p1time=executed_transactions.iloc[j]["time_stamp"]
                p1money=int(executed_transactions.iloc[j]["quantity"])*float(executed_transactions.iloc[j]["price"])
                #p1prev=executed_transactions.iloc[j]["quantity"]
                p1orderID=executed_transactions.iloc[j]["order_id"]
                p1y=executed_transactions.iloc[j]["price"]
                j+=1

            if(flag==1):
                while (j < len(executed_transactions) and executed_transactions.iloc[j]["type"] == "Buy" and executed_transactions.iloc[j]["transaction_type"] == "C"):
                    flag=2
                    if(executed_transactions.iloc[j]["quantity"]*executed_transactions.iloc[j]["price"]>maxc1):
                        maxc1=int(executed_transactions.iloc[j]["quantity"])*float(executed_transactions.iloc[j]["price"])
                        cliorderid=executed_transactions.iloc[j]["order_id"]
                        c2x=executed_transactions.iloc[j]["time_stamp"]
                        c2y=executed_transactions.iloc[j]["price"]
                    j+=1
            if(flag==2):
                while (j < len(executed_transactions) and executed_transactions.iloc[j]["type"] == "Sell" and executed_transactions.iloc[j]["transaction_type"] == "P"):
                    flag=3
                    p3time = executed_transactions.iloc[j]["time_stamp"]
                    p3money = int(executed_transactions.iloc[j]["quantity"])*float(executed_transactions.iloc[j]["price"])
                    #p3prev = executed_transactions.iloc[j]["quantity"]
                    p3orderID = executed_transactions.iloc[j]["order_id"]
                    p3y = executed_transactions.iloc[j]["price"]
                    j += 1
            profit=p3money-p1money
            if(flag==3 and (p3time-p1time).total_seconds()<=time_threshold and profit>=profitthreshold):
                front_runner_transactions.append(p1orderID)
                front_runner_transactions.append(p3orderID)
                buyp1x.append(p1time)
                buyp3x.append(p3time)
                buyc2x.append(c2x)
                buyp1y.append(p1y)
                buyp3y.append(p3y)
                buyc2y.append(c2y)
                plt.figure(figsize=(10, 8))
                plt.xlabel('Order Id(Buy->Buy->Sell)')
                plt.ylabel('price (in dollars)')
                plt.title('Graph')
                plt.bar([p1orderID,cliorderid,p3orderID],[p1money,maxc1,p3money])
                image_name="frontrunner_"+str(random.randint(1,20))+ '.png'
                plt.savefig(image_name)
                imageBlob = bucket.blob("graphs/"+image_name)
                imageBlob.upload_from_filename(image_name)
                imageBlob.make_public()
                front_runner_transactions_images.append(imageBlob.public_url)
            if(flag==0):
                j=tempj+1
        j = 0
        sellp1x = list()
        sellc2x = list()
        sellp3x = list()
        sellp1y = list()
        sellc2y = list()
        sellp3y = list()
        while (j < len(executed_transactions)):
            flag = 0
            p1time = 0
            c2time = 0
            p3time = 0
            p1prev = 0
            c2prev = 0
            p3prev = 0
            p1money = 0
            c2money = 0
            p3money = 0
            p1orderID = 0
            p3orderID = 0
            maxc1 = 0
            c2x = 0
            c2y = 0
            p1y = 0
            p3y = 0
            tempj = j;
            cli_id=0
            while (j < len(executed_transactions) and executed_transactions.iloc[j]["type"] == "Sell" and executed_transactions.iloc[j]["transaction_type"] == "P" and (
                    executed_transactions.iloc[j]["order_id"] in front_runner_transactions) == False):
                flag = 1
                #print(executed_transactions.iloc[j])
                p1time = executed_transactions.iloc[j]["time_stamp"]
                p1money = int(executed_transactions.iloc[j]["quantity"])*float(executed_transactions.iloc[j]["price"])
                #p1prev = executed_transactions.iloc[j]["quantity"]
                p1orderID = executed_transactions.iloc[j]["order_id"]
                p1y = executed_transactions.iloc[j]["price"]
                j += 1
            if (flag == 1):
                while (j < len(executed_transactions) and executed_transactions.iloc[j]["SIDE"] == "Sell" and executed_transactions.iloc[j]["transaction_type"] == "C"):
                    flag = 2
                    #print(executed_transactions.iloc[j])
                    if (executed_transactions.iloc[j]["quantity"] * executed_transactions.iloc[j]["price"] < maxc1):
                        maxc1 = int(executed_transactions.iloc[j]["quantity"])*float(executed_transactions.iloc[j]["price"])
                        c2x = executed_transactions.iloc[j]["time_stamp"]
                        c2y = executed_transactions.iloc[j]["price"]
                        cli_id=executed_transactions.iloc[j]["order_id"]
                    j += 1
            if (flag == 2):
                while (j < len(executed_transactions) and executed_transactions.iloc[j]["SIDE"] == "Buy" and executed_transactions.iloc[j]["transaction_type"] == "P"):
                    flag = 3
                    #print(executed_transactions.iloc[j])
                    p3time = executed_transactions.iloc[j]["time_stamp"]
                    p3money = int(executed_transactions.iloc[j]["quantity"])*float(executed_transactions.iloc[j]["price"])
                    #p3prev = executed_transactions.iloc[j]["quantity"]
                    p3orderID = executed_transactions.iloc[j]["order_id"]
                    p3y = executed_transactions.iloc[j]["price"]
                    j += 1
            profit = p1money - p3money
            if (flag == 3 and (p3time - p1time).total_seconds()<= p1p3timeThreshold and profit >= profitThreshold):
                front_runner_transactions.append(p1orderID)
                front_runner_transactions.append(p3orderID)
                sellp1x.append(p1time)
                sellp3x.append(p3time)
                sellc2x.append(c2x)
                sellp1y.append(p1y)
                sellp3y.append(p3y)
                sellc2y.append(c2y)
                plt.figure(figsize=(10, 8))
                plt.xlabel('Order ID(Sell->Sell->Buy)')
                plt.ylabel('price (in dollars)')
                plt.title('Graph')
                plt.bar([p1orderID,cli_id,p3orderID],[p1money,maxc1,p3money])
                image_name="frontrunner_"+str(random.randint(1,20))+ '.png'
                plt.savefig(image_name)
                imageBlob = bucket.blob("graphs/"+image_name)
                imageBlob.upload_from_filename(image_name)
                imageBlob.make_public()
                front_runner_transactions_images.append(imageBlob.public_url)
                #print(profit)
            if (flag == 0):
                j = tempj + 1
    fradulent_ref = store.collection(u'admin').document(u'NFZ8AWNon3nEZVwLPgdq')
    if(len(front_runner_transactions)>0):
        fradulent_ref.set({u'blacklist_id': list(front_runner_transactions),u'blacklist_graph_id':list(front_runner_transactions_images)}, merge=True)
        trans_fraud=store.collection(u'executed')
        for i in list(front_runner_transactions):
            trans_fraud.document(u''+str(i)).set({u'blacklist':True},merge=True)
doc_ref = store.collection(u'executed')
transaction_data = []
docs = doc_ref.stream()
for doc in docs:
    dic=doc.to_dict()
    transaction_data.append(dic)
front_runner_detector(transaction_data)
