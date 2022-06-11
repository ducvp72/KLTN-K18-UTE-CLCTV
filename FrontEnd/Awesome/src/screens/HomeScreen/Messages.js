import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Headline, Caption, useTheme, Button } from "react-native-paper";
import overlay from "../../utils/overlay";

export const Messages = (props) => {
  const theme = useTheme();
  const backgroundColor = overlay(2, theme.colors.surface);
  return (
    <ScrollView
      style={backgroundColor}
      contentContainerStyle={[styles.scrollViewContent, { backgroundColor }]}
    >
      <Headline style={styles.centerText}>
        Send a message, get a message
      </Headline>
      <Caption style={styles.centerText}>
        Private Messages are private conversations between you and other people
        on Twitter. Share Tweets, media, and more!
      </Caption>
      <Button
        onPress={() => {}}
        style={styles.button}
        mode="contained"
        labelStyle={{ color: "white" }}
      >
        Writer a message
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  centerText: {
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
});
