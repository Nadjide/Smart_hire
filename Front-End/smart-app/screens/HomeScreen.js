import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Box, Text, VStack, HStack, Avatar, Spacer, Pressable, IconButton, Icon, Input } from 'native-base';
import { AntDesign, Fontisto } from '@expo/vector-icons';

export default function HomeScreen() {
  const users = [
    { id: '1', name: 'Charlotte Reynolds', location: 'Nice', review: 'Dernière revue', latestReview: 'Lorem ipsum ...' },
    { id: '2', name: 'Robert Reynolds', location: 'Nice', review: 'Dernière revue', latestReview: 'Lorem ipsum ...' },
    { id: '3', name: 'Loise Reynolds', location: 'Nice', review: 'Dernière revue', latestReview: 'Lorem ipsum ...' },
  ];

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
      <FlatList
        data={users}
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
                //   source={{
                //     uri: 'https://your-avatar-url.com',
                //   }}
                />
                <Spacer />
                <VStack>
                  <Text bold>{item.name}</Text>
                  <Text color="coolGray.600">{item.location}</Text>
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
              <Text color="coolGray.800">{item.review}</Text>
              <Text color="coolGray.400">{item.latestReview}</Text>
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
        keyExtractor={(item) => item.id}
      />
    </VStack>
  );
}

const styles = StyleSheet.create({

});
