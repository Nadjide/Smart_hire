import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, VStack, Heading, Spinner, Center, Button, Icon, Fab, AlertDialog, useDisclose, FlatList } from 'native-base';
import { SERVER_IP } from '../config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

const QuestionnaireScreen = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedCategory, setSelectedCategory] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchQuestionnaires();
    }, [])
  );

  const fetchQuestionnaires = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_IP}/questionnaires/`);
      const data = await response.json();
      setQuestionnaires(data);
    } catch (error) {
      console.error("Failed to fetch questionnaires:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigation.navigate('CreateQuestionnaire');
  };

  const handleDelete = async (category) => {
    try {
      const response = await fetch(`${SERVER_IP}/questionnaires/${category}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete the questionnaire');
      fetchQuestionnaires();
      onClose();
    } catch (error) {
      console.error("Failed to delete questionnaire:", error);
    }
  };

  const openConfirmDialog = (category) => {
    setSelectedCategory(category);
    onOpen();
  };

  const renderItem = ({ item }) => (
    <Box borderWidth="1" borderColor="coolGray.300" p="5" rounded="md" mb="2">
      <Text fontSize="md" bold mb="2">
        Catégorie: {item.category}
      </Text>
      {item.questions.map((question, idx) => (
        <Box key={idx} mt="2">
          <Text bold>{question.theme}</Text>
          <Text>{question.content}</Text>
          {question.answers.map((answer, idx) => (
            <Text key={idx} fontSize="xs">
              Réponse {idx + 1}: {answer.text} (Score: {answer.score})
            </Text>
          ))}
        </Box>
      ))}
      <Button mt="2" colorScheme="primary" onPress={() => navigation.navigate('EditQuestionnaire', { category: item.category })}>
        Modifier
      </Button>
      <Button mt="2" colorScheme="danger" onPress={() => openConfirmDialog(item.category)}>
        Supprimer
      </Button>
    </Box>
  );

  return (
    <Box flex={1}>
      <VStack space={4} mt="4" px="5" flex={1}>
        <Heading size="lg">Liste des Questionnaires</Heading>
        {loading ? (
          <Center flex={1}>
            <Spinner color="emerald.500" accessibilityLabel="Chargement des questionnaires" />
          </Center>
        ) : (
          <FlatList
            data={questionnaires}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 100 }} // padding to make space for the FAB
          />
        )}
      </VStack>
      <Fab
        position="absolute"
        size="sm"
        icon={<Icon color="white" as={<Ionicons name="add-outline" />} size="sm" />}
        onPress={handleNavigate}
        renderInPortal={false}
        right={5}
        bottom={5}
        label="Créer Questionnaire"
      />
      <AlertDialog leastDestructiveRef={undefined} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Confirmation de suppression</AlertDialog.Header>
          <AlertDialog.Body>
            Êtes-vous sûr de vouloir supprimer ce questionnaire ?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose}>
                Annuler
              </Button>
              <Button colorScheme="danger" onPress={() => handleDelete(selectedCategory)}>
                Supprimer
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  );
}

export default QuestionnaireScreen;