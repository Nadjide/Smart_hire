import React, { useState, useContext, useEffect } from "react";
import {
  VStack,
  Box,
  Center,
  Text,
  Heading,
  Button,
  Modal,
  ScrollView,
  Spinner,
  Progress,
  HStack,
} from "native-base";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../AuthContext";
import { SERVER_IP } from "../config";

export default function QuestionScreen() {
  const { userEmail } = useContext(AuthContext);
  const navigation = useNavigation();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      const response = await fetch(`${SERVER_IP}/questionnaires/`);
      const data = await response.json();
      setQuestionnaires(data);
    } catch (error) {
      console.error("Failed to fetch questionnaires:", error);
    }
  };

  const fetchQuestions = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_IP}/questionnaires/${category}`);
      const data = await response.json();
      setQuestions(data.questions);
      setSelectedQuestionnaire(data.category);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answerIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answerIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestionIndex] === undefined) {
      Alert.alert("Erreur", "Veuillez sélectionner une réponse pour cette question.");
      return;
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmitAnswers = async () => {
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === undefined) {
        Alert.alert("Erreur", "Veuillez répondre à toutes les questions avant de soumettre.");
        return;
      }
    }

    const answersToSubmit = Object.keys(answers).map((key) => ({
      question_index: parseInt(key),
      answer_index: answers[key],
      question_text: questions[key].content,
      theme: questions[key].theme,
      answer_text: questions[key].answers[answers[key]].text,
      score: questions[key].answers[answers[key]].score,
    }));

    try {
      const response = await fetch(`${SERVER_IP}/responses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          questionnaire_category: selectedQuestionnaire,
          answers: answersToSubmit,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }

      console.log("Submitted Answers:", answersToSubmit);
      Alert.alert(
        "Questionnaire terminé",
        "Vos réponses ont été enregistrées avec succès!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Landing"),
          },
        ]
      );
    } catch (error) {
      console.error("Failed to submit answers:", error);
      alert("Failed to submit answers");
    }
  };

  const handleNextOrSubmit = () => {
    if (currentQuestionIndex < questions.length - 1) {
      handleNextQuestion();
    } else {
      handleSubmitAnswers();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Center flex={1} px="3" bg="white">
      <Box safeArea p="2" py="8" w="90%" maxW="400" bg="white" rounded="lg" shadow={2}>
        {!selectedQuestionnaire ? (
          <>
            <Heading size="lg" textAlign="center" mb="6">
              Sélectionnez un Questionnaire
            </Heading>
            <Button onPress={() => setModalVisible(true)}>Choisir un Questionnaire</Button>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Liste des Questionnaires</Modal.Header>
                <Modal.Body>
                  <ScrollView>
                    {questionnaires.map((item, index) => (
                      <Button
                        key={index}
                        mb="2"
                        onPress={() => fetchQuestions(item.category)}
                      >
                        {item.category}
                      </Button>
                    ))}
                  </ScrollView>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        ) : (
          <>
            {loading ? (
              <Center flex={1}>
                <Spinner color="cyan.500" />
              </Center>
            ) : (
              <>
                <Heading size="md" textAlign="center" my="4">
                  {selectedQuestionnaire}
                </Heading>
                <HStack space={2} alignItems="center" mb="4">
                  <Progress
                    value={(currentQuestionIndex + 1) / questions.length * 100}
                    flex={1}
                    colorScheme="cyan"
                  />
                  <Text>{currentQuestionIndex + 1}/{questions.length}</Text>
                </HStack>
                {currentQuestion && (
                  <VStack space={4}>
                    <Text fontSize="lg" bold>
                      {currentQuestion.content}
                    </Text>
                    {currentQuestion.answers.map((answer, index) => (
                      <Button
                        key={index}
                        variant={answers[currentQuestionIndex] === index ? "solid" : "outline"}
                        colorScheme="cyan"
                        my="2"
                        onPress={() => handleAnswerChange(currentQuestionIndex, index)}
                      >
                        {answer.text}
                      </Button>
                    ))}
                    <Button mt="4" colorScheme="cyan" onPress={handleNextOrSubmit}>
                      {currentQuestionIndex < questions.length - 1 ? "Suivant" : "Soumettre"}
                    </Button>
                  </VStack>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Center>
  );
}