import React, { useState, useEffect } from 'react';
import { VStack, Input, Button, IconButton, Icon, Box, Text, Select, Heading, Center, useToast, HStack, Modal, Spinner } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { SERVER_IP } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

const themes = ["Comportement", "Motivation", "Éthique", "Compétences techniques", "Communication", "Leadership", "Résolution de problèmes", "Travail d'équipe"];

function CreateQuestionnaireScreen() {
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [currentContent, setCurrentContent] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [score1, setScore1] = useState(1);
  const [score2, setScore2] = useState(1);
  const [score3, setScore3] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSavedQuestions();
  }, []);

  const fetchSavedQuestions = async () => {
    try {
      const response = await fetch(`${SERVER_IP}/questions/`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch saved questions:", error);
    }
  };

  const fetchRandomSuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_IP}/questions/`);
      const data = await response.json();
      const filteredSuggestions = data.filter(s => s.theme === currentTheme);
      if (filteredSuggestions.length > 0) {
        const randomSuggestion = filteredSuggestions[Math.floor(Math.random() * filteredSuggestions.length)];
        setCurrentContent(randomSuggestion.content);
      } else {
        toast.show({ description: "Aucune suggestion trouvée pour ce thème.", status: "warning" });
      }
    } catch (error) {
      console.error("Failed to fetch random suggestion:", error);
    }
    setLoading(false);
  };

  const handleAddQuestion = () => {
    if (currentTheme && currentContent && answer1 && answer2 && answer3) {
      const answersArray = [
        { text: answer1.trim(), score: score1 },
        { text: answer2.trim(), score: score2 },
        { text: answer3.trim(), score: score3 }
      ];
      setQuestions([...questions, { theme: currentTheme, content: currentContent, answers: answersArray }]);
      setCurrentContent('');
      setAnswer1('');
      setAnswer2('');
      setAnswer3('');
      setScore1(1);
      setScore2(1);
      setScore3(1);
      toast.show({ description: "Question ajoutée avec succès", status: "success" });
    } else {
      toast.show({ description: "Veuillez remplir correctement tous les champs.", status: "error" });
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
      toast.show({ description: "Questionnaire créé avec succès", status: "success" });
      setCategory('');
      setQuestions([]);
    } catch (error) {
      toast.show({ description: "Error: " + error.message, status: "error" });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack space={4} mt="2" px="4" flex={1}>
        <Heading size="lg" textAlign="center" mb="5" color="cyan.700">Créer un Questionnaire</Heading>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Box mb="4">
            <Input
              variant="outline"
              placeholder="Catégorie"
              value={category}
              onChangeText={setCategory}
              py="3"
              px="3"
              fontSize="md"
              borderColor="cyan.500"
              _focus={{ borderColor: "cyan.700" }}
            />
            <Select
              selectedValue={currentTheme}
              minWidth="200"
              accessibilityLabel="Choisissez un thème"
              placeholder="Choisissez un thème"
              _selectedItem={{
                bg: "cyan.600",
                endIcon: <Icon as={AntDesign} name="check" size="5" />,
              }}
              mt="1"
              onValueChange={itemValue => setCurrentTheme(itemValue)}
              borderColor="cyan.500"
              _focus={{ borderColor: "cyan.700" }}
            >
              {themes.map((theme, index) => (
                <Select.Item key={index} label={theme} value={theme} />
              ))}
            </Select>
          </Box>
          <Box mb="4">
            <Button colorScheme="cyan" onPress={() => { setModalVisible(true); fetchRandomSuggestion(); }}>
              Suggestions de Questions
            </Button>
          </Box>
          <Box mb="4">
            <Heading size="md" color="cyan.700">Ajouter une Nouvelle Question</Heading>
            <Input
              variant="outline"
              placeholder="Contenu de la question"
              value={currentContent}
              onChangeText={setCurrentContent}
              py="3"
              px="3"
              fontSize="md"
              mb="2"
              borderColor="cyan.500"
              _focus={{ borderColor: "cyan.700" }}
            />
            <HStack space={2} mb="2" alignItems="center">
              <Input
                variant="outline"
                placeholder="Réponse 1"
                value={answer1}
                onChangeText={setAnswer1}
                py="3"
                px="3"
                fontSize="md"
                flex={1}
                borderColor="cyan.500"
                _focus={{ borderColor: "cyan.700" }}
              />
              <Select
                selectedValue={score1.toString()}
                minWidth="80px"
                accessibilityLabel="Choisissez un score"
                placeholder="Score"
                _selectedItem={{
                  bg: "cyan.600",
                  endIcon: <Icon as={AntDesign} name="check" size="5" />,
                }}
                mt="1"
                onValueChange={itemValue => setScore1(parseInt(itemValue))}
                borderColor="cyan.500"
                _focus={{ borderColor: "cyan.700" }}
              >
                <Select.Item label="1" value="1" />
                <Select.Item label="2" value="2" />
                <Select.Item label="3" value="3" />
              </Select>
            </HStack>
            <HStack space={2} mb="2" alignItems="center">
              <Input
                variant="outline"
                placeholder="Réponse 2"
                value={answer2}
                onChangeText={setAnswer2}
                py="3"
                px="3"
                fontSize="md"
                flex={1}
                borderColor="cyan.500"
                _focus={{ borderColor: "cyan.700" }}
              />
              <Select
                selectedValue={score2.toString()}
                minWidth="80px"
                accessibilityLabel="Choisissez un score"
                placeholder="Score"
                _selectedItem={{
                  bg: "cyan.600",
                  endIcon: <Icon as={AntDesign} name="check" size="5" />,
                }}
                mt="1"
                onValueChange={itemValue => setScore2(parseInt(itemValue))}
                borderColor="cyan.500"
                _focus={{ borderColor: "cyan.700" }}
              >
                <Select.Item label="1" value="1" />
                <Select.Item label="2" value="2" />
                <Select.Item label="3" value="3" />
              </Select>
            </HStack>
            <HStack space={2} mb="2" alignItems="center">
              <Input
                variant="outline"
                placeholder="Réponse 3"
                value={answer3}
                onChangeText={setAnswer3}
                py="3"
                px="3"
                fontSize="md"
                flex={1}
                borderColor="cyan.500"
                _focus={{ borderColor: "cyan.700" }}
              />
              <Select
                selectedValue={score3.toString()}
                minWidth="80px"
                accessibilityLabel="Choisissez un score"
                placeholder="Score"
                _selectedItem={{
                  bg: "cyan.600",
                  endIcon: <Icon as={AntDesign} name="check" size="5" />,
                }}
                mt="1"
                onValueChange={itemValue => setScore3(parseInt(itemValue))}
                borderColor="cyan.500"
                _focus={{ borderColor: "cyan.700" }}
              >
                <Select.Item label="1" value="1" />
                <Select.Item label="2" value="2" />
                <Select.Item label="3" value="3" />
              </Select>
            </HStack>
            <Center>
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
                mb="4"
              />
            </Center>
          </Box>
          {questions.length > 0 && (
            <Box mb="4">
              <Heading size="md" color="cyan.700">Prévisualisation des Questions</Heading>
              {questions.map((item, index) => (
                <Box key={index} bg="light.200" p="4" rounded="md" mb="2" borderColor="cyan.500" borderWidth="1">
                  <Text bold fontSize="lg" color="cyan.800">{item.theme}</Text>
                  <Text fontSize="md">{item.content}</Text>
                  {item.answers.map((answer, idx) => (
                    <HStack key={idx} alignItems="center">
                      <Text fontSize="sm" color="cyan.600" flex={1}>{`Réponse ${idx + 1}: ${answer.text}`}</Text>
                      <Text fontSize="sm" color="cyan.600">{`Score: ${answer.score}`}</Text>
                    </HStack>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </ScrollView>
        <Button
          mt="5"
          colorScheme="cyan"
          onPress={handleSubmit}
          _text={{ color: 'white', fontSize: 'md', fontWeight: 'bold' }}
        >
          Envoyer
        </Button>
      </VStack>
      <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)} size="lg">
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Suggestion de Question</Modal.Header>
          <Modal.Body>
            {loading ? (
              <Center>
                <Spinner size="lg" color="cyan.500" />
              </Center>
            ) : (
              <Box>
                <Text>{currentContent}</Text>
                <Button mt="4" colorScheme="cyan" onPress={() => setModalVisible(false)}>
                  Utiliser cette question
                </Button>
              </Box>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  );
}

export default CreateQuestionnaireScreen;