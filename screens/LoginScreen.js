import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";

export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: "false",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      emailId: "",
      password: "",
      confirmPassword: "",
      currencyCode: "",
    };
  }

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate("Home");
        //return Alert.alert("Logged in Successfully");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
  };

  userSignUp = (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert("Password does not match!\nCheck your Password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          db.collection("users").add({
            First_Name: this.state.firstName,
            Last_Name: this.state.lastName,
            Phone_Number: this.state.phoneNumber,
            Email_ID: this.state.emailId,
            Address: this.state.address,
            IsItemRequestActive: false,
            Currency_Code: this.state.currencyCode,
          });
          return Alert.alert("User Added Successfully", "", [
            {
              text: "OK",
              onPress: () => this.setState({ isModalVisible: false }),
            },
          ]);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  };

  showModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <ScrollView style={{ backgroundColor: "lavender" }}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Register Yourself!</Text>
            <TextInput
              style={styles.formTextInput}
              placeholder={"First Name"}
              placeholderTextColor="black"
              onChangeText={(text) => {
                this.setState({
                  firstName: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={"Last Name"}
              placeholderTextColor="black"
              onChangeText={(text) => {
                this.setState({
                  lastName: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={"Phone Number"}
              placeholderTextColor="black"
              maxLength={10}
              keyboardType={"numeric"}
              onChangeText={(text) => {
                this.setState({
                  phoneNumber: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={"Address"}
              placeholderTextColor="black"
              multiline={true}
              onChangeText={(text) => {
                this.setState({
                  address: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={"Email ID"}
              placeholderTextColor="black"
              keyboardType={"email-address"}
              onChangeText={(text) => {
                this.setState({
                  emailId: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={"Choose a Password"}
              placeholderTextColor="black"
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({
                  password: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={"Confirm Password"}
              placeholderTextColor="black"
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({
                  confirmPassword: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={"Country Curreny Code"}
              placeholderTextColor="black"
              autoCapitalize="characters"
              maxLength={3}
              onChangeText={(text) => {
                this.setState({
                  currencyCode: text,
                });
              }}
            />
          </View>

          <View style={{ flex: 0.2, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                this.userSignUp(
                  this.state.emailId,
                  this.state.password,
                  this.state.confirmPassword
                )
              }
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
            <Text
              style={styles.cancelButtonText}
              onPress={() => {
                this.setState({ isModalVisible: false });
              }}
            >
              Cancel
            </Text>
          </View>
        </ScrollView>
      </Modal>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.showModal()}
        <View style={styles.profileContainer}>
          {this.showModal()}
          <Text style={styles.title}>Barter System App</Text>
          <Image
            source={require("../assets/image.png")}
            style={{ width: 300, height: 260 }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TextInput
            style={styles.loginBox}
            placeholder="Email ID"
            placeholderTextColor="black"
            keyboardType="email-address"
            onChangeText={(text) => {
              this.setState({
                emailId: text,
              });
            }}
          />
          <TextInput
            style={styles.loginBox}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="black"
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
          <TouchableOpacity
            style={[styles.button, { marginBottom: 20, marginTop: 50 }]}
            onPress={() => {
              this.userLogin(this.state.emailId, this.state.password);
            }}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ isModalVisible: true });
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lavender",
  },
  modalTitle: {
    fontSize: RFValue(33),
    color: "mediumorchid",
    margin: RFValue(10),
    fontWeight: "bold",
  },
  formTextInput: {
    width: "75%",
    height: RFValue(45),
    alignSelf: "center",
    borderColor: "mediumorchid",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  },
  registerButton: {
    width: "35%",
    height: RFValue(30),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: RFValue(10),
    marginTop: RFValue(10),
  },
  registerButtonText: {
    color: "mediumorchid",
    fontSize: RFValue(17),
    fontWeight: "bold",
  },
  cancelButtonText: {
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    marginTop: RFValue(10),
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lavender",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(50),
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    paddingBottom: 20,
    color: "mediumorchid",
    marginTop: RFValue(-40),
  },
  loginBox: {
    width: RFValue(250),
    height: RFValue(40),
    borderBottomWidth: 1.5,
    borderColor: "violet",
    fontSize: RFValue(20),
    margin: 10,
  },
  button: {
    width: RFValue(250),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "violet",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonText: {
    color: "black",
    fontWeight: "200",
    fontSize: RFValue(20),
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
});
