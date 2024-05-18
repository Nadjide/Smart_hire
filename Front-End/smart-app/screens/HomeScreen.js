import React, { useState, useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { Box, Text, VStack, HStack, Avatar, Spacer, Pressable, IconButton, Icon, Input } from 'native-base';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../AuthContext';
import { SERVER_IP } from '../config';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [candidats, setCandidats] = useState([]);
  const { userEmail } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        const response = await fetch(`${SERVER_IP}/candidats/`);
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

  const getInitials = (nom, prénom) => {
    const firstInitial = nom ? nom.charAt(0).toUpperCase() : '';
    const secondInitial = prénom ? prénom.charAt(0).toUpperCase() : '';
    return `${firstInitial}${secondInitial}`;
  };

  return (
    <VStack flex={1} bg="white">
      <Box px="4" pt="4" pb="2">
        <Input
          placeholder="Rechercher"
          width="100%"
          borderRadius="10"
          py="3"
          px="3"
          fontSize="14"
          bg="coolGray.100"
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
      <Box px="4" py="2">
        <Text fontSize="md" color="gray.500">Email de l'utilisateur : {userEmail}</Text>
      </Box>
      <FlatList
        data={filteredCandidats}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Box
            alignItems="center"
            m="2"
            bg="white"
            p="4"
            rounded="lg"
            shadow={2}
            borderWidth={1}
            borderColor="coolGray.200"
          >
            <VStack space={2} w="100%">
              <HStack alignItems="center" space={2}>
                <Avatar
                  size="48px"
                  bg="cyan.500"
                >
                  {getInitials(item.nom, item.prénom)}
                </Avatar>
                <VStack flex={1}>
                  <Text bold fontSize="md">{item.nom} {item.prénom}</Text>
                  <Text color="coolGray.600" fontSize="sm">{item.email}</Text>
                </VStack>
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
              <Text color="coolGray.800" fontSize="sm">Né(e) le: {item.date_de_naissance}</Text>
              <Text color="coolGray.400" fontSize="sm">Tél: {item.téléphone}</Text>
              <Pressable
                mt="3"
                py="2"
                bg="cyan.500"
                rounded="full"
                _pressed={{ bg: "cyan.600" }}
                onPress={() => navigation.navigate('ProfileCandidat', { candidat: item })}
              >
                <Text bold color="white" textAlign="center">
                  Voir le profil
                </Text>
              </Pressable>
            </VStack>
          </Box>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </VStack>
  );
}