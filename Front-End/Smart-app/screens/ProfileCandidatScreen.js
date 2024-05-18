import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Text, Heading, VStack, Spinner } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { SERVER_IP } from '../config';

const ProfileCandidatScreen = () => {
  const route = useRoute();
  const { candidat } = route.params;
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(`${SERVER_IP}/responses?email=${candidat.email}`);
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

  const themeScores = calculateScoresByTheme();

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
                {Object.keys(themeScores).map((theme, index) => (
                  <Box key={index} p="4" borderWidth="1" borderColor="coolGray.200" rounded="md" mb="2">
                    <Text bold>Thème: {theme}</Text>
                    <Text>Total Points: {themeScores[theme].totalScore}</Text>
                    <Text>Nombre de Questions: {themeScores[theme].questionCount}</Text>
                    <Text>Moyenne des Points: {(themeScores[theme].totalScore / themeScores[theme].questionCount).toFixed(2)}</Text>
                  </Box>
                ))}
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
    </ScrollView>
  );
}

export default ProfileCandidatScreen;