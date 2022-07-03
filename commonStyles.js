import * as React from "react";
import { StyleSheet, Dimensions } from "react-native";

// common styles can be applied in various screens and components

const colors = require("nice-color-palettes/500");

export const { width, height } = Dimensions.get("window");
export const SIZE = 64;
export const ICON_SIZE = SIZE * 0.6;
export const SPACING = 10;
export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

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

const commonStyles = StyleSheet.create({
  headerBGColor: {
    backgroundColor: "#00BCD4",
  },

  bottomBGColor: {
    backgroundColor: "#00BCD4",
  },

  pageContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    //justifyContent: 'center',
  },

  todayDate: {
    width: "100%",
    textAlign: "center",
    top: 20,
    fontWeight: "bold",
    fontSize: 26,
    // borderWidth: 2,
    // borderColor: "red",
  },

  openingImageWrapper: {
    width: SCREEN_WIDTH * 0.85,
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

  // Question Stack StylesSheet
  questionHeaderWrapper: {
    padding: 20,
    width: "100%",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
  },

  questionText: {
    marginTop: -20,
    fontSize: 20,
    fontWeight: "bold",
  },

  answerContainer: {
    marginTop: -20,
    width: "100%",
    height: "78%",
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
  },

  inputBoxWrapper: {
    top: 40,
    padding: 8,
    margin: 10,
    width: "85%",
    height: "55%",
    shadowColor: "grey",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 11,
  },

  inputBox: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 20,
  },

  // Mood and Journal

  // Music Screen StyleSheet
  playMusic: {
    alignSelf: "center",
  },

  modalFirstView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  modalSecondView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  deleteWarningTitle: {
    margin: 5,
    fontSize: 20,
    fontWeight: "bold",
  },

  deleteWarningText: {
    margin: 5,
    fontWeight: "bold",
  },

  modalButton: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: "7%",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },

  modalButtonText: {
    fontWeight: "bold",
    color: "white",
  },

  modalInputBoxWrapper: {
    top: 40,
    padding: 8,
    width: "100%",
    height: SCREEN_HEIGHT * 0.3,
    shadowColor: "grey",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 11,
  },
});

export default commonStyles;
