import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { IconSymbol } from "./Icon";
import { LocationAlert } from "@/utils/types";

export function LocationReminder({ location }: { location: LocationAlert }) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => console.log("Clicked")}>
        <View style={styles.inside}>
          <IconSymbol
            name="location.fill"
            color="#fef7ff"
            style={{
              backgroundColor: "#64558e",
              borderRadius: 20,
              padding: 4,
            }}
          />
          <View>
            <Text style={{ fontWeight: "bold" }}>{location.title}</Text>
            <Text>{`${location.flow === "enter" ? "Arrive at" : "Leaving"} ${
              location.latitude
            }`}</Text>
          </View>
          <IconSymbol
            name="arrowtriangle.right.fill"
            color="inherit"
            style={{ marginLeft: "auto" }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fef7ff",
    borderColor: "#e5e1e6",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    alignSelf: "stretch",
  },
  inside: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
