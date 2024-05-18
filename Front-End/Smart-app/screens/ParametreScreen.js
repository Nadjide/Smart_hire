import React, { useContext } from 'react';
import { VStack, Box, Heading, Avatar, Text, Center, Divider, HStack, Pressable, Icon } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../AuthContext';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const ParametreScreen = () => {
  const { userEmail } = useContext(AuthContext);
  const getFirstLetter = (email) => {
    return email ? email[0].toUpperCase() : '';
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack space={4} mt="2" px="4" flex={1}>
        <Center>
          <Avatar size="xl" bg="cyan.500">
            {getFirstLetter(userEmail)}
          </Avatar>
          <Text mt="3" fontSize="lg" fontWeight="bold">
            {userEmail}
          </Text>
        </Center>
        <Divider my="4" />
        <Box>
          <Heading size="md" mb="3">
            Profil
          </Heading>
          <VStack space={3}>
            <Pressable>
              <HStack space={3} alignItems="center">
                <Icon as={MaterialIcons} name="account-circle" size="6" color="cyan.500" />
                <Text fontSize="md">Informations personnelles</Text>
              </HStack>
            </Pressable>
            <Pressable>
              <HStack space={3} alignItems="center">
                <Icon as={MaterialIcons} name="security" size="6" color="cyan.500" />
                <Text fontSize="md">Sécurité</Text>
              </HStack>
            </Pressable>
          </VStack>
        </Box>
        <Divider my="4" />
        <Box>
          <Heading size="md" mb="3">
            Compte
          </Heading>
          <VStack space={3}>
            <Pressable>
              <HStack space={3} alignItems="center">
                <Icon as={AntDesign} name="setting" size="6" color="cyan.500" />
                <Text fontSize="md">Paramètres du compte</Text>
              </HStack>
            </Pressable>
            <Pressable>
              <HStack space={3} alignItems="center">
                <Icon as={MaterialIcons} name="notifications" size="6" color="cyan.500" />
                <Text fontSize="md">Notifications</Text>
              </HStack>
            </Pressable>
          </VStack>
        </Box>
        <Divider my="4" />
        <Box>
          <Heading size="md" mb="3">
            Confidentialité
          </Heading>
          <VStack space={3}>
            <Pressable>
              <HStack space={3} alignItems="center">
                <Icon as={MaterialIcons} name="privacy-tip" size="6" color="cyan.500" />
                <Text fontSize="md">Politique de confidentialité</Text>
              </HStack>
            </Pressable>
            <Pressable>
              <HStack space={3} alignItems="center">
                <Icon as={MaterialIcons} name="lock" size="6" color="cyan.500" />
                <Text fontSize="md">Changer de mot de passe</Text>
              </HStack>
            </Pressable>
          </VStack>
        </Box>
        <Divider my="4" />
        <Box>
          <Heading size="md" mb="3">
            Aide
          </Heading>
          <VStack space={3}>
            <Pressable>
              <HStack space={3} alignItems="center">
                <Icon as={MaterialIcons} name="help-outline" size="6" color="cyan.500" />
                <Text fontSize="md">Centre d'aide</Text>
              </HStack>
            </Pressable>
            <Pressable>
              <HStack space={3} alignItems="center">
                <Icon as={MaterialIcons} name="info" size="6" color="cyan.500" />
                <Text fontSize="md">À propos</Text>
              </HStack>
            </Pressable>
          </VStack>
        </Box>
      </VStack>
    </SafeAreaView>
  );
};

export default ParametreScreen;