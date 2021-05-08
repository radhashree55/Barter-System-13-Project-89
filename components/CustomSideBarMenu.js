import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";
import db from "../config";
import firebase from "firebase";

export default class CustomSideBarMenu extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      image: "#",
      name: "",
      docId: "",
    };
  }

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [8, 8],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile() {
    db.collection("users")
      .where("Email_ID", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().First_Name + " " + doc.data().Last_Name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 0.5,
            alignItems: "center",
            backgroundColor: "lavender",
            marginTop: 31,
          }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={"xlarge"}
            onPress={() => this.selectPicture()}
            showEditButton
          />

          <Text
            style={{
              fontWeight: "bold",
              fontSize: RFValue(25),
              padding: RFValue(10),
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {this.state.name}
          </Text>
        </View>
        <View style={{ flex: 0.8 }}>
          <DrawerItems {...this.props} />
        </View>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", width: "100%", height: "100%" }}
            onPress={() => {
              this.props.navigation.navigate("LoginScreen");
              firebase.auth().signOut();
            }}
          >
            <Icon
              name="logout"
              type="antdesign"
              color="grey"
              size={RFValue(20)}
              iconStyle={{ paddingLeft: RFValue(10) }}
            />
            <Text
              style={{
                fontSize: RFValue(15),
                fontWeight: "bold",
                marginLeft: RFValue(20),
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
