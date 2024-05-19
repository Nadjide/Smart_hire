import React, { useEffect, useState } from 'react';
import { ScrollView, Button, Modal } from 'react-native';
import { Box, Text, Heading, VStack, Spinner, HStack } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { PieChart } from 'react-native-gifted-charts';
import { SERVER_IP } from '../config';

const ProfileCandidatScreen = () => {
  const route = useRoute();
  const { candidat } = route.params;
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(`${SERVER_IP}/responses/${candidat.email}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setResponses(data);
        } else {
          setResponses([]);
        }
      } catch (error) {
        console.error("Failed to fetch responses:", error);
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [candidat.email]);

  const calculateScoresByTheme = () => {
    const themeScores = {};
    responses.forEach(response => {
      response.answers.forEach(answer => {
        if (!themeScores[answer.theme]) {
          themeScores[answer.theme] = { totalScore: 0, questionCount: 0 };
        }
        themeScores[answer.theme].totalScore += answer.score;
        themeScores[answer.theme].questionCount += 1;
      });
    });
    return themeScores;
  };

  const generateFeedback = () => {
    const themeScores = calculateScoresByTheme();
    let totalScore = 0;
    let totalQuestions = 0;

    for (let theme in themeScores) {
      totalScore += themeScores[theme].totalScore;
      totalQuestions += themeScores[theme].questionCount;
    }

    const averageScoreOverall = totalScore / totalQuestions;
    let feedback = '';

    for (let theme in themeScores) {
      const averageScore = themeScores[theme].totalScore / themeScores[theme].questionCount;
      feedback += `Thème: ${theme}\nScore moyen: ${averageScore.toFixed(2)}\n`;

      if (averageScore >= averageScoreOverall) {
        feedback += "Points forts: Supérieur à la moyenne générale.\n\n";
      } else {
        feedback += "Points à améliorer: Inférieur à la moyenne générale.\n\n";
      }
    }

    setFeedback(feedback);
  };

  const themeScores = calculateScoresByTheme();
  const pieData = Object.keys(themeScores).map((theme, index) => ({
    value: themeScores[theme].totalScore,
    label: theme,
    color: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#2ecc71', '#e74c3c', '#3498db', '#9b59b6'][index % 8],
    text: themeScores[theme].totalScore.toString(),
    textColor: 'white',
    textBackgroundColor: 'rgba(0,0,0,0.5)',
  }));

  return (
    <ScrollView flex={1} bg="white">
      <Box safeArea p="4">
        <Heading size="lg" textAlign="center" mb="6">
          Profil de {candidat.nom} {candidat.prénom}
        </Heading>
        <VStack space={4}>
          <Text fontSize="md"><Text bold>Email:</Text> {candidat.email}</Text>
          <Text fontSize="md"><Text bold>Date de naissance:</Text> {candidat.date_de_naissance}</Text>
          <Text fontSize="md"><Text bold>Téléphone:</Text> {candidat.téléphone}</Text>
          <Heading size="md" textAlign="center" my="4">Questionnaires Répondus</Heading>
          {loading ? (
            <Spinner color="cyan.500" />
          ) : (
            responses.length > 0 ? (
              <>
                <Box alignItems="center" my="4">
                  <PieChart
                    data={pieData}
                    showText
                    textSize={10}
                    radius={120}
                    centerLabelComponent={() => <Text>Total Score</Text>}
                  />
                </Box>
                <Box alignItems="center" my="4">
                  {pieData.map((item, index) => (
                    <HStack key={index} space={2} alignItems="center" my="1">
                      <Box w="3" h="3" bg={item.color} />
                      <Text>{item.label}: {item.value}</Text>
                    </HStack>
                  ))}
                </Box>
                <Button title="Lancer Analyse" onPress={() => { generateFeedback(); setShowModal(true); }} />
                {responses.map((response, index) => (
                  <Box key={index} p="4" borderWidth="1" borderColor="coolGray.200" rounded="md" mb="2">
                    <Text bold>Questionnaire: {response.questionnaire_category}</Text>
                    {response.answers.map((answer, idx) => (
                      <Box key={idx} mt="2">
                        <Text bold>Question {answer.question_index + 1}: {answer.question_text}</Text>
                        <Text>Réponse: {answer.answer_text}</Text>
                        <Text>Score: {answer.score}</Text>
                      </Box>
                    ))}
                  </Box>
                ))}
              </>
            ) : (
              <Text textAlign="center" mt="4">Aucun questionnaire répondu.</Text>
            )
          )}
        </VStack>
      </Box>
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <Box flex={1} justifyContent="center" alignItems="center" bg="rgba(0,0,0,0.5)">
          <Box width="80%" bg="white" p="4" rounded="md">
            <Heading size="md" mb="4">Analyse des Scores</Heading>
            <ScrollView>
              <Text>{feedback}</Text>
            </ScrollView>
            <Button title="Fermer" onPress={() => setShowModal(false)} />
          </Box>
        </Box>
      </Modal>
    </ScrollView>
  );
}

export default ProfileCandidatScreen;