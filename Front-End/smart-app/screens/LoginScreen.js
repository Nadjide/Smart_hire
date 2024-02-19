import React from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Text, Input, VStack, Center, Box, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
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
            />
            <Button
              mt="2"
              colorScheme="blue"
              _text={{ color: "white" }}
              onPress={() => navigation.navigate('Home', { screen: 'Home' })}
            >
              Sign In
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