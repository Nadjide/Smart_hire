import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, StyleSheet } from 'react-native';
import { Box, Text, Heading, VStack, Spinner, Select, Center, HStack, Button } from 'native-base';
import { PieChart } from 'react-native-gifted-charts';
import { SERVER_IP } from '../config';

const CompareCandidatesScreen = () => {
  const [candidates, setCandidates] = useState([]);
  const [responses, setResponses] = useState([]);
  const [selectedCandidate1, setSelectedCandidate1] = useState('');
  const [selectedCandidate2, setSelectedCandidate2] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    fetchCandidates();
    fetchResponses();
  }, []);

  useEffect(() => {
    if (showModal) {
      typeEffect(analysisText);
    }
  }, [showModal, analysisText]);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${SERVER_IP}/candidats/`);
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await fetch(`${SERVER_IP}/responses/`);
      const data = await response.json();
      setResponses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch responses:", error);
      setResponses([]);
    }
  };

  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      const response1 = await fetch(`${SERVER_IP}/responses/${selectedCandidate1}`);
      const response2 = await fetch(`${SERVER_IP}/responses/${selectedCandidate2}`);
      const data1 = await response1.json();
      const data2 = await response2.json();
      const questionnaire1 = data1.find(item => item.questionnaire_category === selectedQuestionnaire);
      const questionnaire2 = data2.find(item => item.questionnaire_category === selectedQuestionnaire);
      if (questionnaire1 && questionnaire2) {
        setComparisonData({ candidate1: questionnaire1, candidate2: questionnaire2 });
      } else {
        setComparisonData(null);
      }
    } catch (error) {
      console.error("Failed to fetch comparison data:", error);
      setComparisonData(null);
    } finally {
      setLoading(false);
    }
  };

  const getEligibleCandidates = (questionnaireCategory) => {
    const eligibleEmails = responses
      .filter(response => response.questionnaire_category === questionnaireCategory)
      .map(response => response.email);
    return candidates.filter(candidate => eligibleEmails.includes(candidate.email));
  };

  const calculateScoresByTheme = (answers) => {
    const themeScores = {};
    answers.forEach(answer => {
      if (!themeScores[answer.theme]) {
        themeScores[answer.theme] = { totalScore: 0, questionCount: 0 };
      }
      themeScores[answer.theme].totalScore += answer.score;
      themeScores[answer.theme].questionCount += 1;
    });
    return themeScores;
  };

  const generatePieData = (themeScores) => {
    return Object.keys(themeScores).map((theme, index) => ({
      value: themeScores[theme].totalScore,
      label: theme,
      color: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#2ecc71', '#e74c3c', '#3498db', '#9b59b6'][index % 8],
      text: themeScores[theme].totalScore.toString(),
      textColor: 'white',
      textBackgroundColor: 'rgba(0,0,0,0.5)',
    }));
  };

  const generateAnalysisText = () => {
    if (!comparisonData) return '';
    const { candidate1, candidate2 } = comparisonData;
    const themeScores1 = calculateScoresByTheme(candidate1.answers);
    const themeScores2 = calculateScoresByTheme(candidate2.answers);
    let analysis = '';
    for (const theme in themeScores1) {
      const averageScore1 = themeScores1[theme].totalScore / themeScores1[theme].questionCount;
      const averageScore2 = themeScores2[theme].totalScore / themeScores2[theme].questionCount;
      analysis += `${candidates.find(c => c.email === selectedCandidate1)?.nom || 'Candidat 1'} est `;
      analysis += averageScore1 >= averageScore2 ? `meilleur` : `moins bon`;
      analysis += ` que ${candidates.find(c => c.email === selectedCandidate2)?.nom || 'Candidat 2'} en ${theme}.\n\n`;
    }
    return analysis;
  };

  const typeEffect = (text) => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  const renderComparison = () => {
    if (!comparisonData) return null;

    const { candidate1, candidate2 } = comparisonData;
    const themeScores1 = calculateScoresByTheme(candidate1.answers);
    const themeScores2 = calculateScoresByTheme(candidate2.answers);

    const pieData1 = generatePieData(themeScores1);
    const pieData2 = generatePieData(themeScores2);

    return (
      <VStack space={4} mt="4">
        <Heading size="md" textAlign="center">Comparaison des Scores</Heading>
        <VStack space={4} alignItems="center">
          <Heading size="sm">Candidat 1: {candidates.find(c => c.email === selectedCandidate1)?.nom || 'Candidat 1'}</Heading>
          <PieChart
            data={pieData1}
            showText
            textSize={10}
            radius={120}
            centerLabelComponent={() => <Text>Total Score</Text>}
          />
          {pieData1.map((item, index) => (
            <HStack key={index} space={2} alignItems="center" my="1">
              <Box w="3" h="3" bg={item.color} />
              <Text>{item.label}: {item.value}</Text>
            </HStack>
          ))}
        </VStack>
        <VStack space={4} alignItems="center">
          <Heading size="sm">Candidat 2: {candidates.find(c => c.email === selectedCandidate2)?.nom || 'Candidat 2'}</Heading>
          <PieChart
            data={pieData2}
            showText
            textSize={10}
            radius={120}
            centerLabelComponent={() => <Text>Total Score</Text>}
          />
          {pieData2.map((item, index) => (
            <HStack key={index} space={2} alignItems="center" my="1">
              <Box w="3" h="3" bg={item.color} />
              <Text>{item.label}: {item.value}</Text>
            </HStack>
          ))}
        </VStack>
        <Button onPress={() => {
          setAnalysisText(generateAnalysisText());
          setShowModal(true);
        }}>
          <Text>Analyse</Text>
        </Button>
      </VStack>
    );
  };

  return (
    <ScrollView flex={1} bg="white">
      <Box safeArea p="4">
        <Heading size="lg" textAlign="center" mb="6">Comparer les Candidats</Heading>
        <VStack space={4}>
          <Select
            placeholder="Sélectionner un questionnaire"
            selectedValue={selectedQuestionnaire}
            onValueChange={(value) => {
              setSelectedQuestionnaire(value);
              setSelectedCandidate1('');
              setSelectedCandidate2('');
            }}
          >
            {[...new Set(responses.map(r => r.questionnaire_category))].map(category => (
              <Select.Item key={category} label={category} value={category} />
            ))}
          </Select>
          {selectedQuestionnaire && (
            <>
              <Select
                placeholder="Sélectionner le premier candidat"
                selectedValue={selectedCandidate1}
                onValueChange={(value) => setSelectedCandidate1(value)}
              >
                {getEligibleCandidates(selectedQuestionnaire).map(candidate => (
                  <Select.Item key={candidate.email} label={`${candidate.nom} ${candidate.prénom}`} value={candidate.email} />
                ))}
              </Select>
              <Select
                placeholder="Sélectionner le deuxième candidat"
                selectedValue={selectedCandidate2}
                onValueChange={(value) => setSelectedCandidate2(value)}
              >
                {getEligibleCandidates(selectedQuestionnaire).map(candidate => (
                  <Select.Item key={candidate.email} label={`${candidate.nom} ${candidate.prénom}`} value={candidate.email} />
                ))}
              </Select>
            </>
          )}
          <Button onPress={fetchComparisonData}>
            <Text>Comparer</Text>
          </Button>
          {loading ? (
            <Center mt="4">
              <Spinner color="cyan.500" />
            </Center>
          ) : (
            renderComparison()
          )}
        </VStack>
      </Box>
      <Modal visible={showModal} transparent animationType="slide">
        <Box style={styles.modalContainer}>
          <Box style={styles.modalContent}>
            <Heading size="md" mb="4">Analyse des Scores</Heading>
            <ScrollView>
              <Text>{displayedText}</Text>
            </ScrollView>
            <Button onPress={() => setShowModal(false)}>
              <Text>Fermer</Text>
            </Button>
          </Box>
        </Box>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default CompareCandidatesScreen;