import * as React from "react";
import { StyleSheet, Dimensions } from "react-native";

const colors = require("nice-color-palettes/500");

export const { width, height } = Dimensions.get("window");
export const SIZE = 64;
export const ICON_SIZE = SIZE * 0.6;
export const SPACING = 10;

export const fonts = {
  montserratRegular: {
    fontFamily: "Montserrat_400Regular",
  },
  montserratBold: {
    fontFamily: "Montserrat_700Bold",
  },
  playfairDisplayRegular: {
    fontFamily: "PlayfairDisplay_400Regular",
  },
  playfiarDisplayMedium: {
    fontFamily: "PlayfairDisplay_500Medium",
  },
};

const styles = StyleSheet.create({
  headerBGColor: {
    backgroundColor: "#00BCD4",
  },

  bottomBGColor: {
    backgroundColor: "#00BCD4",
  },

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    //justifyContent: 'center',
  },

  openingImageWrapper: {
    width: width * 0.85,
    height: "30%",
    marginTop: 40,
    borderWidth: 8,
    borderColor: "white",
    borderRadius: 10,
    shadowColor: "grey",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 9,
  },

  openingImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  openingButton: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    marginRight: 20,
    padding: 10,
    borderRadius: 10,
    shadowColor: "grey",
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 9,
  },

  openingButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },

  playMusic: {
    alignSelf: "center",
  },
});

export default styles;
