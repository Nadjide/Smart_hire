import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Text, Input, VStack, Center, Box, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    try {
      const response = await fetch("http://10.6.0.107:8000/login/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        navigation.navigate("Home", { screen: "Home" });
        console.log(data);
      } else {
            setError("Identifiants invalidess");
          }
        } catch (error) {
          console.log(error);
          setError("Une erreur s'est produite");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Center flex={1} px="3" bg="white">
        <Box safeArea p="1" w="90%" maxW="290" py="8">
          <Text style={styles.title}>CONNEXION ADMIN</Text>
          <VStack space={4} mt="3">
            <Input
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="email" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              InputRightElement={
                <Icon
                  as={<MaterialIcons name="visibility-off" />}
                  size={5}
                  mr="2"
                  color="muted.400"
                  onPress={() => {}}
                />
              }
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChangeText={setPassword}
            />
            <Button
              mt="2"
              colorScheme="blue"
              _text={{ color: "white" }}
              onPress={() => navigation.navigate("Home")}
              // onPress={handleLogin}
            >
              Connexion
            </Button>
          </VStack>
        </Box>
      </Center>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
