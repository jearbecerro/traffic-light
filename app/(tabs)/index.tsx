
import FourWayIntersection from "@/components/4WayIntersection";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <FourWayIntersection />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    padding: 10,
  },
});

export default Home;
