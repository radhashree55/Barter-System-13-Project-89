import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";

export default class SettingsScreen extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      emailId: "",
      docId: "",
    };
  }

  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("Email_ID", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.Email_ID,
            firstName: data.First_Name,
            lastName: data.Last_Name,
            address: data.Address,
            phoneNumber: data.Phone_Number,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection("users").doc(this.state.docId).update({
      First_Name: this.state.firstName,
      Last_Name: this.state.lastName,
      Address: this.state.address,
      Phone_Number: this.state.phoneNumber,
    });

    Alert.alert("Profile Updated Successfully");
  };

  componentDidMount() {
    this.getUserDetails();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.12 }}>
          <MyHeader title="Settings" navigation={this.props.navigation} />
        </View>
        <View style={styles.formContainer}>
          <Text
            style={{
              marginTop: RFValue(-100),
              fontSize: RFValue(27),
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            UPDATE USER DETAILS
          </Text>
          <TextInput
            style={styles.formTextInput}
            placeholder={"First Name"}
            onChangeText={(text) => {
              this.setState({
                firstName: text,
              });
            }}
            value={this.state.firstName}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Last Name"}
            onChangeText={(text) => {
              this.setState({
                lastName: text,
              });
            }}
            value={this.state.lastName}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Phone Number"}
            maxLength={10}
            keyboardType={"numeric"}
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text,
              });
            }}
            value={this.state.phoneNumber}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Address"}
            multiline={true}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
            value={this.state.address}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.updateUserDetails();
            }}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 0.88,
    justifyContent: "center",
  },
  formTextInput: {
    width: "90%",
    height: RFValue(40),
    alignSelf: "center",
    borderColor: "mediumorchid",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: RFValue(20),
    padding: RFValue(10),
  },
  button: {
    width: "75%",
    height: RFValue(50),
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
    marginTop: RFValue(40),
    alignSelf: "center",
  },
  buttonText: {
    color: "mediumorchid",
    fontSize: RFValue(24),
    fontWeight: "bold",
  },
});
