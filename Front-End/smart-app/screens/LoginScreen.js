import React, { useState, useContext } from "react";
import AuthContext from "../AuthContext";
import { StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Button, Text, Input, VStack, Center, Box, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const { setIsLoggedIn, setUserEmail } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
  if (!email || !password) {
    setError("Tous les champs sont obligatoires");
    return;
  }

  const data = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch("http://10.6.0.107:8000/admin/connexion/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const responseData = await response.json();
    console.log(responseData);

    if (response.status === 200) {
      setIsLoggedIn(true);
      setUserEmail(responseData[0].email);
      console.log(responseData[0].email);
      navigation.navigate("Home");
    } else {
      setError("Identifiants invalides");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Erreur", error.message);
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
                  onPress={() => { }}
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
              onPress={handleLogin}
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
