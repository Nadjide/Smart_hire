import React, { useState, useEffect } from 'react';
import { FlatList, Input, Button, VStack, IconButton, Icon, Box, Select, useToast, HStack, Text } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SERVER_IP } from '../config';

const themes = ["Comportement", "Motivation", "Éthique", "Compétences techniques", "Communication", "Leadership", "Résolution de problèmes", "Travail d'équipe"];

const EditQuestionnaireScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [questionnaire, setQuestionnaire] = useState({ category: category, questions: [] });
  const toast = useToast();

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await fetch(`${SERVER_IP}/questionnaires/${category}`);
        const data = await response.json();
        if (data && data.questions) {
          setQuestionnaire(data);
        } else {
          toast.show({
            description: "No data found for this questionnaire.",
            status: "error"
          });
        }
      } catch (error) {
        console.error("Failed to fetch questionnaire:", error);
        toast.show({
          description: "Failed to fetch questionnaire.",
          status: "error"
        });
      }
    };
    fetchQuestionnaire();
  }, [category]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${SERVER_IP}/questionnaires/${category}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaire),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Failed to update the questionnaire');
      
      alert('Questionnaire updated successfully');
      navigation.goBack();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleChangeQuestionField = (index, field, value) => {
    let newQuestions = [...questionnaire.questions];
    if (field === 'answers') {
      newQuestions[index].answers = value;
    } else {
      newQuestions[index] = { ...newQuestions[index], [field]: value };
    }
    setQuestionnaire({ ...questionnaire, questions: newQuestions });
  };

  const handleChangeAnswerField = (qIndex, aIndex, field, value) => {
    let newQuestions = [...questionnaire.questions];
    newQuestions[qIndex].answers[aIndex] = { ...newQuestions[qIndex].answers[aIndex], [field]: value };
    setQuestionnaire({ ...questionnaire, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    let newQuestions = [...questionnaire.questions, { theme: themes[0], content: '', answers: [{ text: '', score: 1 }, { text: '', score: 1 }, { text: '', score: 1 }] }];
    setQuestionnaire({ ...questionnaire, questions: newQuestions });
  };

  const renderItem = ({ item, index }) => (
    <Box key={index} bg="light.200" p="4" rounded="md" mb="3">
      <Select
        selectedValue={item.theme}
        onValueChange={(itemValue) => handleChangeQuestionField(index, 'theme', itemValue)}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <Icon as={AntDesign} name="check" size="5" />,
        }}
        mt="1"
        placeholder="Choisissez un thème"
      >
        {themes.map((theme, idx) => (
          <Select.Item key={idx} label={theme} value={theme} />
        ))}
      </Select>
      <Input
        mt="2"
        placeholder="Contenu de la question"
        value={item.content}
        onChangeText={(text) => handleChangeQuestionField(index, 'content', text)}
        py="2"
        px="3"
        fontSize="md"
      />
      {item.answers.map((answer, aIndex) => (
        <HStack key={aIndex} space={2} alignItems="center" mt="2">
          <Input
            flex={1}
            placeholder={`Réponse ${aIndex + 1}`}
            value={answer.text}
            onChangeText={(text) => handleChangeAnswerField(index, aIndex, 'text', text)}
            py="2"
            px="3"
            fontSize="md"
          />
          <Select
            selectedValue={answer.score.toString()}
            minWidth="80px"
            accessibilityLabel="Choisissez un score"
            placeholder="Score"
            _selectedItem={{
              bg: "cyan.600",
              endIcon: <Icon as={AntDesign} name="check" size="5" />,
            }}
            onValueChange={(itemValue) => handleChangeAnswerField(index, aIndex, 'score', parseInt(itemValue))}
          >
            <Select.Item label="1" value="1" />
            <Select.Item label="2" value="2" />
            <Select.Item label="3" value="3" />
          </Select>
        </HStack>
      ))}
    </Box>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack space={4} mt="5" px="4" flex={1}>
        <Input
          variant="filled"
          placeholder="Catégorie"
          value={questionnaire.category}
          onChangeText={(text) => setQuestionnaire({ ...questionnaire, category: text })}
          py="2"
          px="3"
          fontSize="md"
        />
        <FlatList
          data={questionnaire.questions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            <IconButton
              icon={<Icon as={AntDesign} name="plus" size="sm" />}
              borderRadius="full"
              _icon={{
                color: "white",
              }}
              _pressed={{
                bg: "muted.200",
              }}
              bg="cyan.500"
              onPress={handleAddQuestion}
              mt="2"
            />
          }
        />
        <Button mt="5" colorScheme="cyan" onPress={handleUpdate}>
          Modifier
        </Button>
      </VStack>
    </SafeAreaView>
  );
};

export default EditQuestionnaireScreen;