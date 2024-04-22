import React, { useState, useContext} from "react";
import { KeyboardAvoidingView, Platform, Alert } from "react-native";
import { VStack, Box, Center, Heading, Input, Button } from "native-base";
import AuthContext from "../AuthContext";
import { SERVER_IP } from "../config";

export default function LoginCandidatScreen({ navigation }) {
  const { setIsLoggedIn, setUserEmail } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateDeNaissance, setDateDeNaissance] = useState("");
  const [telephone, setTelephone] = useState("");

    const handleInscription = async () => {
  try {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
    if (!dateRegex.test(dateDeNaissance)) {
      throw new Error("La date de naissance doit être au format JJ/MM/AAAA");
    }

    const response = await fetch(`${SERVER_IP}/candidats/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        nom,
        prénom: prenom,
        date_de_naissance: dateDeNaissance,
        téléphone: telephone,
      }),
    });

    const responseData = await response.json();
    console.log(responseData);

    if (response.status === 200) {
      setIsLoggedIn(true);
      setUserEmail(responseData[0].email);
      navigation.navigate("Question");
    } else {
      Alert.alert("Erreur", "Une erreur est survenue");
    }

  }
  catch (error) {
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
        <Box safeArea p="2" py="8" w="90%" maxW="340">
          <Heading size="lg" textAlign="center" mb="6">
            Inscription Candidat
          </Heading>
          <VStack space={4}>
            <Input
              variant="filled"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              variant="filled"
              placeholder="Nom"
              value={nom}
              onChangeText={setNom}
            />
            <Input
              variant="filled"
              placeholder="Prénom"
              value={prenom}
              onChangeText={setPrenom}
            />
            <Input
              variant="filled"
              placeholder="Date de naissance (JJ/MM/AAAA)"
              keyboardType="default"
              value={dateDeNaissance}
              onChangeText={setDateDeNaissance}
            />
            <Input
              variant="filled"
              placeholder="Téléphone"
              keyboardType="phone-pad"
              value={telephone}
              onChangeText={setTelephone}
            />
            <Button mt="5" colorScheme="blue" onPress={handleInscription}>
              S'inscrire
            </Button>
          </VStack>
        </Box>
      </Center>
    </KeyboardAvoidingView>
  );
}
