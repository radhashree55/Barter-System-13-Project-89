import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import { Icon } from "react-native-elements";
import CustomSideBarMenu from "./CustomSideBarMenu";
import SettingsScreen from "../screens/SettingsScreen";
import MyBartersScreen from "../screens/MyBartersScreen";
import NotificationScreen from "../screens/NotificationScreen";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="fontawesome5" />,
      },
    },
    MyBarters: {
      screen: MyBartersScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel: "My Barters",
      },
    },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
        drawerLabel: "Notifications",
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        drawerIcon: <Icon name="settings" type="fontawesome5" />,
        drawerLabel: "Settings",
      },
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: "Home",
  }
);
