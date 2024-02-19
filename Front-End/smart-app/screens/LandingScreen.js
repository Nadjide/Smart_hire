import React from "react";
import { Image } from "react-native";
import { Box, Center, Button, VStack, Text, Heading } from "native-base";

export default function LandingScreen({ navigation }) {
  return (
    <Center flex={1} bg="white">
      <Box safeArea p="4" w="90%" maxW="340" alignItems="center">
        <Image
          source={require("../assets/logo_smart_hire.png")}
          style={{ height: 150, width: 150, marginBottom: 10 }}
        />

        <Heading color="coolGray.800" mb="2">
          Bienvenue
        </Heading>
        <Text fontSize="md" color="coolGray.500" textAlign="center" mb="6">
          Connectez-vous en tant que Admin ou candidat pour continuer
        </Text>

        <VStack space={4} width="100%" mt="4">
          <Button
            size="lg"
            colorScheme="blue"
            onPress={() => navigation.navigate("Login")}
          >
            Admin
          </Button>
          <Button
            size="lg"
            variant="outline"
            colorScheme="blue"
            onPress={() => navigation.navigate("LoginCandidat")}
          >
            Candidat
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
