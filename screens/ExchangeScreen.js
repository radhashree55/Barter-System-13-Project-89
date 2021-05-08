import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";

export default class ExchangeScreen extends Component {
  constructor() {
    super();
    this.state = {
      userName: firebase.auth().currentUser.email,
      itemName: "",
      itemValue: "",
      itemDescription: "",
      IsItemRequestActive: "",
      requestedItemName: "",
      itemStatus: "",
      requestId: "",
      userDocId: "",
      docId: "",
      currencyCode: "",
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addItem = (itemName, itemDescription, itemValue) => {
    var userName = this.state.userName;
    var randomRequestId = this.createUniqueId();
    db.collection("items_for_exchange").add({
      user_name: userName,
      item_name: itemName,
      item_value: itemValue,
      item_description: itemDescription,
      request_id: randomRequestId,
      item_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    this.getItemRequest();
    db.collection("users")
      .where("Email_ID", "==", userName)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsItemRequestActive: true,
          });
        });
      });
    this.setState({
      itemName: "",
      itemDescription: "",
      itemValue: "",
      requestId: randomRequestId,
    });

    return Alert.alert("Item listed for Exchange!");
  };

  receivedItems = (itemName) => {
    var userName = this.state.userName;
    var requestId = this.state.requestId;
    db.collection("received_items").add({
      user_name: userName,
      item_name: itemName,
      request_id: requestId,
      itemStatus: "received",
    });
  };

  getIsItemRequestActive() {
    db.collection("users")
      .where("Email_ID", "==", this.state.userName)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsItemRequestActive: doc.data().IsItemRequestActive,
            userDocId: doc.id,
            currencyCode: doc.data().currency_code,
          });
        });
      });
  }

  getItemRequest = () => {
    // getting the requested item
    var itemRequest = db
      .collection("items_for_exchange")
      .where("user_name", "==", this.state.userName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().item_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedItemName: doc.data().item_name,
              itemStatus: doc.data().item_status,
              requestedItemValue: doc.data().item_value,
              docId: doc.id,
            });
          }
        });
      });
  };

  getData() {
    fetch(
      "http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1"
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        var currencyCode = this.state.currencyCode;
        var currency = responseData.rates.INR;
        var value = 69 / currency;
        console.log(value);
      });
  }

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("Email_ID", "==", this.state.userName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().First_Name;
          var lastName = doc.data().Last_Name;

          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var itemName = doc.data().item_name;

                //targert user id is the donor id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " Received the Item " + itemName,
                  notification_status: "unread",
                  item_name: itemName,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getItemRequest();
    this.getIsItemRequestActive();
    this.getData();
  }

  componentWillUnmount() {
    this.getData();
  }

  updateItemRequestStatus = () => {
    db.collection("requested_items").doc(this.state.docId).update({
      item_status: "received",
    });

    db.collection("users")
      .where("Email_ID", "==", this.state.userName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsItemRequestActive: false,
          });
        });
      });
  };

  render() {
    if (this.state.IsItemRequestActive === true) {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Item Status" navigation={this.props.navigation} />

          <View style={{ marginTop: 50 }}>
            <Text style={styles.requestedItemText}>
              Request 1 item at a time!
            </Text>
            <View style={styles.requestedStatusTitle}>
              <Text style={styles.requestedStatusText}>Item Name</Text>
              <Text style={styles.requestedItemText}>
                {this.state.requestedItemName}
              </Text>
            </View>
            <View style={styles.requestedStatusTitle}>
              <Text style={styles.requestedStatusText}>Item Value</Text>
              <Text style={styles.requestedItemText}>
                {this.state.requestedItemValue}
              </Text>
            </View>
            <View style={styles.requestedStatusTitle}>
              <Text style={styles.requestedStatusText}>Item Status</Text>
              <Text style={styles.requestedItemText}>
                {this.state.itemStatus}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: "75%",
              height: "6%",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              borderRadius: 10,
              backgroundColor: "lavender",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 8,
              },
              shadowOpacity: 0.44,
              shadowRadius: 10.32,
              elevation: 16,
              marginTop: 40,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateItemRequestStatus();
              this.receivedItems(this.state.requestedItemName);
            }}
          >
            <Text
              style={{
                color: "mediumorchid",
                fontSize: 19,
                fontWeight: "bold",
              }}
            >
              I Received the Item!
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Items" navigation={this.props.navigation} />
          <View
            style={{
              marginTop: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginTop: -30,
                marginBottom: 30,
              }}
            >
              Add an Item for Exchange with Others!
            </Text>
            <TextInput
              style={[styles.formTextInput]}
              placeholder={"Item Name"}
              placeholderTextColor="black"
              onChangeText={(text) => {
                this.setState({
                  itemName: text,
                });
              }}
              value={this.state.itemName}
            />
            <TextInput
              style={[styles.formTextInput]}
              placeholder={"Item Value"}
              placeholderTextColor="black"
              keyboardType="numeric"
              maxLength={8}
              onChangeText={(text) => {
                this.setState({
                  itemValue: text,
                });
              }}
              value={this.state.itemValue}
            />
            <TextInput
              style={[styles.formTextInput, { height: "50%" }]}
              multiline
              numberOfLines={15}
              placeholder={"Item Description"}
              placeholderTextColor="black"
              onChangeText={(text) => {
                this.setState({
                  itemDescription: text,
                });
              }}
              value={this.state.itemDescription}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addItem(
                  this.state.itemName,
                  this.state.itemDescription,
                  this.state.itemValue
                );
              }}
            >
              <Text
                style={{
                  color: "mediumorchid",
                  fontSize: RFValue(22),
                  fontWeight: "bold",
                }}
              >
                Add Item
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: "75%",
    height: RFValue(35),
    borderColor: "mediumorchid",
    borderRadius: RFValue(10),
    borderWidth: 1,
    marginTop: RFValue(15),
    padding: 10,
  },
  button: {
    width: "75%",
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "lavender",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: RFValue(20),
  },
  requestedStatusTitle: {
    borderColor: "mediumorchid",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10),
    margin: 10,
    marginTop: RFValue(20),
  },
  requestedStatusText: {
    fontWeight: "bold",
    fontSize: RFValue(20),
  },
  requestedItemText: {
    alignItems: "center",
    fontSize: RFValue(18),
    alignSelf: "center",
  },
});
