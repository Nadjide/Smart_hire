import React, { useState } from 'react';
import { VStack, Input, Button, IconButton, Icon, Box, Text, ScrollView, Divider } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

function CreateQuestionnaireScreen() {
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('');
  const [currentContent, setCurrentContent] = useState('');

  const handleAddQuestion = () => {
    if (currentTheme && currentContent) {
      setQuestions([...questions, { theme: currentTheme, content: currentContent }]);
      setCurrentTheme('');
      setCurrentContent('');
    } else {
      alert('Please fill in both theme and content fields');
    }
  };

  const handleSubmit = async () => {
    const body = { category, questions };
    try {
      const response = await fetch('http://10.6.0.107:8000/questionnaires/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Failed to create questionnaire');
      alert('Questionnaire created successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <ScrollView>
      <VStack space={4} mt="5" px="4">
        <Input
          variant="filled"
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
          py="2"
          px="3"
          fontSize="md"
        />
        <Input
          variant="filled"
          placeholder="Theme"
          value={currentTheme}
          onChangeText={setCurrentTheme}
          py="2"
          px="3"
          fontSize="md"
          mb="2"
        />
        <Input
          variant="filled"
          placeholder="Content"
          value={currentContent}
          onChangeText={setCurrentContent}
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
            <Text fontSize="xl" bold mb="2">Questions Preview:</Text>
            {questions.map((q, index) => (
              <Box key={index} bg="light.200" p="2" rounded="md" mb="2">
                <Text bold>{q.theme}</Text>
                <Text>{q.content}</Text>
              </Box>
            ))}
          </Box>
        )}
        <Button
          mt="5"
          colorScheme="cyan"
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </VStack>
    </ScrollView>
  );
}

export default CreateQuestionnaireScreen;