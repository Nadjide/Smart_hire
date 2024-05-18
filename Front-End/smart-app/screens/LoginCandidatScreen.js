import React, { useState, useContext, useEffect } from "react";
import { KeyboardAvoidingView, Platform, Alert } from "react-native";
import { VStack, Box, Center, Heading, Input, Button, Text, Modal } from "native-base";
import AuthContext from "../AuthContext";
import { SERVER_IP } from "../config";

export default function LoginCandidatScreen({ navigation }) {
  const { setIsLoggedIn, setUserEmail } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateDeNaissance, setDateDeNaissance] = useState("");
  const [telephone, setTelephone] = useState("+33");
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEmail, setModalEmail] = useState("");

  useEffect(() => {
    if (email.length >= 2) validateEmail(email);
    if (dateDeNaissance.length >= 2) validateDate(dateDeNaissance);
    if (telephone.length >= 2) validatePhone(telephone);
  }, [email, dateDeNaissance, telephone]);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrors((prev) => ({
      ...prev,
      email: emailRegex.test(value) ? null : "Email invalide",
    }));
  };

  const validateDate = (value) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
    const isValidDate = dateRegex.test(value);
    if (isValidDate) {
      const [day, month, year] = value.split("/");
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      setErrors((prev) => ({
        ...prev,
        dateDeNaissance: age >= 18 ? null : "Vous devez avoir au moins 18 ans",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        dateDeNaissance: "La date de naissance doit être au format JJ/MM/AAAA",
      }));
    }
  };

  const validatePhone = (value) => {
    const phoneRegex = /^\+33\d{9}$/;
    setErrors((prev) => ({
      ...prev,
      telephone: phoneRegex.test(value) ? null : "Numéro de téléphone invalide",
    }));
  };

  const handleInscription = async () => {
    if (Object.values(errors).some((error) => error !== null)) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs avant de soumettre.");
      return;
    }

    try {
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
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", error.message);
    }
  };

  const handleDateChange = (value) => {
    const cleaned = value.replace(/\D/g, "");
    let formattedValue = cleaned;

    if (cleaned.length > 2) {
      formattedValue = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length > 4) {
      formattedValue = formattedValue.slice(0, 5) + '/' + cleaned.slice(4);
    }

    setDateDeNaissance(formattedValue);
    if (formattedValue.length === 10) validateDate(formattedValue);
  };

  const handlePhoneChange = (value) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("33")) {
      cleaned = cleaned.slice(2);
    }
    const formattedValue = "+33" + cleaned.slice(0, 9);
    setTelephone(formattedValue);
    if (formattedValue.length === 12) validatePhone(formattedValue);
  };

  const handleExistingCandidatLogin = async () => {
    if (!modalEmail) {
      Alert.alert("Erreur", "Veuillez entrer un email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(modalEmail)) {
      Alert.alert("Erreur", "Email invalide");
      return;
    }

    try {
      const response = await fetch(`${SERVER_IP}/candidats/`);
      const data = await response.json();
      const existingCandidat = data.find(candidat => candidat.email === modalEmail);

      if (existingCandidat) {
        setIsLoggedIn(true);
        setUserEmail(existingCandidat.email);
        setModalVisible(false);
        navigation.navigate("Question");
      } else {
        Alert.alert("Erreur", "Email non trouvé.");
      }
    } catch (error) {
      console.error("Failed to fetch candidats:", error);
      Alert.alert("Erreur", "Une erreur est survenue");
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
              onChangeText={(value) => {
                setEmail(value);
                if (value.length >= 2) validateEmail(value);
              }}
            />
            {errors.email && <Text color="red.500">{errors.email}</Text>}
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
              keyboardType="number-pad"
              value={dateDeNaissance}
              onChangeText={handleDateChange}
            />
            {errors.dateDeNaissance && <Text color="red.500">{errors.dateDeNaissance}</Text>}
            <Input
              variant="filled"
              placeholder="Téléphone"
              keyboardType="phone-pad"
              value={telephone}
              onChangeText={handlePhoneChange}
            />
            {errors.telephone && <Text color="red.500">{errors.telephone}</Text>}
            <Button mt="5" colorScheme="blue" onPress={handleInscription}>
              S'inscrire
            </Button>
            <Button mt="3" colorScheme="cyan" onPress={() => setModalVisible(true)}>
              Déjà Candidat ?
            </Button>
          </VStack>
        </Box>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Connexion Candidat</Modal.Header>
            <Modal.Body>
              <Input
                variant="filled"
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={modalEmail}
                onChangeText={setModalEmail}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button flex="1" colorScheme="cyan" onPress={handleExistingCandidatLogin}>
                Se connecter
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </KeyboardAvoidingView>
  );
}