import React from "react";
import { VStack, Box, Center, Heading, Input, Button } from "native-base";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function LoginCandidatScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Center flex={1} px="3" bg="white">
        <Box safeArea p="2" py="8" w="90%" maxW="340">
          <Heading size="lg" textAlign="center" mb="6">
            Connexion Candidat
          </Heading>
          <VStack space={4}>
            <Input
              variant="filled"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input variant="filled" placeholder="Nom" />
            <Input variant="filled" placeholder="Prénom" />
            <Input
              variant="filled"
              placeholder="Date de naissance"
              keyboardType="number-pad"
            />
            <Input
              variant="filled"
              placeholder="Téléphone"
              keyboardType="phone-pad"
            />
            <Button
              mt="5"
              colorScheme="blue"
              onPress={() => navigation.navigate("Question")}
            >
              Se connecter
            </Button>
          </VStack>
        </Box>
      </Center>
    </KeyboardAvoidingView>
  );
}