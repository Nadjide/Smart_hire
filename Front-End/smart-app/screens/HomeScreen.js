import React, { useState, useEffect, useContext } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Box, Text, VStack, HStack, Avatar, Spacer, Pressable, IconButton, Icon, Input } from 'native-base';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import AuthContext from '../AuthContext';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [candidats, setCandidats] = useState([]);
  const { userEmail } = useContext(AuthContext);

  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        const response = await fetch('http://10.6.0.107:8000/candidats/');
        const data = await response.json();
        setCandidats(data);
      } catch (error) {
        console.error("Failed to fetch candidats:", error);
      }
    };

    fetchCandidats();
  }, []);

  const filteredCandidats = candidats.filter(candidat =>
    (candidat.nom && candidat.nom.toLowerCase().includes(searchText.toLowerCase())) ||
    (candidat.prénom && candidat.prénom.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <VStack flex={1} bg="white">
      <Box px="4" pt="4" pb="2">
        <Input
          placeholder="Rechercher"
          width="100%"
          borderRadius="4"
          py="3"
          px="1"
          fontSize="14"
          value={searchText}
          onChangeText={setSearchText}
          InputLeftElement={
            <Icon
              m="2"
              ml="3"
              size="6"
              color="gray.400"
              as={<Fontisto name="search" />}
            />
          }
        />
      </Box>
      <Text>Email de l'utilisateur : {userEmail}</Text>
      <FlatList
        data={filteredCandidats}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Box
            alignItems="center"
            m="2"
            bg="coolGray.100"
            p="4"
            rounded="lg"
            shadow={2}
            maxW="80"
            minW="80"
          >
            <VStack space={2}>
              <HStack alignItems="center">
                <Avatar
                  size="48px"
                  // Ajoutez ici l'URL de l'image de l'avatar si disponible
                />
                <Spacer />
                <VStack>
                  <Text bold>{item.nom} {item.prénom}</Text>
                  <Text color="coolGray.600">{item.email}</Text>
                </VStack>
                <Spacer />
                <IconButton
                  icon={<Icon as={AntDesign} name="right" />}
                  borderRadius="full"
                  _icon={{
                    color: "coolGray.600",
                    size: "md",
                  }}
                  _pressed={{
                    bg: "coolGray.200:alpha.20",
                  }}
                />
              </HStack>
              <Text color="coolGray.800">Né(e) le: {item.date_de_naissance}</Text>
              <Text color="coolGray.400">Tél: {item.téléphone}</Text>
            </VStack>
            <Pressable
              mt="3"
              py="3"
              bg="blue.500"
              rounded="full"
              _pressed={{ bg: "blue.600" }}
            >
              <Text bold color="white" textAlign="center">
                Voir le profil
              </Text>
            </Pressable>
          </Box>
        )}
        keyExtractor={(item) => item._id}
      />
    </VStack>
  );
}
