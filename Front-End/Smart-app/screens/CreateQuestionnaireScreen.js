import React, { useState } from 'react';
import { VStack, Input, Button, IconButton, Icon, Box, Text, ScrollView, Select } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { SERVER_IP } from '../config';

const themes = ["Comportement", "Motivation", "Éthique", "Compétences techniques", "Communication", "Leadership", "Résolution de problèmes", "Travail d'équipe"];

function CreateQuestionnaireScreen() {
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [currentContent, setCurrentContent] = useState('');
  const [currentAnswers, setCurrentAnswers] = useState('');

  const handleAddQuestion = () => {
    const answersArray = currentAnswers.split(',').map(answer => answer.trim());
    if (currentTheme && currentContent && answersArray.length === 3) {
        setQuestions([...questions, { theme: currentTheme, content: currentContent, answers: answersArray }]);
        setCurrentContent('');
        setCurrentAnswers('');
    } else {
        alert('Veuillez remplir correctement les champs avec 3 réponses');
    }
};

  const handleSubmit = async () => {
    const body = { category, questions };
    try {
      const response = await fetch(`${SERVER_IP}/questionnaires/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Failed to create questionnaire');
      alert('Questionnaire crée avec succès');
      setCategory('');
      setQuestions([]);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <ScrollView>
      <VStack space={4} mt="5" px="4">
        <Input
          variant="filled"
          placeholder="Catégorie"
          value={category}
          onChangeText={setCategory}
          py="2"
          px="3"
          fontSize="md"
        />
        <Select
          selectedValue={currentTheme}
          minWidth="200"
          accessibilityLabel="Choose Theme"
          placeholder="Choisissez un thème"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <Icon as={AntDesign} name="check" size="5" />,
          }}
          mt="1"
          onValueChange={itemValue => setCurrentTheme(itemValue)}
        >
          {themes.map((theme, index) => (
            <Select.Item key={index} label={theme} value={theme} />
          ))}
        </Select>
        <Input
          variant="filled"
          placeholder="Contenu de la question"
          value={currentContent}
          onChangeText={setCurrentContent}
          py="2"
          px="3"
          fontSize="md"
          mb="2"
        />
        <Input
          variant="filled"
          placeholder="Trois réponses séparées par une virgule"
          value={currentAnswers}
          onChangeText={setCurrentAnswers}
          py="2"
          px="3"
          fontSize="md"
          mb="4"
        />
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
        />
        {questions.length > 0 && (
          <Box mt="4">
            <Text fontSize="xl" bold mb="2">Prévisualisation des questions</Text>
            {questions.map((q, index) => (
              <Box key={index} bg="light.200" p="2" rounded="md" mb="2">
                <Text bold>{q.theme}</Text>
                <Text>{q.content}</Text>
                <Text fontSize="xs">Réponses: {q.answers.join(', ')}</Text>
              </Box>
            ))}
          </Box>
        )}
        <Button
          mt="5"
          colorScheme="cyan"
          onPress={handleSubmit}
        >
          Envoyer
        </Button>
      </VStack>
    </ScrollView>
  );
}

export default CreateQuestionnaireScreen;